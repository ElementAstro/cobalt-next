'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FileText, Plus } from 'lucide-react'
import { ActiveScripts } from './components/active-scripts'
import { ScriptList } from './components/script-list'
import { api } from '@/services/script'
import { Script, Job } from '@/types/script'

export default function DashboardPage() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [useMockApi, setUseMockApi] = useState(false)
  const [newScriptName, setNewScriptName] = useState('')

  useEffect(() => {
    api.setMockMode(useMockApi)
    fetchData()
  }, [useMockApi])

  const fetchData = async () => {
    try {
      const [fetchedScripts, fetchedJobs] = await Promise.all([
        api.fetchScripts(),
        api.fetchJobs()
      ])
      setScripts(fetchedScripts)
      setJobs(fetchedJobs)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleCreateScript = async () => {
    if (newScriptName) {
      try {
        await api.createScript({ name: newScriptName })
        setNewScriptName('')
        fetchData()
      } catch (error) {
        console.error('Error creating script:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={useMockApi}
            onCheckedChange={setUseMockApi}
            id="mock-mode"
          />
          <Label htmlFor="mock-mode">Mock API</Label>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Script
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Script</DialogTitle>
                <DialogDescription>
                  Enter a name for your new script. You can edit the content later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newScriptName}
                    onChange={(e) => setNewScriptName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateScript}>Create Script</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scripts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scripts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scripts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter(job => job.status === 'Running').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter(job => job.status === 'Completed' && new Date(job.startTime).toDateString() === new Date().toDateString()).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Scripts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter(job => job.status === 'Failed').length}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Active Scripts</CardTitle>
          </CardHeader>
          <CardContent>
            <ActiveScripts jobs={jobs.filter(job => job.status === 'Running')} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Scripts</CardTitle>
            <CardDescription>
              You ran {jobs.length} scripts this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScriptList scripts={scripts} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

