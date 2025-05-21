import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatBubble from './ChatBubble';
import { Message } from '../../types/chat';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  typingUser?: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isTyping,
  typingUser,
  messagesEndRef,
}) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            className={`${message.isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
              }`}
          />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
            </div>
            <span>{typingUser} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages; 