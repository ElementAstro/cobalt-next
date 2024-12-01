import { Script, Job } from '@/types/script'

const MOCK_MODE_KEY = 'useMockApi'

class ApiService {
  private baseUrl: string
  private useMockApi: boolean

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'
    this.useMockApi = localStorage.getItem(MOCK_MODE_KEY) === 'true'
  }

  setMockMode(useMock: boolean) {
    this.useMockApi = useMock
    localStorage.setItem(MOCK_MODE_KEY, useMock.toString())
  }

  async fetchScripts(): Promise<Script[]> {
    if (this.useMockApi) {
      return this.mockFetchScripts()
    }

    const response = await fetch(`${this.baseUrl}/scripts`)
    if (!response.ok) {
      throw new Error('Failed to fetch scripts')
    }
    return response.json()
  }

  async createScript(script: Partial<Script>): Promise<Script> {
    if (this.useMockApi) {
      return this.mockCreateScript(script)
    }

    const response = await fetch(`${this.baseUrl}/scripts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(script),
    })
    if (!response.ok) {
      throw new Error('Failed to create script')
    }
    return response.json()
  }

  async updateScript(id: number, script: Partial<Script>): Promise<Script> {
    if (this.useMockApi) {
      return this.mockUpdateScript(id, script)
    }

    const response = await fetch(`${this.baseUrl}/scripts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(script),
    })
    if (!response.ok) {
      throw new Error('Failed to update script')
    }
    return response.json()
  }

  async deleteScript(id: number): Promise<void> {
    if (this.useMockApi) {
      return this.mockDeleteScript(id)
    }

    const response = await fetch(`${this.baseUrl}/scripts/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete script')
    }
  }

  async fetchJobs(): Promise<Job[]> {
    if (this.useMockApi) {
      return this.mockFetchJobs()
    }

    const response = await fetch(`${this.baseUrl}/jobs`)
    if (!response.ok) {
      throw new Error('Failed to fetch jobs')
    }
    return response.json()
  }

  // Mock implementations
  private mockFetchScripts(): Promise<Script[]> {
    return Promise.resolve([
      { id: 1, name: 'Backup Database', content: '#!/bin/bash\n# Backup script', lastRun: '2023-06-15 10:30', status: 'Success' },
      { id: 2, name: 'Update User Permissions', content: '#!/bin/bash\n# Update permissions script', lastRun: '2023-06-14 15:45', status: 'Failed' },
      { id: 3, name: 'Generate Monthly Report', content: '#!/bin/bash\n# Generate report script', lastRun: '2023-06-01 00:00', status: 'Success' },
    ])
  }

  private mockCreateScript(script: Partial<Script>): Promise<Script> {
    const newScript: Script = {
      id: Date.now(),
      name: script.name || 'New Script',
      content: script.content || '#!/bin/bash\n# New script',
      lastRun: 'Never',
      status: 'New',
    }
    return Promise.resolve(newScript)
  }

  private mockUpdateScript(id: number, script: Partial<Script>): Promise<Script> {
    return Promise.resolve({ id, ...script } as Script)
  }

  private mockDeleteScript(id: number): Promise<void> {
    return Promise.resolve()
  }

  private mockFetchJobs(): Promise<Job[]> {
    return Promise.resolve([
      { id: 1, scriptId: 1, startTime: '2023-06-15 10:30', status: 'Running', progress: 45 },
      { id: 2, scriptId: 2, startTime: '2023-06-14 15:45', status: 'Completed', progress: 100 },
      { id: 3, scriptId: 3, startTime: '2023-06-15 00:00', status: 'Failed', progress: 80 },
    ])
  }
}

export const api = new ApiService()

