import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { Conversation } from '../types';

interface Props {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
}

export const ConversationList: React.FC<Props> = ({
  conversations,
  currentId,
  onSelect,
}) => {
  return (
    <div className="w-64 border-r h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Recent Conversations</h2>
      </div>
      <div className="space-y-2 p-2">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full p-3 text-left rounded-lg hover:bg-gray-100 flex items-center gap-2 ${
              currentId === conv.id ? 'bg-gray-100' : ''
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <div className="overflow-hidden">
              <div className="truncate">{conv.title}</div>
              <div className="text-sm text-gray-500">
                {new Date(conv.timestamp).toLocaleDateString()}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};