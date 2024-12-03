import { LogEntry } from '../types/log'

const sources = ['frontend', 'backend', 'database', 'auth', 'api']
const users = ['alice', 'bob', 'charlie', 'david', 'eve']
const levels: LogEntry['level'][] = ['info', 'warn', 'error']

export function generateMockLogs(count: number): LogEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: `Mock log message ${i}: ${Math.random().toString(36).substring(7)}`,
    source: sources[Math.floor(Math.random() * sources.length)],
    user: users[Math.floor(Math.random() * users.length)],
    sessionId: Math.random().toString(36).substring(7),
    tags: Math.random() > 0.7 ? [Math.random().toString(36).substring(7)] : undefined,
  }))
}

