'use client'

import { useState, useEffect } from 'react'
import { HttpTestClient } from '@/lib/httpTestClient'
import RequestForm from '@/components/debug/RequestForm'
import ResponseDisplay from '@/components/debug/ResponseDisplay'
import HistoryPanel from '@/components/debug/HistoryPanel'
import TemplateManager from '@/components/debug/TemplateManager'
import { useSettings } from '@/hooks/useSettings'

// 修改响应类型以匹配 ResponseDisplay 的期望
interface FormattedResponse {
  status: number
  statusText: string  // 添加此字段
  headers: Record<string, string>
  data: any
  timing?: {  // 添加可选的 timing 字段
    start: number
    end: number
  }
}

interface RequestConfig {
  method: string
  url: string
  headers?: Record<string, string>
  data?: any
}

interface HistoryItem {
  config: RequestConfig
  response: FormattedResponse
}

export default function HttpTester() {
  const [response, setResponse] = useState<FormattedResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const { settings } = useSettings()

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('requestHistory') || '[]') as HistoryItem[]
    setHistory(savedHistory)
  }, [])

  const handleRequest = async (config: RequestConfig): Promise<void> => {
    setLoading(true)
    const client = new HttpTestClient(config)
    const startTime = Date.now()
    
    try {
      const result = await client.request(config)
      const endTime = Date.now()
      
      // 确保结果包含所有必需的字段
      const formattedResult: FormattedResponse = {
        ...result,
        statusText: result.statusText || getDefaultStatusText(result.status),
        timing: {
          start: startTime,
          end: endTime
        }
      }
      
      setResponse(formattedResult)
      const newHistory: HistoryItem[] = [{ config, response: formattedResult }, ...history.slice(0, 9)]
      setHistory(newHistory)
      localStorage.setItem('requestHistory', JSON.stringify(newHistory))
    } catch (error) {
      // 修改错误响应以包含所有必需字段
      const errorResponse: FormattedResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        data: error instanceof Error ? error.message : 'Unknown error',
        timing: {
          start: startTime,
          end: Date.now()
        }
      }
      setResponse(errorResponse)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">HTTP Tester</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <RequestForm onSubmit={handleRequest} settings={settings} />
          <div className="mt-8">
            <TemplateManager />
          </div>
        </div>
        <div>
          <ResponseDisplay response={response} loading={loading} />
          <div className="mt-8">
            {/* 确保 HistoryPanel 接收正确的 props */}
            <HistoryPanel items={history} onSelect={handleRequest} />
          </div>
        </div>
      </div>
    </div>
  )
}

// 辅助函数：根据状态码获取默认状态文本
function getDefaultStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable'
  }
  return statusTexts[status] || 'Unknown Status'
}