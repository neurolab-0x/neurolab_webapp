export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isUser: boolean;
  avatar?: string;
  status?: 'sending' | 'sent' | 'read';
  attachments?: {
    name: string;
    type: string;
    size: number;
  }[];
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unread?: number;
  isOnline: boolean;
  archived?: boolean;
  pinned?: boolean;
} 