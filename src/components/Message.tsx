import React from 'react';
import { FileText, User, Bot } from 'lucide-react';
import type { Message as MessageType } from '../types';

interface Props {
  message: MessageType;
}

export const Message: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-4 p-4 ${
        isUser ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="flex-shrink-0">
        {isUser ? (
          <User className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6" />
        )}
      </div>
      <div className="flex-1">
        <div className="prose max-w-none">
          {message.content}
        </div>
        {message.files && message.files.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <FileText className="w-4 h-4" />
                <span>{file}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};