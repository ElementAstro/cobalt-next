import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface AuthManagerProps {
  auth: {
    type: string;
    token?: string;
    username?: string;
    password?: string;
  };
  onChange: (newAuth: {
    type: string;
    token?: string;
    username?: string;
    password?: string;
  }) => void;
}

export default function AuthManager({ auth, onChange }: AuthManagerProps) {
  const [type, setType] = useState(auth.type || "none");
  const [token, setToken] = useState(auth.token || "");
  const [username, setUsername] = useState(auth.username || "");
  const [password, setPassword] = useState(auth.password || "");

  const handleSave = () => {
    onChange({ type, token, username, password });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            {type === "bearer" && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  placeholder="Bearer Token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="dark:bg-gray-700 dark:text-gray-200"
                />
              </motion.div>
            )}
            {type === "basic" && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="dark:bg-gray-700 dark:text-gray-200"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dark:bg-gray-700 dark:text-gray-200"
                  />
                </motion.div>
              </>
            )}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Save Authentication
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
