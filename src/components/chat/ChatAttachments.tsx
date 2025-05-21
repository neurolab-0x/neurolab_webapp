import React from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, File, X } from 'lucide-react';

interface ChatAttachmentsProps {
  attachments: File[];
  onRemove: (index: number) => void;
}

const ChatAttachments: React.FC<ChatAttachmentsProps> = ({ attachments, onRemove }) => {
  if (attachments.length === 0) return null;

  return (
    <div className="px-4 py-2 border-t border-border">
      <div className="flex flex-wrap gap-2">
        {attachments.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-muted p-2 rounded-md"
          >
            {file.type.startsWith('image/') ? (
              <ImageIcon className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}
            <span className="text-sm truncate max-w-[200px]">
              {file.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              onClick={() => onRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatAttachments; 