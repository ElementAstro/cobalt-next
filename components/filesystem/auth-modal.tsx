import React, { useState } from "react";
import { X, User, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
  onLogin: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  theme,
  onLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    onLogin({ name: "John Doe", email });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <DialogContent
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } p-6 rounded-lg max-w-md w-full mx-4`}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">Login</span>
                  <DialogClose asChild>
                    <button className="p-1 rounded-full hover:bg-gray-700 transition duration-200">
                      <X className="w-6 h-6" />
                    </button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <Label className="block mb-2 font-medium" htmlFor="email">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full p-2 pl-10 rounded ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                      placeholder="Enter your email"
                      required
                    />
                    <User className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>
                <div className="mb-4">
                  <Label className="block mb-2 font-medium" htmlFor="password">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full p-2 pl-10 rounded ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                      placeholder="Enter your password"
                      required
                    />
                    <Lock className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white rounded-lg transition duration-200 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
