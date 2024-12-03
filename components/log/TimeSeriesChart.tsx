import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { LogEntry } from '../types/log'

interface TimeSeriesChartProps {
  logs: LogEntry[]
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ logs }) => {
  const data = logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleString()
    if (!acc[date]) {
      acc[date] = { date, info: 0, warn: 0, error: 0 }
    }
    acc[date][log.level]++
    return acc
  }, {} as Record<string, { date: string; info: number; warn: number; error: number }>)

  const chartData = Object.values(data).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="info" stroke="#8884d8" />
        <Line type="monotone" dataKey="warn" stroke="#82ca9d" />
        <Line type="monotone" dataKey="error" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  )
}

