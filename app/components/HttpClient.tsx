'use client'

import { useState, useEffect } from 'react'
import { HttpTestClient } from '@/lib/httpTestClient'
import RequestForm from '@/components/debug/RequestForm'
import ResponseDisplay from '@/components/debug/ResponseDisplay'
import HistoryPanel from '@/components/debug/HistoryPanel'
import TemplateManager from '@/components/debug/TemplateManager'
import { useSettings } from '@/hooks/useSettings'

export default function HttpTester() {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const { settings } = useSettings()

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('requestHistory') || '[]')
    setHistory(savedHistory)
  }, [])

  const handleRequest = async (config) => {
    setLoading(true)
    const client = new HttpTestClient(config)
    try {
      const result = await client.request(config)
      setResponse(result)
      setHistory([{ config, response: result }, ...history.slice(0, 9)])
      localStorage.setItem('requestHistory', JSON.stringify([{ config, response: result }, ...history.slice(0, 9)]))
    } catch (error) {
      setResponse(error)
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
            <HistoryPanel history={history} onSelect={handleRequest} />
          </div>
        </div>
      </div>
    </div>
  )
}

