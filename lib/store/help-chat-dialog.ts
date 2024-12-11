import { create } from "zustand";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  unreadCount: number;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  searchMessages: (query: string) => Message[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  unreadCount: 0,
  incrementUnreadCount: () => set({ unreadCount: get().unreadCount + 1 }),
  resetUnreadCount: () => set({ unreadCount: 0 }),
  theme: "light",
  setTheme: (theme) => set({ theme }),
  messages: [],
  addMessage: (message) =>
    set({ messages: [...get().messages, message] }),
  isTyping: false,
  setIsTyping: (typing) => set({ isTyping: typing }),
  searchMessages: (query) =>
    get().messages.filter((msg) =>
      msg.text.toLowerCase().includes(query.toLowerCase())
    ),
}));