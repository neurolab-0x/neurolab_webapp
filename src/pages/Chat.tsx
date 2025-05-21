import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Phone, Video, MoreVertical, Smile } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EmojiPicker from '@/components/chat/EmojiPicker';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatAttachments from '@/components/chat/ChatAttachments';
import ProfileHeader from '@/components/chat/ProfileHeader';
import ChatInput from '@/components/chat/ChatInput';
import { Message, Conversation } from '@/types/chat';

// Sample data
const sampleConversations: Conversation[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    timestamp: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    unread: 2,
    isOnline: true,
    archived: false,
    pinned: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'The project is looking great!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    isOnline: false,
    archived: false,
    pinned: false,
  },
  {
    id: '3',
    name: 'Team Chat',
    lastMessage: 'Meeting at 3 PM',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Team',
    unread: 5,
    isOnline: true,
    archived: true,
    pinned: false,
  },
];

const sampleMessages: Message[] = [
  {
    id: '1',
    content: 'Hey, how are you?',
    sender: 'John Doe',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isUser: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    status: 'read',
  },
  {
    id: '2',
    content: "I'm good, thanks! How about you?",
    sender: 'You',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    isUser: true,
    status: 'read',
  },
  {
    id: '3',
    content: 'Doing great! Just finished the new feature.',
    sender: 'John Doe',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    isUser: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    status: 'read',
  },
];

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = sampleConversations.find(conv => conv.id === selectedConversation);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (!message.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'You',
      timestamp: new Date().toISOString(),
      isUser: true,
      status: 'sending',
      attachments: attachments.length > 0 ? attachments.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })) : undefined,
    };

    setMessages(prev => [...prev, newMessage]);
    setAttachments([]);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 1000);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thanks for your message! I\'ll get back to you soon.',
        sender: selectedConv?.name || 'User',
        timestamp: new Date().toISOString(),
        isUser: false,
        avatar: selectedConv?.avatar,
        status: 'read',
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji: string) => {
    setShowEmojiPicker(false);
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.isUser) {
      setMessages(prev =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { ...msg, content: msg.content + emoji }
            : msg
        )
      );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <ChatSidebar
          conversations={sampleConversations}
          selectedId={selectedConversation}
          onSelect={setSelectedConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex-1 flex flex-col">
          {selectedConv && (
            <>
              <ProfileHeader
                name={selectedConv.name}
                avatar={selectedConv.avatar}
                isOnline={selectedConv.isOnline}
                className="border-b border-border"
              >
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Block User</DropdownMenuItem>
                      <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </ProfileHeader>

              <ChatMessages
                messages={messages}
                isTyping={isTyping}
                typingUser={selectedConv.name}
                messagesEndRef={messagesEndRef}
              />

              <ChatAttachments
                attachments={attachments}
                onRemove={handleRemoveAttachment}
              />

              <ChatInput
                onSendMessage={handleSendMessage}
                onAttachFile={() => fileInputRef.current?.click()}
                isTyping={isTyping}
                className="border-t border-border"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-5 w-5" />
                </Button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2">
                    <EmojiPicker onSelect={handleEmojiSelect} />
                  </div>
                )}
              </ChatInput>
            </>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat; 