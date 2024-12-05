"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PerformanceTesterProps {
  onTest: () => Promise<void>;
}

interface TestResults {
  totalTime: number;
  avgLatency: number;
  requestsPerSecond: number;
}

export default function PerformanceTester({ onTest }: PerformanceTesterProps) {
  const [concurrency, setConcurrency] = useState(10);
  const [iterations, setIterations] = useState(100);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResults | null>(null);

  const runTest = async () => {
    setProgress(0);
    setResults(null);

    const startTime = Date.now();
    let completedRequests = 0;
    let totalLatency = 0;

    const batchSize = Math.ceil(iterations / concurrency);

    for (let i = 0; i < batchSize; i++) {
      const batch = Array.from({ length: concurrency }).map(async () => {
        if (completedRequests < iterations) {
          const start = Date.now();
          await onTest();
          const end = Date.now();
          totalLatency += end - start;
          completedRequests++;
          setProgress(Math.floor((completedRequests / iterations) * 100));
        }
      });

      await Promise.all(batch);
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgLatency = totalLatency / iterations;

    setResults({
      totalTime,
      avgLatency,
      requestsPerSecond: (iterations / totalTime) * 1000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Concurrency"
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Iterations"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
            />
          </div>
          <Button onClick={runTest}>Run Performance Test</Button>
          {progress > 0 && <Progress value={progress} />}
          {results && (
            <div className="space-y-2">
              <p>Total Time: {results.totalTime}ms</p>
              <p>Average Latency: {results.avgLatency.toFixed(2)}ms</p>
              <p>Requests per Second: {results.requestsPerSecond.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
