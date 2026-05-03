import { BASE_URL } from "./api";

export interface ChatAttachment {
  type: "file" | "voice";
  name: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  titleSource: "auto" | "manual";
  latestMessagePreview: string;
  lastMessageAt: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  activeInference?: {
    jobId: string;
    status: "queued" | "streaming" | "completed" | "failed";
    submittedAt?: string | null;
    completedAt?: string | null;
    errorMessage?: string | null;
  } | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments?: ChatAttachment[];
  createdAt: string;
  updatedAt?: string;
}

export interface ChatJob {
  id: string;
  status: string;
  eventsUrl: string;
  statusUrl: string;
  submittedAt?: string;
}

export interface ChatJobEvent {
  event: string;
  data: unknown;
}

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("neurai_token") || ""}`,
  "Content-Type": "application/json",
});

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...authHeaders(),
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}

async function streamRequest(
  path: string,
  onEvent: (event: ChatJobEvent) => void | Promise<void>,
): Promise<void> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(),
  });

  if (!response.ok || !response.body) {
    throw new Error(`${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() || "";

    for (const frame of frames) {
      const parsed = parseSseFrame(frame);
      if (parsed) {
        await onEvent(parsed);
      }
    }
  }
}

function parseSseFrame(frame: string): ChatJobEvent | null {
  if (!frame.trim()) {
    return null;
  }

  let event = "message";
  const dataLines: string[] = [];

  for (const line of frame.split("\n")) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim() || event;
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  const rawData = dataLines.join("\n");
  if (!rawData) {
    return { event, data: null };
  }

  try {
    return { event, data: JSON.parse(rawData) };
  } catch {
    return { event, data: rawData };
  }
}

export const chatApi = {
  async listConversations(): Promise<ChatConversation[]> {
    const json = await request<{ conversations: ChatConversation[] }>(
      "/api/chat/conversations",
    );
    return json.conversations || [];
  },

  async createConversation(title?: string) {
    return request<{
      conversation: ChatConversation;
      messages: ChatMessage[];
    }>("/api/chat/conversations", {
      method: "POST",
      body: JSON.stringify(title ? { title } : {}),
    });
  },

  async getConversation(conversationId: string) {
    return request<{
      conversation: ChatConversation;
      messages: ChatMessage[];
    }>(`/api/chat/conversations/${conversationId}/messages`);
  },

  async sendMessage(
    conversationId: string,
    payload: {
      message: string;
      attachments?: ChatAttachment[];
      includeHealthData?: boolean;
    },
  ) {
    return request<{
      conversation: ChatConversation;
      userMessage: ChatMessage;
      assistantMessage: ChatMessage;
    }>(`/api/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async submitMessage(
    conversationId: string,
    payload: {
      message: string;
      attachments?: ChatAttachment[];
      includeHealthData?: boolean;
    },
  ) {
    return request<{
      conversation: ChatConversation;
      userMessage: ChatMessage;
      job: ChatJob;
    }>(`/api/chat/conversations/${conversationId}/messages/submit`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getJobStatus(jobId: string) {
    return request<{
      conversation: ChatConversation | null;
      job: {
        job_id: string;
        status: string;
        rq_status?: string | null;
        state?: Record<string, unknown> | null;
      };
    }>(`/api/chat/jobs/${jobId}/status`);
  },

  async streamJobEvents(
    jobId: string,
    onEvent: (event: ChatJobEvent) => void | Promise<void>,
  ) {
    return streamRequest(`/api/chat/jobs/${jobId}/sse`, onEvent);
  },

  async renameConversation(conversationId: string, title: string) {
    return request<{ conversation: ChatConversation }>(
      `/api/chat/conversations/${conversationId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ title }),
      },
    );
  },

  async refreshTitle(conversationId: string) {
    return request<{ conversation: ChatConversation }>(
      `/api/chat/conversations/${conversationId}/refresh-title`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
    );
  },

  async deleteConversation(conversationId: string) {
    return request<{ success: boolean; message: string }>(
      `/api/chat/conversations/${conversationId}`,
      {
        method: "DELETE",
      },
    );
  },
};
