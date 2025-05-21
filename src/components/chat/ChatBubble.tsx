import React from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isUser: boolean;
  avatar?: string;
  status?: 'sending' | 'sent' | 'read';
}

interface ChatBubbleProps {
  message: Message;
  className?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, className }) => {
  return (
    <div className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
      {!message.isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.avatar} />
          <AvatarFallback>{message.sender[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col gap-1 max-w-[70%] ${message.isUser ? 'items-end' : ''}`}>
        <div className={`rounded-lg px-4 py-2 ${className}`}>
          <p>{message.content}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
          {message.isUser && message.status && (
            <span className="text-xs">
              {message.status === 'sending' && 'Sending...'}
              {message.status === 'sent' && '✓'}
              {message.status === 'read' && '✓✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble; 