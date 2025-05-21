import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  name: string;
  avatar: string;
  isOnline: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, avatar, isOnline, className, children }) => {
  return (
    <div className={`flex items-center justify-between px-6 py-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProfileHeader; 