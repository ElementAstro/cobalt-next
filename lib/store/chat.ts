import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type Theme = "light" | "dark";

type ChatStore = {
  messages: Message[];
  isOpen: boolean;
  unreadCount: number;
  isTyping: boolean;
  theme: Theme;
  shortcuts: { id: string; command: string; description: string }[];
  addMessage: (message: Omit<Message, "id">) => void;
  setIsOpen: (isOpen: boolean) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  setIsTyping: (isTyping: boolean) => void;
  setTheme: (theme: Theme) => void;
  searchMessages: (query: string) => Message[];
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: 1,
          text: "您好！我是您的聊天助手。有什么我可以帮您的吗？",
          sender: "bot",
          timestamp: new Date(),
        },
      ],
      isOpen: false,
      unreadCount: 0,
      isTyping: false,
      theme: "light",
      shortcuts: [
        { id: "1", command: "/hello", description: "发送问候" },
        { id: "2", command: "/help", description: "获取帮助" },
        { id: "3", command: "/clear", description: "清除聊天记录" },
      ],
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...message, id: state.messages.length + 1 },
          ],
        })),
      setIsOpen: (isOpen) => set({ isOpen }),
      incrementUnreadCount: () =>
        set((state) => ({ unreadCount: state.unreadCount + 1 })),
      resetUnreadCount: () => set({ unreadCount: 0 }),
      setIsTyping: (isTyping) => set({ isTyping }),
      setTheme: (theme) => set({ theme }),
      searchMessages: (query) => {
        const { messages } = get();
        return messages.filter((message) =>
          message.text.toLowerCase().includes(query.toLowerCase())
        );
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ messages: state.messages, theme: state.theme }),
    }
  )
);
