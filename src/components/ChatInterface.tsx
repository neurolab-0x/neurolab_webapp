import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Brain, User } from "lucide-react";
import useWebSocket from "@/hooks/useWebSocket";
import { Message } from "@/types";

export const ChatInterface = () => {
  const { messages, sendMessage, connected } = useWebSocket();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add sample data on component mount
  useEffect(() => {
    const sampleMessages: Message[] = [
      { id: '1', content: 'Hello! How can I help you today?', sender: 'Neural Assistant', timestamp: new Date().toISOString(), isUser: false },
      { id: '2', content: 'I need help with my project.', sender: 'User', timestamp: new Date().toISOString(), isUser: true },
      { id: '3', content: 'Sure, I can assist you with that. What kind of project are you working on?', sender: 'Neural Assistant', timestamp: new Date().toISOString(), isUser: false },
    ];
    // Assuming useWebSocket provides a way to set messages, you might need to adjust this based on your implementation
    // For demonstration, we'll just log the sample messages
    console.log('Sample messages:', sampleMessages);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;

    sendMessage(messageInput);
    setMessageInput("");
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="neural-card overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-neural-blue mr-2" />
          <h3 className="font-semibold">Neural Assistant</h3>
        </div>
        <Badge
          variant="outline"
          className={`${connected ? 'text-neural-green' : 'text-destructive'}`}
        >
          {connected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${message.isUser
                ? 'bg-primary text-primary-foreground ml-12'
                : 'bg-muted mr-12'
                }`}
            >
              <div className="flex items-center mb-1">
                <div className="flex items-center">
                  {!message.isUser && <Brain className="h-4 w-4 mr-2" />}
                  {message.isUser && <User className="h-4 w-4 mr-2" />}
                  <span className="font-medium text-sm">{message.sender}</span>
                </div>
                <span className="ml-2 text-xs opacity-70">
                  {formatMessageTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex">
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 mr-2"
          />
          <Button type="submit" disabled={!connected}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
