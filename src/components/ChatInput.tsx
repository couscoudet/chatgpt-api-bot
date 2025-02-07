import React, { useState, useRef } from 'react';
import { Send, Paperclip, Link } from 'lucide-react';

interface Props {
  onSend: (message: string, files: File[], imageUrl?: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || files.length > 0 || imageUrl) {
      onSend(message, files, imageUrl);
      setMessage('');
      setFiles([]);
      setImageUrl('');
      setShowUrlInput(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      setFiles(imageFiles);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border-t">
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Upload image"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Add image URL"
        >
          <Link className="w-5 h-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          multiple
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || (!message.trim() && !files.length && !imageUrl)}
          className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      {files.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {files.map((file, index) => (
            <div key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {file.name}
            </div>
          ))}
        </div>
      )}
    </form>
  );
};