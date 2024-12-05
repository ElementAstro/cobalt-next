"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import "prismjs/components/prism-json";

interface ResponseDisplayProps {
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
  } | null;
  loading: boolean;
}

export default function ResponseDisplay({
  response,
  loading,
}: ResponseDisplayProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            No response yet. Send a request to see the result.
          </p>
        </CardContent>
      </Card>
    );
  }

  const highlightCode = (code: string) => {
    return Prism.highlight(code, Prism.languages.json, "json");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-semibold">Status:</h3>
              <p>
                {response.status} {response.statusText}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Headers:</h3>
              <pre className="language-json">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(
                      JSON.stringify(response.headers, null, 2)
                    ),
                  }}
                />
              </pre>
            </div>
            <div>
              <h3 className="font-semibold">Body:</h3>
              <pre className="language-json">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(
                      JSON.stringify(response.data, null, 2)
                    ),
                  }}
                />
              </pre>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
