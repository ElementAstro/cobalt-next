import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { LogEntry } from '../types/log'

interface LogComparisonProps {
  logs: LogEntry[]
  timeRange: '1h' | '24h' | '7d'
}

export const LogComparison: React.FC<LogComparisonProps> = ({ logs, timeRange }) => {
  const now = new Date()
  const timeRangeMs = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000
  }[timeRange]

  const filteredLogs = logs.filter(log => now.getTime() - new Date(log.timestamp).getTime() <= timeRangeMs)

  const data = [
    { name: 'Current', ...countLogLevels(filteredLogs) },
    { name: 'Previous', ...countLogLevels(logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime()
      return logTime > now.getTime() - 2 * timeRangeMs && logTime <= now.getTime() - timeRangeMs
    })) }
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="info" fill="#8884d8" />
        <Bar dataKey="warn" fill="#82ca9d" />
        <Bar dataKey="error" fill="#ff7300" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function countLogLevels(logs: LogEntry[]) {
  return {
    info: logs.filter(log => log.level === 'info').length,
    warn: logs.filter(log => log.level === 'warn').length,
    error: logs.filter(log => log.level === 'error').length
  }
}

