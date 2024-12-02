"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RotateCcw, Download, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CommandHistory {
  command: string;
  timestamp: string;
  status: "success" | "error" | "running";
  output: string;
}

const THEMES = {
  default: "bg-background text-foreground",
  dark: "bg-black text-green-500",
  light: "bg-white text-black",
  blue: "bg-blue-900 text-blue-100",
  red: "bg-red-900 text-red-100",
  green: "bg-green-900 text-green-100",
};

export default function TerminalPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([
    "Welcome to the enhanced terminal. Type your commands below.",
  ]);
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>(() => {
    const saved = localStorage.getItem("commandHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedTheme, setSelectedTheme] =
    useState<keyof typeof THEMES>("default");
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("commandHistory", JSON.stringify(commandHistory));
  }, [commandHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const executeCommand = async (command: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    switch (command.toLowerCase().trim()) {
      case "help":
        return "Available commands: help, echo, date, clear, theme, history, exit, version";
      case "echo":
        return "Usage: echo <message>";
      case "date":
        return new Date().toLocaleString();
      case "clear":
        setOutput([]);
        return "";
      case "theme":
        return `Available themes: ${Object.keys(THEMES).join(
          ", "
        )}\nUsage: theme <theme-name>`;
      case "history":
        return "Displaying command history.";
      case "version":
        return "Terminal Version 1.0.0";
      case "exit":
        return "Exiting terminal...";
      default:
        if (command.toLowerCase().startsWith("echo ")) {
          return command.slice(5);
        }
        if (command.toLowerCase().startsWith("theme ")) {
          const newTheme = command.slice(6).trim() as keyof typeof THEMES;
          if (THEMES[newTheme]) {
            setSelectedTheme(newTheme);
            return `Theme changed to ${newTheme}`;
          } else {
            return `Invalid theme. Available themes: ${Object.keys(THEMES).join(
              ", "
            )}`;
          }
        }
        return `Command not found: ${command}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isExecuting) {
      setIsExecuting(true);
      const newOutput = [...output, `$ ${input}`];
      setOutput(newOutput);

      const newCommand: CommandHistory = {
        command: input,
        timestamp: new Date().toLocaleTimeString(),
        status: "running",
        output: "",
      };
      setCommandHistory([newCommand, ...commandHistory]);

      try {
        const commandOutput = await executeCommand(input);
        const updatedOutput = commandOutput
          ? [...newOutput, commandOutput]
          : newOutput;
        setOutput(updatedOutput);

        newCommand.status = "success";
        newCommand.output = commandOutput;
      } catch (error) {
        const errorMessage = `Error: ${(error as Error).message}`;
        setOutput([...newOutput, errorMessage]);

        newCommand.status = "error";
        newCommand.output = errorMessage;
      } finally {
        setCommandHistory([
          { ...newCommand, timestamp: new Date().toLocaleTimeString() },
          ...commandHistory,
        ]);
        setInput("");
        setIsExecuting(false);
      }
    }
  };

  const handleClearTerminal = () => {
    setOutput([]);
    setCommandHistory([]);
    localStorage.removeItem("commandHistory");
  };

  const handleDownloadHistory = () => {
    const historyText = commandHistory
      .map(
        (cmd) =>
          `${cmd.timestamp} - ${cmd.command} (${cmd.status})\n${cmd.output}`
      )
      .join("\n\n");
    const blob = new Blob([historyText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "terminal_history.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-3xl font-bold">Terminal</h1>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <Select
            value={selectedTheme}
            onValueChange={(value) =>
              setSelectedTheme(value as keyof typeof THEMES)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(THEMES).map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleClearTerminal}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownloadHistory}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Interactive Terminal</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ScrollArea
              className={cn(
                "h-[60vh] w-full rounded-md border p-4 font-mono text-sm overflow-auto",
                THEMES[selectedTheme]
              )}
              ref={outputRef}
            >
              {output.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </ScrollArea>
            <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
              <Input
                type="text"
                placeholder="Enter command..."
                value={input}
                onChange={handleInputChange}
                className="flex-grow"
                disabled={isExecuting}
                autoFocus
              />
              <Button type="submit" disabled={isExecuting}>
                {isExecuting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Run"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Command History</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="history">
                <ScrollArea className="h-[50vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Command</TableHead>
                        <TableHead className="w-[30%]">Time</TableHead>
                        <TableHead className="w-[30%]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commandHistory.map((cmd, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono">
                            {cmd.command}
                          </TableCell>
                          <TableCell>{cmd.timestamp}</TableCell>
                          <TableCell>
                            {cmd.status === "success" ? (
                              <Check className="inline text-green-500" />
                            ) : cmd.status === "error" ? (
                              <X className="inline text-red-500" />
                            ) : (
                              <Loader2 className="inline text-yellow-500 animate-spin" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="details">
                <ScrollArea className="h-[50vh]">
                  {commandHistory.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-bold">Last Command Details</h3>
                      <p>
                        <strong>Command:</strong> {commandHistory[0].command}
                      </p>
                      <p>
                        <strong>Executed at:</strong>{" "}
                        {commandHistory[0].timestamp}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={
                            commandHistory[0].status === "success"
                              ? "text-green-500"
                              : commandHistory[0].status === "error"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }
                        >
                          {commandHistory[0].status === "success"
                            ? "Success"
                            : commandHistory[0].status === "error"
                            ? "Error"
                            : "Running"}
                        </span>
                      </p>
                      <p>
                        <strong>Output:</strong>
                      </p>
                      <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
                        {commandHistory[0].output}
                      </pre>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
