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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-900/95 backdrop-blur border border-gray-800 text-white p-6 rounded-lg w-full max-w-xl mx-auto mt-16 sm:mt-0"
          >
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center space-x-3"
                  >
                    <h2 className="text-2xl font-bold">实时协作</h2>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-400"
                    >
                      在线 {collaborators.length}
                    </Badge>
                  </motion.div>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="hover:bg-gray-800 rounded-full p-2"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap gap-2"
                >
                  {collaborators.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-gray-800/50 rounded-full pl-1 pr-3 py-1"
                    >
                      <Avatar className="w-6 h-6">
                        <div className="bg-blue-500 w-full h-full rounded-full flex items-center justify-center text-xs">
                          {user[0].toUpperCase()}
                        </div>
                      </Avatar>
                      <span className="text-sm">{user}</span>
                    </div>
                  ))}
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="h-[300px] overflow-y-auto rounded-lg bg-gray-800/30 p-4 space-y-4"
                >
                  {chat.map((msg, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className={`flex items-start space-x-3 ${
                        msg.user === "You"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <div
                          className={`w-full h-full rounded-full flex items-center justify-center text-xs ${
                            msg.user === "You" ? "bg-blue-500" : "bg-green-500"
                          }`}
                        >
                          {msg.user[0].toUpperCase()}
                        </div>
                      </Avatar>
                      <div
                        className={`max-w-[70%] ${
                          msg.user === "You" ? "text-right" : ""
                        }`}
                      >
                        <div className="text-sm text-gray-400 mb-1">
                          {msg.user}
                        </div>
                        <div
                          className={`rounded-lg p-3 inline-block ${
                            msg.user === "You"
                              ? "bg-blue-500/20 text-blue-100"
                              : "bg-gray-700/50 text-gray-100"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>

              <CardFooter className="pt-4">
                <motion.div
                  variants={itemVariants}
                  className="flex w-full space-x-2"
                >
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="输入消息..."
                    className="flex-grow bg-gray-800/50 border-gray-700 focus:border-blue-500"
                  />
                  <Button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    发送
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
