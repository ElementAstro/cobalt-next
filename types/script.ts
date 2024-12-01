export interface Script {
  id: number
  name: string
  content: string
  lastRun: string
  status: string
}

export interface Job {
  id: number
  scriptId: number
  startTime: string
  status: string
  progress: number
}

