"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import styled from "styled-components";

// 整合 RunParametersConfig
interface Parameter {
  name: string;
  value: string;
}

interface Script {
  id: number;
  name: string;
  content: string;
  parameters: Parameter[];
  schedule: {
    frequency: string;
    time: string;
    date: string;
  };
  status?: "idle" | "running" | "paused";
}

// 整合 EditScriptDialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash } from "lucide-react";

export default function EditScriptPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [script, setScript] = useState<Script>({
    id: 1,
    name: "Backup Database",
    content:
      '#!/bin/bash\n# Backup script\necho "Backing up database..."\n# Add your backup logic here',
    parameters: [
      { name: "DB_NAME", value: "mydb" },
      { name: "BACKUP_PATH", value: "/backups" },
    ],
    schedule: { frequency: "daily", time: "02:00", date: "" },
    status: "idle",
  });
  const [editScript, setEditScript] = useState<Script | null>(null);
  const [newParam, setNewParam] = useState<Parameter>({ name: "", value: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, fetch the script data based on the ID
    console.log("Fetching script with ID:", params.id);
  }, [params.id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScript({ ...script, name: e.target.value });
  };

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setScript({ ...script, content: value });
    }
  };

  const handleParametersChange = (parameters: Parameter[]) => {
    setScript({ ...script, parameters });
  };

  const handleScheduleChange = (schedule: {
    frequency: string;
    time: string;
    date: string;
  }) => {
    setScript({ ...script, schedule });
  };

  const handleSave = () => {
    // Here you would typically send the updated script to your backend
    console.log("Saving script:", script);
    router.push("/");
  };

  const handleAddParameter = () => {
    if (newParam.name && newParam.value) {
      setScript({ ...script, parameters: [...script.parameters, newParam] });
      setNewParam({ name: "", value: "" });
      setError(null);
    } else {
      setError("参数名称和值不能为空");
    }
  };

  const handleRemoveParameter = (index: number) => {
    const updatedParams = script.parameters.filter((_, i) => i !== index);
    setScript({ ...script, parameters: updatedParams });
  };

  const saveEditedScript = () => {
    // 保存编辑后的脚本逻辑
    console.log("Edited Script:", editScript);
    setEditScript(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-4 md:space-y-6 lg:space-y-8 p-4 md:p-8 lg:p-12 bg-gray-900 text-white min-h-screen"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold">Edit Script</h1>
        <Button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Save Changes
        </Button>
      </motion.div>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Script Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="script-name">Script Name</Label>
                <Input
                  id="script-name"
                  value={script.name}
                  onChange={handleNameChange}
                  className="bg-gray-700 text-white"
                />
              </div>
              <Tabs defaultValue="content">
                <TabsList className="bg-gray-700">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="parameters">Run Parameters</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                  <div className="border rounded-md">
                    <Editor
                      height="400px"
                      defaultLanguage="shell"
                      value={script.content}
                      onChange={handleContentChange}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        theme: "vs-dark",
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="parameters">
                  <Container>
                    <h2>运行参数配置</h2>
                    {script.parameters.map((param, index) => (
                      <ParameterRow
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ParameterInput
                          value={param.name}
                          onChange={(e) => {
                            const updatedParams = [...script.parameters];
                            updatedParams[index].name = e.target.value;
                            handleParametersChange(updatedParams);
                          }}
                        />
                        <ParameterInput
                          value={param.value}
                          onChange={(e) => {
                            const updatedParams = [...script.parameters];
                            updatedParams[index].value = e.target.value;
                            handleParametersChange(updatedParams);
                          }}
                        />
                        <Button onClick={() => handleRemoveParameter(index)}>
                          <Trash />
                        </Button>
                      </ParameterRow>
                    ))}
                    <ParameterRow
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ParameterInput
                        placeholder="参数名称"
                        value={newParam.name}
                        onChange={(e) =>
                          setNewParam({ ...newParam, name: e.target.value })
                        }
                      />
                      <ParameterInput
                        placeholder="参数值"
                        value={newParam.value}
                        onChange={(e) =>
                          setNewParam({ ...newParam, value: e.target.value })
                        }
                      />
                      <Button onClick={handleAddParameter}>
                        <Plus />
                      </Button>
                    </ParameterRow>
                    {error && <ErrorText>{error}</ErrorText>}
                  </Container>
                </TabsContent>
                <TabsContent value="schedule">
                  <motion.div
                    className="space-y-4 p-4 bg-gray-800 dark:bg-gray-900 rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="space-y-2"
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Label
                        htmlFor="frequency"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Frequency
                      </Label>
                      <Select
                        value={script.schedule.frequency}
                        onValueChange={(value) =>
                          handleScheduleChange({
                            ...script.schedule,
                            frequency: value,
                          })
                        }
                      >
                        <SelectTrigger
                          id="frequency"
                          className="dark:bg-gray-700 dark:text-gray-300"
                        >
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:text-gray-300">
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <motion.div
                      className="space-y-2"
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <Label
                        htmlFor="time"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={script.schedule.time}
                        onChange={(e) =>
                          handleScheduleChange({
                            ...script.schedule,
                            time: e.target.value,
                          })
                        }
                        className="dark:bg-gray-700 dark:text-gray-300"
                      />
                    </motion.div>
                    <motion.div
                      className="space-y-2"
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Label
                        htmlFor="date"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={script.schedule.date}
                        onChange={(e) =>
                          handleScheduleChange({
                            ...script.schedule,
                            date: e.target.value,
                          })
                        }
                        className="dark:bg-gray-700 dark:text-gray-300"
                      />
                    </motion.div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 整合 EditScriptDialog */}
      <Dialog open={!!editScript} onOpenChange={() => setEditScript(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑脚本</DialogTitle>
            <DialogDescription>修改脚本的名称和内容。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="edit-name"
                className="text-right text-gray-700 dark:text-gray-300"
              >
                名称
              </Label>
              <Input
                id="edit-name"
                value={editScript?.name || ""}
                onChange={(e) =>
                  setEditScript((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
                className="col-span-3"
                placeholder="输入脚本名称"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label
                htmlFor="edit-content"
                className="text-right mt-2 text-gray-700 dark:text-gray-300"
              >
                内容
              </Label>
              <Textarea
                id="edit-content"
                value={editScript?.content || ""}
                onChange={(e) =>
                  setEditScript((prev) =>
                    prev ? { ...prev, content: e.target.value } : prev
                  )
                }
                className="col-span-3"
                placeholder="输入脚本内容"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={saveEditedScript}
              disabled={!editScript?.name || !editScript?.content}
            >
              保存修改
            </Button>
            <Button onClick={() => setEditScript(null)} variant="ghost">
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// ...existing styled-components...
const Container = styled.div`
  background-color: #1f1f1f;
  color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  max-width: 700px;
  margin: 0 auto;
  @media (max-width: 600px) {
    padding: 15px;
  }
`;

const ParameterRow = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ParameterInput = styled(Input)`
  margin-right: 10px;
  flex: 1;
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 10px;
`;
