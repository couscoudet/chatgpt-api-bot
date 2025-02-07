import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import { ChatInput } from "../components/ChatInput";
import { Message } from "../components/Message";
import { ConversationList } from "../components/ConversationList";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import { PlusCircle } from "lucide-react";

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    conversations,
    currentConversation,
    settings,
    addConversation,
    setCurrentConversation,
    addMessage,
    startNewConversation,
  } = useStore();

  useEffect(() => {
    if (!settings.openaiKey) {
      navigate("/settings");
    }
  }, [settings.openaiKey, navigate]);

  const handleSend = async (
    content: string,
    files: File[],
    imageUrl?: string
  ) => {
    setLoading(true);
    const openai = new OpenAI({
      apiKey: settings.openaiKey,
      dangerouslyAllowBrowser: true,
    });

    try {
      // Prepare the message content array
      const contentArray: any[] = [{ type: "text", text: content }];

      // Handle uploaded files (base64)
      for (const file of files) {
        if (file.type.startsWith("image/")) {
          const base64Image = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              const base64 = result.split(",")[1];
              resolve(base64);
            };
            reader.readAsDataURL(file);
          });

          contentArray.push({
            type: "image_url",
            image_url: {
              url: `data:${file.type};base64,${base64Image}`,
              detail: "auto",
            },
          });
        }
      }

      // Handle image URL if provided
      if (imageUrl) {
        contentArray.push({
          type: "image_url",
          image_url: {
            url: imageUrl,
            detail: "auto",
          },
        });
      }

      // Get current conversation messages for context
      const currentConversationData = currentConversation
        ? conversations.find((c) => c.id === currentConversation)
        : null;

      // Prepare conversation history
      const conversationHistory = currentConversationData
        ? currentConversationData.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          }))
        : [];

      // Create user message
      const userMessage = {
        role: "user" as const,
        content,
        files: files.map((f) => f.name),
        imageUrl,
      };

      // Add message to conversation or create new one
      let conversationId = currentConversation;
      if (!conversationId) {
        const newConversation = {
          id: Date.now().toString(),
          messages: [userMessage],
          title: content.slice(0, 30) + "...",
          timestamp: Date.now(),
        };
        addConversation(newConversation);
        conversationId = newConversation.id;
      } else {
        addMessage(conversationId, userMessage);
      }

      // Make API call with conversation history
      const response = await openai.chat.completions.create({
        model: settings.model,
        messages: [
          ...conversationHistory,
          {
            role: "user",
            content: contentArray,
          },
        ],
        max_tokens: settings.model.includes("32k") ? 32000 : 4000,
      });

      const assistantMessage = {
        role: "assistant" as const,
        content: response.choices[0].message.content || "",
      };

      if (conversationId) {
        addMessage(conversationId, assistantMessage);
      }
    } catch (error: any) {
      const errorMessage = {
        role: "system" as const,
        content: `Error: ${
          error.message || "Failed to get response from OpenAI"
        }`,
      };
      if (currentConversation) {
        addMessage(currentConversation, errorMessage);
      }
      console.error("Error calling OpenAI:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentMessages = currentConversation
    ? conversations.find((c) => c.id === currentConversation)?.messages || []
    : [];

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r h-full flex flex-col">
        <div className="p-4 border-b">
          <button
            onClick={startNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            New Chat
          </button>
        </div>
        <ConversationList
          conversations={conversations}
          currentId={currentConversation}
          onSelect={setCurrentConversation}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {currentMessages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>
        <ChatInput
          onSend={handleSend}
          disabled={!settings.openaiKey || loading}
        />
      </div>
    </div>
  );
};
