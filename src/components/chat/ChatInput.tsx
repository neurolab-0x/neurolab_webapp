import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onAttachFile: () => void;
  isTyping: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onAttachFile,
  isTyping,
  className,
  children,
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 px-4 py-2 ${className}`}>
      <Button type="button" variant="ghost" size="icon" onClick={onAttachFile}>
        <Paperclip className="h-5 w-5" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={isTyping}
        className="flex-1"
      />
      {children}
      <Button type="submit" size="icon" disabled={!message.trim() || isTyping}>
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput; 