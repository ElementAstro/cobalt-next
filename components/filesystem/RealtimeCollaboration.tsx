import React, { ChangeEvent, useEffect } from "react";
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
import { useCollaborationStore } from "@/lib/store/filesystem";

interface RealtimeCollaborationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealtimeCollaboration: React.FC<RealtimeCollaborationProps> = ({
  isOpen,
  onClose,
}) => {
  const { collaborators, chat, addCollaborator, addMessage, reset } =
    useCollaborationStore();
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    if (isOpen) {
      // Simulating WebSocket connection
      const mockCollaborators = ["Alice", "Bob", "Charlie"];
      mockCollaborators.forEach((name) => addCollaborator(name));
    } else {
      reset();
    }
  }, [isOpen, addCollaborator, reset]);

  const sendMessage = () => {
    if (message.trim()) {
      addMessage({ user: "You", message });
      setMessage("");
      // Simulating received message
      setTimeout(() => {
        addMessage({ user: "Alice", message: "Got your message!" });
      }, 1000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full mx-4 sm:mx-0"
          >
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center">
                <motion.h2
                  variants={itemVariants}
                  className="text-2xl font-bold"
                >
                  Realtime Collaboration
                </motion.h2>
                <motion.div variants={itemVariants}>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-6 h-6" />
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div variants={itemVariants} className="mb-4">
                  <h3 className="font-medium mb-2">Active Collaborators</h3>
                  <div className="flex flex-wrap items-center space-x-2">
                    {collaborators.map((user, index) => (
                      <Badge
                        key={index}
                        className="flex items-center bg-blue-600 text-white px-2 py-1 rounded-full text-sm mb-2"
                      >
                        <Avatar className="mr-2" />
                        {user}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="mb-4 h-40 overflow-y-auto border border-gray-600 rounded p-2"
                >
                  {chat.map((msg, index) => (
                    <div key={index} className="mb-2">
                      <span className="font-bold">{msg.user}: </span>
                      <span>{msg.message}</span>
                    </div>
                  ))}
                </motion.div>
              </CardContent>
              <CardFooter>
                <motion.div variants={itemVariants} className="flex">
                  <Input
                    type="text"
                    value={message}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setMessage(e.target.value)
                    }
                    placeholder="Type your message..."
                    className="flex-grow p-2 rounded-l bg-gray-700 text-white"
                  />
                  <Button
                    onClick={sendMessage}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-r transition duration-200"
                  >
                    Send
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
