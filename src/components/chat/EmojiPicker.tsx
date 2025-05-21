import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩',
  '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽',
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredEmojis = emojis.filter(emoji =>
    emoji.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-80 p-2 shadow-lg">
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search emojis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <ScrollArea className="h-64">
        <div className="grid grid-cols-8 gap-1 p-2">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={index}
              className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-md transition-colors"
              onClick={() => onSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default EmojiPicker; 