import React, { useState, useRef, useEffect } from 'react';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Send, BrainCircuit, Volume2, Square, Mic, Paperclip, Video, Play, Pause, Loader2, Sparkles, X, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    attachments?: { type: 'file' | 'voice', name: string }[];
}

const SUGGESTIONS = [
    "Analyze my latest EEG scan",
    "Explain my baseline results",
    "How is my sleep architecture?",
    "Summarize my neural health trends"
];

function ChatInner() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: 'Hello! I am NeurAI. Let\'s explore your neural telemetry and cognitive health together.', timestamp: new Date().toLocaleTimeString() },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [speakingId, setSpeakingId] = useState<number | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [attachments, setAttachments] = useState<{ type: 'file' | 'voice', name: string }[]>([]);

    // Pre-chat context selection
    const [showContextPrompt, setShowContextPrompt] = useState(true);
    const [includeHealthData, setIncludeHealthData] = useState(true);

    // Suggestion logic
    const [showSuggestions, setShowSuggestions] = useState(false);
    const filteredSuggestions = input ? SUGGESTIONS.filter(s => s.toLowerCase().includes(input.toLowerCase()) && s !== input) : SUGGESTIONS;

    // Model Selection UI State
    const MODELS = [
        { id: 'neurai-pro', name: 'NeurAi Pro', badge: 'Default' },
        { id: 'neurai-mini', name: 'NeurAi Core', badge: 'Fast' },
        { id: 'gpt-4o', name: 'GPT-4o', badge: 'Integrated' }
    ];
    const [selectedModel, setSelectedModel] = useState(MODELS[0]);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const speakMessage = (text: string, index: number) => {
        if (speakingId === index) {
            window.speechSynthesis.cancel();
            setSpeakingId(null);
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Premium'));
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setSpeakingId(null);
        utterance.onerror = () => setSpeakingId(null);
        setSpeakingId(index);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    const handleSendMessage = async (text: string = input) => {
        if ((!text.trim() && attachments.length === 0) || loading) return;

        const userMsg: Message = {
            role: 'user',
            content: text,
            timestamp: new Date().toLocaleTimeString(),
            attachments: [...attachments]
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setAttachments([]);
        setShowSuggestions(false);
        setLoading(true);

        // Simulated AI processing with premium delay
        setTimeout(async () => {
            try {
                // Mock robust response matching the premium theme
                let responseText = "I've analyzed your request against your recent neural telemetry data. Your cognitive baselines remain stable, though I notice a slight variance in your delta wave density during deep sleep phases over the past 48 hours.";
                if (text.toLowerCase().includes('eeg')) {
                    responseText = "Looking at your latest EEG scan from yesterday, your alpha wave symmetry across the frontal lobe is excellent, indicating high resting focus and low cognitive fatigue.";
                }

                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: responseText,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            } finally {
                setLoading(false);
            }
        }, 1800);
    };

    const handleMicToggle = () => {
        if (isRecording) {
            setIsRecording(false);
            setAttachments(prev => [...prev, { type: 'voice', name: `Voice Note - ${new Date().toLocaleTimeString()}` }]);
        } else {
            setIsRecording(true);
        }
    };

    const handleFileUpload = () => {
        // Mock file upload trigger
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.edf,.pdf';
        input.onchange = (e: any) => {
            if (e.target.files && e.target.files.length > 0) {
                setAttachments(prev => [...prev, { type: 'file', name: e.target.files[0].name }]);
            }
        };
        input.click();
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col bg-background">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4 px-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Sparkles size={20} className="text-primary" />
                        NeurAi Intelligence
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Advanced predictive neural health modeling</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/50 bg-surface px-3 py-1 shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Model Active</span>
                </div>
            </div>

            {/* Context Prompt Banner */}
            <AnimatePresence>
                {showContextPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="mb-4 overflow-hidden"
                    >
                        <div className="mx-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm backdrop-blur-md">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-full bg-primary/20 p-1.5 text-primary">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">Prepare Session Context</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Allow NeurAi to analyze your historical medical records and baselines?</p>
                                </div>
                            </div>
                            <div className="flex shrink-0 gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                <button
                                    onClick={() => {
                                        setIncludeHealthData(false);
                                        setShowContextPrompt(false);
                                    }}
                                    className="flex-1 sm:flex-none rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={() => {
                                        setIncludeHealthData(true);
                                        setShowContextPrompt(false);
                                    }}
                                    className="flex-1 sm:flex-none rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
                                >
                                    Include Data
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat History - Generative UI Style */}
            <div className="flex-1 overflow-y-auto px-2 pb-24 space-y-8">
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Avatar */}
                        <div className="flex shrink-0 items-start">
                            {msg.role === 'ai' ? (
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-sm">
                                    <BrainCircuit size={20} />
                                </div>
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/80 border border-border/50 shadow-sm">
                                    <span className="text-sm font-semibold">ME</span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className={`mt-1 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                            <div className={`prose prose-sm dark:prose-invert max-w-none ${msg.role === 'user' ? 'text-right' : 'text-left'} leading-relaxed text-foreground/90`}>
                                {msg.content && <p className="mb-2">{msg.content}</p>}
                            </div>

                            {/* Attachments rendering */}
                            {msg.attachments && msg.attachments.length > 0 && (
                                <div className={`flex flex-wrap gap-2 mt-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.attachments.map((att, idx) => (
                                        <div key={idx} className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs">
                                            {att.type === 'voice' ? <Volume2 size={12} className="text-primary" /> : <Paperclip size={12} className="text-muted-foreground" />}
                                            <span className="font-medium text-muted-foreground truncate max-w-[150px]">{att.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-2 flex items-center gap-3">
                                <span className="text-[10px] text-muted-foreground/60">{msg.timestamp}</span>
                                {msg.role === 'ai' && (
                                    <button
                                        onClick={() => speakMessage(msg.content, i)}
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                        title={speakingId === i ? "Stop playback" : "Read aloud"}
                                    >
                                        {speakingId === i ? <Square size={12} className="fill-current text-primary" /> : <Volume2 size={12} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="flex shrink-0 items-start">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                                <BrainCircuit size={20} className="animate-pulse" />
                            </div>
                        </div>
                        <div className="mt-3 flex gap-1.5">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: '0ms' }} />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: '150ms' }} />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
                <div ref={endRef} className="h-4" />
            </div>
            {/* Premium Command Center Input */}
            <div className="relative mt-auto pt-4">
                {/* Dynamic Suggestions Bar */}
                <AnimatePresence>
                    {showSuggestions && filteredSuggestions.length > 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className="absolute bottom-full mb-3 left-0 w-full flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2"
                        >
                            {filteredSuggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="shrink-0 rounded-full border border-border/50 bg-surface/80 px-4 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-secondary"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Input Card */}
                <div className="relative rounded-2xl border border-border bg-card/50 shadow-sm backdrop-blur-xl transition-all focus-within:border-primary/40 focus-within:bg-card/80">

                    {/* Attachments Preview */}
                    {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-4 pt-4 pb-2">
                            {attachments.map((att, i) => (
                                <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary/80 px-3 py-1.5 text-xs border border-border/50">
                                    {att.type === 'voice' ? <Mic size={12} className="text-primary animate-pulse" /> : <Paperclip size={12} className="text-muted-foreground" />}
                                    <span className="max-w-[120px] truncate">{att.name}</span>
                                    <button onClick={() => removeAttachment(i)} className="ml-1 text-muted-foreground hover:text-foreground">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col p-3 pt-0">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setShowSuggestions(e.target.value.length > 0);
                                // Auto-resize logic
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                            }}
                            onFocus={() => setShowSuggestions(input.length > 0 || messages.length <= 1)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                    if (inputRef.current) {
                                        inputRef.current.style.height = 'auto';
                                    }
                                }
                            }}
                            placeholder="Message NeurAi... (or ask for analysis)"
                            className={`max-h-[150px] min-h-[44px] w-full resize-none bg-transparent px-3 py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 border-b border-border/10 mb-1 ${(inputRef.current?.scrollHeight || 0) < 150 ? 'scrollbar-hide' : ''}`}
                            rows={1}
                        />

                        <div className="flex shrink-0 items-center justify-between gap-1 pb-1 px-1 w-full">
                            <div className="flex items-center gap-1">
                                {/* Model Selector Dropdown - Moved to bottom row */}
                                <div className="relative mr-2">
                                    <button
                                        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                                        className="flex items-center gap-2 rounded-lg bg-secondary/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground border border-transparent hover:border-border/50"
                                    >
                                        <BrainCircuit size={14} className="text-primary" />
                                        {selectedModel.name}
                                        <ChevronDown size={14} className="text-muted-foreground/60" />
                                    </button>

                                    <AnimatePresence>
                                        {isModelDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsModelDropdownOpen(false)}></div>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    className="absolute bottom-full left-0 mb-2 z-20 w-48 rounded-xl border border-border bg-popover p-1 shadow-lg backdrop-blur-xl"
                                                >
                                                    {MODELS.map(model => (
                                                        <button
                                                            key={model.id}
                                                            onClick={() => {
                                                                setSelectedModel(model);
                                                                setIsModelDropdownOpen(false);
                                                            }}
                                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary text-left"
                                                        >
                                                            <span className={selectedModel.id === model.id ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                                                                {model.name}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] uppercase text-muted-foreground/60">{model.badge}</span>
                                                                {selectedModel.id === model.id && <Check size={14} className="text-primary" />}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleFileUpload}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                                    title="Attach File"
                                >
                                    <Paperclip size={18} />
                                </button>

                                <button
                                    disabled
                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground/40 cursor-not-allowed transition-colors"
                                    title="Video Call (Coming Soon)"
                                >
                                    <Video size={18} />
                                </button>

                                {isRecording ? (
                                    <button
                                        onClick={handleMicToggle}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors animate-pulse"
                                    >
                                        <Square size={16} className="fill-current" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleMicToggle}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                                        title="Voice Dictation"
                                    >
                                        <Mic size={18} />
                                    </button>
                                )}

                                <AnimatePresence>
                                    {(input.trim().length > 0 || attachments.length > 0 || loading) && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, width: 'auto', scale: 1 }}
                                            exit={{ opacity: 0, width: 0, scale: 0.8 }}
                                            className="flex items-center overflow-hidden"
                                        >
                                            <button
                                                onClick={() => handleSendMessage()}
                                                disabled={loading || isRecording}
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all bg-primary text-primary-foreground shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                            >
                                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UserChat() {
    return (
        <PortalErrorBoundary serviceName="NeurAI Interactive Session">
            <ChatInner />
        </PortalErrorBoundary>
    );
}
