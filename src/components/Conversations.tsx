import React, { useState, useEffect } from 'react';

const Conversations: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch conversations from backend or use WebSocket
    // For now, initialize empty
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-2 text-sm text-muted-foreground">Loading conversations...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No conversations yet</p>
        <p className="text-xs mt-2">Start a new conversation with NeuralAssistant</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Conversations</h2>
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id} className="p-2 border-b border-border hover:bg-accent cursor-pointer">
            <div className="font-medium">{conversation.name}</div>
            <div className="text-sm text-gray-500">{conversation.lastMessage}</div>
            <div className="text-xs text-gray-400">{conversation.timestamp}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conversations; 