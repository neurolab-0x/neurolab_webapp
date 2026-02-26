import React, { useState, useRef, useEffect } from 'react';
import { PortalErrorBoundary } from '../components/PortalErrorBoundary';
import { Send, BrainCircuit } from 'lucide-react';

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

function ChatInner() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: 'Hello! I\'m NeurAI, your neural health assistant. How can I help you today?', timestamp: new Date().toLocaleTimeString() },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg: Message = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/ai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('neurai_token')}` },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', content: data.response || data.message || 'I\'m processing your request. Please try again.', timestamp: new Date().toLocaleTimeString() }]);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', content: 'Connection interrupted. The AI service is currently unavailable.', timestamp: new Date().toLocaleTimeString() }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-3xl flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">NeurAI Chat</h1>
                <p className="mt-1 text-sm text-muted-foreground">AI-powered neural health assistant</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border bg-card p-6">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            {msg.role === 'ai' ? <BrainCircuit size={14} /> : <span className="text-xs font-bold">U</span>}
                        </div>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === 'ai' ? 'bg-secondary text-foreground' : 'bg-primary text-primary-foreground'}`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className={`mt-1 text-[10px] ${msg.role === 'ai' ? 'text-muted-foreground' : 'text-primary-foreground/60'}`}>{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><BrainCircuit size={14} /></div>
                        <div className="rounded-2xl bg-secondary px-4 py-3">
                            <div className="flex gap-1">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            <div className="mt-4 flex gap-3">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask NeurAI about your neural health..."
                    className="flex-1 rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button onClick={sendMessage} disabled={loading} className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}

export default function UserChat() {
    return (
        <PortalErrorBoundary serviceName="NeurAI Chat Engine">
            <ChatInner />
        </PortalErrorBoundary>
    );
}
