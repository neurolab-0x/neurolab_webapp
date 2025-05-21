import React from 'react';

const Conversations: React.FC = () => {
  const sampleConversations = [
    { id: '1', name: 'Project Discussion', lastMessage: 'How is the project going?', timestamp: '10:30 AM' },
    { id: '2', name: 'Meeting Notes', lastMessage: 'Here are the notes from the meeting.', timestamp: '11:45 AM' },
    { id: '3', name: 'Support Chat', lastMessage: 'I need help with my account.', timestamp: '1:15 PM' },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Conversations</h2>
      <ul>
        {sampleConversations.map((conversation) => (
          <li key={conversation.id} className="p-2 border-b border-border">
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