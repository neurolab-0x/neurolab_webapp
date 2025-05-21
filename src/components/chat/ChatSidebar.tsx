import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ConversationList from './ConversationList';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unread?: number;
  isOnline: boolean;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <Sidebar className="w-70 border-r border-border">
      <SidebarHeader className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar; 