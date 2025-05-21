import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { MoreVertical, Star, Archive, Trash, Pin } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuAction,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
}) => {
  const pinnedConversations = conversations.filter(conv => conv.pinned && !conv.archived);
  const recentConversations = conversations.filter(conv => !conv.pinned && !conv.archived);
  const archivedConversations = conversations.filter(conv => conv.archived);

  const renderConversationItem = (conversation: Conversation) => (
    <SidebarMenuItem key={conversation.id}>
      <SidebarMenuButton
        isActive={selectedId === conversation.id}
        onClick={() => onSelect(conversation.id)}
        className={cn(
          "flex items-center gap-3 transition-all duration-200",
          "hover:bg-accent/50 active:bg-accent",
          selectedId === conversation.id && "bg-accent text-accent-foreground"
        )}
      >
        <div className="relative">
          <Avatar className={cn(
            "h-10 w-10 transition-transform duration-200",
            "group-hover:scale-105",
            selectedId === conversation.id && "ring-2 ring-primary"
          )}>
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {conversation.name[0]}
            </AvatarFallback>
          </Avatar>
          {conversation.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{conversation.name}</span>
              {conversation.pinned && (
                <Pin className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {format(new Date(conversation.timestamp), 'HH:mm')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage}
          </p>
        </div>
        {conversation.unread && (
          <SidebarMenuBadge className="bg-primary text-primary-foreground">
            {conversation.unread}
          </SidebarMenuBadge>
        )}
      </SidebarMenuButton>
      <SidebarMenuAction showOnHover className="opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreVertical className="h-4 w-4" />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );

  return (
    <div className="space-y-6 p-2">
      {pinnedConversations.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
            Pinned
          </SidebarGroupLabel>
          <SidebarMenu>
            {pinnedConversations.map(renderConversationItem)}
          </SidebarMenu>
        </SidebarGroup>
      )}

      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
          Recent Conversations
        </SidebarGroupLabel>
        <SidebarMenu>
          {recentConversations.map(renderConversationItem)}
        </SidebarMenu>
      </SidebarGroup>

      {archivedConversations.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
            Archived
          </SidebarGroupLabel>
          <SidebarMenu>
            {archivedConversations.map(renderConversationItem)}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </div>
  );
};

export default ConversationList; 