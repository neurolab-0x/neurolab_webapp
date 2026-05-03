import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  MessageSquarePlus,
  MoreHorizontal,
  Paperclip,
  RefreshCcw,
  Send,
  Sparkles,
  Trash2,
  Volume2,
} from "lucide-react";
import { PortalErrorBoundary } from "../components/PortalErrorBoundary";
import {
  chatApi,
  type ChatAttachment,
  type ChatConversation,
  type ChatMessage,
} from "../lib/chat";

const SUGGESTIONS = [
  "Explain my latest EEG trend",
  "Summarize this conversation",
  "How should I interpret my stress signals?",
  "What should I watch in my sleep data?",
];

type AnalysisContext = {
  fileName?: string;
  stateLabel?: string;
  confidence?: number;
  recommendations?: string[];
};

const timeLabel = (value?: string) =>
  value
    ? new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const dateLabel = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      })
    : "";

function ChatInner() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [includeHealthData, setIncludeHealthData] = useState(true);
  const [analysisContext, setAnalysisContext] = useState<AnalysisContext | null>(
    null,
  );
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ) || null,
    [activeConversationId, conversations],
  );

  useEffect(() => {
    const loadBootState = async () => {
      try {
        const stored = sessionStorage.getItem("neurai_analysis_context");
        if (stored) {
          const parsed = JSON.parse(stored) as AnalysisContext;
          setAnalysisContext(parsed);
          sessionStorage.removeItem("neurai_analysis_context");
          if (parsed.fileName) {
            setDraft(
              `Help me understand the findings from ${parsed.fileName}.`,
            );
          }
        }
      } catch (error) {
        console.warn("Failed to restore analysis context", error);
      }

      await refreshConversations(true);
    };

    void loadBootState();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const refreshConversations = async (bootstrap = false) => {
    setLoadingConversations(true);
    try {
      const items = await chatApi.listConversations();
      setConversations(items);

      const nextId =
        activeConversationId && items.some((item) => item.id === activeConversationId)
          ? activeConversationId
          : items[0]?.id || null;

      if (nextId) {
        setActiveConversationId(nextId);
      } else if (bootstrap) {
        const created = await chatApi.createConversation();
        setConversations([created.conversation]);
        setActiveConversationId(created.conversation.id);
      }
    } catch (error) {
      console.error("Failed to load conversations", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const payload = await chatApi.getConversation(activeConversationId);
        setMessages(payload.messages);
        setConversations((current) =>
          current.map((item) =>
            item.id === payload.conversation.id ? payload.conversation : item,
          ),
        );
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    void loadMessages();
  }, [activeConversationId]);

  const upsertConversation = (conversation: ChatConversation) => {
    setConversations((current) => {
      const next = current.filter((item) => item.id !== conversation.id);
      return [conversation, ...next].sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime(),
      );
    });
  };

  const handleCreateConversation = async () => {
    try {
      const payload = await chatApi.createConversation();
      setConversations((current) => [payload.conversation, ...current]);
      setActiveConversationId(payload.conversation.id);
      setMessages([]);
    } catch (error) {
      console.error("Failed to create conversation", error);
    }
  };

  const handleSend = async (text: string = draft) => {
    const message = text.trim();
    if (!message || sending) return;

    let conversationId = activeConversationId;
    if (!conversationId) {
      const created = await chatApi.createConversation();
      conversationId = created.conversation.id;
      setConversations((current) => [created.conversation, ...current]);
      setActiveConversationId(created.conversation.id);
    }

    const optimisticUserMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      conversationId,
      role: "user",
      content: message,
      attachments: [...attachments],
      createdAt: new Date().toISOString(),
    };

    const optimisticAssistantMessage: ChatMessage = {
      id: `temp-assistant-${Date.now()}`,
      conversationId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [
      ...current,
      optimisticUserMessage,
      optimisticAssistantMessage,
    ]);
    setDraft("");
    setAttachments([]);
    setSending(true);

    try {
      const payload = await chatApi.sendMessage(conversationId, {
        message,
        attachments,
        includeHealthData,
      });

      setMessages((current) => [
        ...current.filter(
          (item) =>
            item.id !== optimisticUserMessage.id &&
            item.id !== optimisticAssistantMessage.id,
        ),
        payload.userMessage,
        payload.assistantMessage,
      ]);
      upsertConversation(payload.conversation);
    } catch (error) {
      console.error("Failed to send chat message", error);
      setMessages((current) =>
        current.filter(
          (item) =>
            item.id !== optimisticUserMessage.id &&
            item.id !== optimisticAssistantMessage.id,
        ),
      );
    } finally {
      setSending(false);
    }
  };

  const handleRenameConversation = async (conversation: ChatConversation) => {
    const nextTitle = window.prompt("Rename conversation", conversation.title);
    if (!nextTitle || nextTitle.trim() === conversation.title) return;

    try {
      const payload = await chatApi.renameConversation(
        conversation.id,
        nextTitle.trim(),
      );
      upsertConversation(payload.conversation);
    } catch (error) {
      console.error("Failed to rename conversation", error);
    }
  };

  const handleRefreshTitle = async (conversationId: string) => {
    try {
      const payload = await chatApi.refreshTitle(conversationId);
      upsertConversation(payload.conversation);
    } catch (error) {
      console.error("Failed to refresh title", error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    const confirmed = window.confirm(
      "Delete this conversation? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await chatApi.deleteConversation(conversationId);
      const nextConversations = conversations.filter(
        (conversation) => conversation.id !== conversationId,
      );
      setConversations(nextConversations);
      if (activeConversationId === conversationId) {
        if (nextConversations[0]) {
          setActiveConversationId(nextConversations[0].id);
        } else {
          setActiveConversationId(null);
          setMessages([]);
          await handleCreateConversation();
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation", error);
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.edf,.pdf,.wav,.mp3,.ogg,.m4a";
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const type = file.type.startsWith("audio/") ? "voice" : "file";
      setAttachments((current) => [
        ...current,
        { type, name: file.name },
      ]);
    };
    input.click();
  };

  const speakMessage = (message: ChatMessage) => {
    if (speakingId === message.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(message.id);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="flex h-full flex-col rounded-3xl border border-border/60 bg-card/70 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BrainCircuit size={16} className="text-primary" />
              Neural Chat
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Context-aware conversations with auto-updating titles
            </p>
          </div>
          <button
            onClick={() => void handleCreateConversation()}
            className="rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <MessageSquarePlus size={14} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-primary/15 bg-primary/5 px-3 py-2">
          <span className="text-xs text-muted-foreground">
            Include neural history
          </span>
          <button
            onClick={() => setIncludeHealthData((value) => !value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              includeHealthData
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {includeHealthData ? "On" : "Off"}
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
          {loadingConversations ? (
            <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              Loading conversations...
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversationId(conversation.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  conversation.id === activeConversationId
                    ? "border-primary/40 bg-primary/10"
                    : "border-border/50 bg-background/70 hover:border-primary/20 hover:bg-primary/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {conversation.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {conversation.latestMessagePreview || "No messages yet"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleRefreshTitle(conversation.id);
                      }}
                      className="rounded-lg p-1 hover:bg-background"
                      title="Refresh title"
                    >
                      <RefreshCcw size={14} />
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleRenameConversation(conversation);
                      }}
                      className="rounded-lg p-1 hover:bg-background"
                      title="Rename"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleDeleteConversation(conversation.id);
                      }}
                      className="rounded-lg p-1 hover:bg-background"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{dateLabel(conversation.lastMessageAt)}</span>
                  <span>{conversation.messageCount} msgs</span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      <section className="flex h-full flex-col rounded-3xl border border-border/60 bg-card/70 shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Sparkles size={18} className="text-primary" />
                {activeConversation?.title || "New Conversation"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Titles update as the conversation intent changes.
              </p>
            </div>
            {activeConversation && (
              <div className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs text-muted-foreground">
                {activeConversation.titleSource === "manual"
                  ? "Manual title"
                  : "Auto title"}
              </div>
            )}
          </div>

          {analysisContext && (
            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-3 text-sm text-foreground">
              <p className="font-medium">
                Analysis context ready{analysisContext.fileName ? `: ${analysisContext.fileName}` : ""}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {analysisContext.stateLabel
                  ? `Detected state: ${analysisContext.stateLabel}. `
                  : ""}
                {analysisContext.confidence !== undefined
                  ? `Confidence: ${analysisContext.confidence.toFixed(1)}%. `
                  : ""}
                The next message can reference this report directly.
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {loadingMessages ? (
            <div className="text-sm text-muted-foreground">Loading messages...</div>
          ) : (
            <>
              {messages.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border/70 bg-background/60 p-6">
                  <p className="text-sm text-muted-foreground">
                    Start a new thread. The backend persists each conversation, and the AI will keep refining the title based on what you ask.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => void handleSend(suggestion)}
                        className="rounded-full border border-border/60 bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border/60 bg-background text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {message.content || (sending ? "Thinking..." : "")}
                    </p>
                    {!!message.attachments?.length && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.attachments.map((attachment, index) => (
                          <span
                            key={`${attachment.name}-${index}`}
                            className="rounded-full border border-white/20 px-2 py-1 text-[11px]"
                          >
                            {attachment.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-between gap-3 text-[11px] opacity-80">
                      <span>{timeLabel(message.createdAt)}</span>
                      {message.role === "assistant" && message.content && (
                        <button
                          onClick={() => speakMessage(message)}
                          className="inline-flex items-center gap-1"
                        >
                          <Volume2 size={12} />
                          {speakingId === message.id ? "Stop" : "Read"}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-3xl border border-border/60 bg-background px-4 py-3 text-sm text-muted-foreground">
                    Generating response...
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border/60 px-5 py-4">
          {!!attachments.length && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((attachment, index) => (
                <span
                  key={`${attachment.name}-${index}`}
                  className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs text-foreground"
                >
                  {attachment.name}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-3xl border border-border/60 bg-background p-3 shadow-inner">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              rows={3}
              placeholder="Ask about a scan, stress pattern, sleep signal, or conversation summary..."
              className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFileUpload}
                  className="rounded-full border border-border/60 p-2 text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                  title="Attach reference"
                >
                  <Paperclip size={16} />
                </button>
                <div className="text-xs text-muted-foreground">
                  {includeHealthData
                    ? "Using historical neural context"
                    : "Using current conversation only"}
                </div>
              </div>

              <button
                onClick={() => void handleSend()}
                disabled={sending || !draft.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function UserChat() {
  return (
    <PortalErrorBoundary>
      <ChatInner />
    </PortalErrorBoundary>
  );
}
