import React, { useState, useEffect, ChangeEvent } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
interface RealtimeCollaborationProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const RealtimeCollaboration: React.FC<RealtimeCollaborationProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ user: string; message: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Simulating WebSocket connection
      const mockCollaborators = ["Alice", "Bob", "Charlie"];
      setCollaborators(mockCollaborators);
    }
  }, [isOpen]);

  const sendMessage = () => {
    if (message.trim()) {
      setChat([...chat, { user: "You", message }]);
      setMessage("");
      // Simulating received message
      setTimeout(() => {
        setChat((prev) => [
          ...prev,
          { user: "Alice", message: "Got your message!" },
        ]);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } p-6 rounded-lg max-w-md w-full`}
          >
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Realtime Collaboration</h2>
                <Button variant="ghost" onClick={onClose}>
                  <X className="w-6 h-6" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Active Collaborators</h3>
                  <div className="flex items-center space-x-2">
                    {collaborators.map((user, index) => (
                      <Badge
                        key={index}
                        className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
                      >
                        <Avatar className="mr-2" />
                        {user}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mb-4 h-40 overflow-y-auto border border-gray-600 rounded p-2">
                  {chat.map((msg, index) => (
                    <div key={index} className="mb-2">
                      <span className="font-bold">{msg.user}: </span>
                      <span>{msg.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex">
                <Input
                  type="text"
                  value={message}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setMessage(e.target.value)
                  }
                  placeholder="Type your message..."
                  className={`flex-grow p-2 rounded-l ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
                <Button
                  onClick={sendMessage}
                  className={`p-2 ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } rounded-r transition duration-200`}
                >
                  Send
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
