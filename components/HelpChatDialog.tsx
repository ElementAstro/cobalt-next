"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  X,
  Moon,
  Sun,
  Send,
  Paperclip,
  Smile,
  Mic,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "./store/chatStore";
import EmojiPicker from "emoji-picker-react";
import { ShortcutList } from "./components/shortcut-list";

const botResponses = [
  "感谢您的提问。我们的客服人员会尽快回复您。",
  "您好，我可以为您解答一些常见问题。请问您需要什么帮助？",
  "抱歉，我没有完全理解您的问题。能否请您重新描述一下？",
  "好的，我明白了。让我为您查找相关信息。",
  "非常感谢您的反馈。我们会继续改进我们的服务。",
];

export default function MergedChatComponent() {
  const {
    isOpen,
    setIsOpen,
    unreadCount,
    incrementUnreadCount,
    resetUnreadCount,
    theme,
    setTheme,
    messages,
    addMessage,
    isTyping,
    setIsTyping,
    searchMessages,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isOpen) {
        incrementUnreadCount();
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [isOpen, incrementUnreadCount]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, searchResults]);

  const handleOpen = () => {
    setIsOpen(true);
    resetUnreadCount();
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSend = () => {
    if (input.trim()) {
      if (input.startsWith("/")) {
        switch (input.split(" ")[0]) {
          case "/hello":
            addMessage({
              text: "您好！有什么我可以帮您的吗？",
              sender: "bot",
              timestamp: new Date(),
            });
            break;
          case "/help":
            addMessage({
              text: "这里是帮助信息。您可以问我任何问题，我会尽力回答。",
              sender: "bot",
              timestamp: new Date(),
            });
            break;
          case "/clear":
            alert("聊天记录已清除");
            break;
          default:
            addMessage({
              text: "抱歉，我不理解这个指令。",
              sender: "bot",
              timestamp: new Date(),
            });
        }
      } else {
        addMessage({ text: input, sender: "user", timestamp: new Date() });
        setIsTyping(true);

        setTimeout(() => {
          addMessage({
            text: botResponses[Math.floor(Math.random() * botResponses.length)],
            sender: "bot",
            timestamp: new Date(),
          });
          setIsTyping(false);
        }, 1500 + Math.random() * 1500);
      }
      setInput("");
    }
  };

  const handleAttachment = () => {
    alert("文件上传功能即将推出！");
  };

  const handleEmojiClick = (emojiObject: any) => {
    setInput(input + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = "zh-CN";
      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(input + transcript);
      };
      recognition.start();
    } else {
      alert("您的浏览器不支持语音输入功能。");
    }
  };

  const handleSearch = () => {
    const results = searchMessages(searchQuery);
    setSearchResults(results);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-4 right-4"
          >
            <Button onClick={handleOpen} size="icon" className="relative">
              <MessageCircle className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">打开聊天帮助</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={`sm:max-w-[425px] ${theme === "dark" ? "dark" : ""}`}
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>聊天帮助</DialogTitle>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="mr-2"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex flex-col h-[400px]">
            <div className="flex items-center p-2 border-b">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索消息..."
                className="flex-grow mr-2"
              />
              <Button onClick={handleSearch} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
              {(searchQuery ? searchResults : messages).map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.text}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-left"
                >
                  <span className="inline-block p-2 rounded-lg bg-secondary text-secondary-foreground">
                    正在输入...
                  </span>
                </motion.div>
              )}
            </ScrollArea>
            <div className="flex items-center p-4">
              <Button
                onClick={handleAttachment}
                variant="ghost"
                size="icon"
                className="mr-2"
              >
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">添加附件</span>
              </Button>
              <div className="relative flex-grow mr-2">
                <Input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setShowShortcuts(e.target.value.startsWith("/"));
                  }}
                  placeholder="输入您的问题..."
                  className="w-full"
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                {showShortcuts && (
                  <ShortcutList
                    filter={input.slice(1)}
                    onSelect={(command) => {
                      setInput(command + " ");
                      setShowShortcuts(false);
                    }}
                  />
                )}
              </div>
              <div className="relative">
                <Button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                >
                  <Smile className="h-4 w-4" />
                  <span className="sr-only">选择表情</span>
                </Button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
              <Button
                onClick={handleVoiceInput}
                variant="ghost"
                size="icon"
                className="mr-2"
              >
                <Mic
                  className={`h-4 w-4 ${isRecording ? "text-red-500" : ""}`}
                />
                <span className="sr-only">语音输入</span>
              </Button>
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">发送</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
