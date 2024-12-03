import { LogEntry } from '../types/log'

export async function uploadLogs(file: File): Promise<LogEntry[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string
        let logs: LogEntry[]
        
        if (file.name.endsWith('.json')) {
          logs = JSON.parse(fileContent)
        } else if (file.name.endsWith('.csv')) {
          logs = parseCSV(fileContent)
        } else {
          throw new Error('Unsupported file format')
        }
        
        resolve(logs)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = (error) => reject(error)
    
    reader.readAsText(file)
  })
}

function parseCSV(content: string): LogEntry[] {
  const lines = content.split('\n')
  const headers = lines[0].split(',')
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',')
    const entry: any = {}
    
    headers.forEach((header, i) => {
      if (header === 'id') {
        entry[header] = parseInt(values[i])
      } else if (header === 'tags') {
        entry[header] = values[i] ? values[i].split(';') : undefined
      } else {
        entry[header] = values[i]
      }
    })
    
    return entry as LogEntry
  })
}

