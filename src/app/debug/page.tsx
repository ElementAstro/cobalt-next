"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Span } from "@/components/custom/span";
import { HttpTestClient } from "@/services/http-client";
import RequestForm from "@/components/debug/request-form";
import ResponseDisplay from "@/components/debug/response-display";
import HistoryPanel from "@/components/debug/history-panel";
import TemplateManager from "@/components/debug/template-manager";
import { useSettings } from "@/hooks/use-debug";

interface FormattedResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  timing?: {
    start: number;
    end: number;
  };
}

interface RequestConfig {
  method: string;
  url: string;
  headers?: Record<string, string>;
  data?: any;
}

interface HistoryItem {
  config: RequestConfig;
  response: FormattedResponse;
}

export default function HttpTester() {
  const [response, setResponse] = useState<FormattedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem("requestHistory") || "[]"
    ) as HistoryItem[];
    setHistory(savedHistory);
  }, []);

  const handleRequest = async (config: RequestConfig): Promise<void> => {
    setLoading(true);
    const client = new HttpTestClient(config);
    const startTime = Date.now();

    try {
      const result = await client.request(config);
      const endTime = Date.now();

      const formattedResult: FormattedResponse = {
        ...result,
        statusText: result.statusText || getDefaultStatusText(result.status),
        timing: {
          start: startTime,
          end: endTime,
        },
      };

      setResponse(formattedResult);
      const newHistory: HistoryItem[] = [
        { config, response: formattedResult },
        ...history.slice(0, 9),
      ];
      setHistory(newHistory);
      localStorage.setItem("requestHistory", JSON.stringify(newHistory));
    } catch (error) {
      const errorResponse: FormattedResponse = {
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        data: error instanceof Error ? error.message : "Unknown error",
        timing: {
          start: startTime,
          end: Date.now(),
        },
      };
      setResponse(errorResponse);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">HTTP Tester</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <RequestForm onSubmit={handleRequest} settings={settings} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <TemplateManager />
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <ResponseDisplay response={response} loading={loading} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <HistoryPanel onSelect={handleRequest} />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 p-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col h-auto gap-1 p-2"
            onClick={() =>
              document
                .getElementById("request-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <Span size="sm">Request</Span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col h-auto gap-1 p-2"
            onClick={() =>
              document
                .getElementById("response-display")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <Span size="sm">Response</Span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col h-auto gap-1 p-2"
            onClick={() =>
              document
                .getElementById("history-panel")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <Span size="sm">History</Span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function getDefaultStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };
  return statusTexts[status] || "Unknown Status";
}
