import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, Settings, Message } from '../types';

interface State {
  conversations: Conversation[];
  currentConversation: string | null;
  settings: Settings;
  addConversation: (conversation: Conversation) => void;
  setCurrentConversation: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addMessage: (conversationId: string, message: Message) => void;
  startNewConversation: () => void;
  clearSettings: () => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      conversations: [],
      currentConversation: null,
      settings: {
        openaiKey: '',
        model: 'gpt-4',
        historyLength: 10,
        googleDriveEnabled: false,
        googleCalendarEnabled: false,
        googleMailEnabled: false,
      },
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations].slice(0, 5),
          currentConversation: conversation.id,
        })),
      setCurrentConversation: (id) =>
        set({ currentConversation: id }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message].slice(-state.settings.historyLength),
                }
              : conv
          ),
        })),
      startNewConversation: () =>
        set((state) => {
          const newConversation = {
            id: Date.now().toString(),
            messages: [],
            title: 'New Conversation',
            timestamp: Date.now(),
          };
          return {
            conversations: [newConversation, ...state.conversations].slice(0, 5),
            currentConversation: newConversation.id,
          };
        }),
      clearSettings: () =>
        set({
          settings: {
            openaiKey: '',
            model: 'gpt-4',
            historyLength: 10,
            googleDriveEnabled: false,
            googleCalendarEnabled: false,
            googleMailEnabled: false,
          },
        }),
    }),
    {
      name: 'chat-storage',
    }
  )
);