import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { LogEntry } from '@/types/log'

interface LogChartProps {
  logs: LogEntry[]
}

export const LogChart: React.FC<LogChartProps> = ({ logs }) => {
  const logLevels = ['info', 'warn', 'error']
  const data = logLevels.map(level => ({
    name: level,
    count: logs.filter(log => log.level === level).length
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

