export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  files?: string[];
}

export interface Conversation {
  id: string;
  messages: Message[];
  title: string;
  timestamp: number;
}

export interface Settings {
  openaiKey: string;
  model: string;
  historyLength: number;
  googleDriveEnabled: boolean;
  googleCalendarEnabled: boolean;
  googleMailEnabled: boolean;
}

export type OpenAIModel = {
  id: string;
  name: string;
  description: string;
  context_length: number;
  supports_files: boolean;
};