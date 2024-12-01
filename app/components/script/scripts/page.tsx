'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Play, Pause, Edit, Trash } from 'lucide-react'

interface Script {
  id: number
  name: string
  content: string
  status: 'idle' | 'running' | 'paused'
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([
    { id: 1, name: 'Backup Database', content: '#!/bin/bash\n# Backup script', status: 'idle' },
    { id: 2, name: 'Update User Permissions', content: '#!/bin/bash\n# Update permissions script', status: 'idle' },
    { id: 3, name: 'Generate Report', content: '#!/bin/bash\n# Generate report script', status: 'idle' },
  ])
  const [newScript, setNewScript] = useState({ name: '', content: '' })

  const handleCreateScript = () => {
    if (newScript.name && newScript.content) {
      setScripts([...scripts, { id: Date.now(), ...newScript, status: 'idle' }])
      setNewScript({ name: '', content: '' })
    }
  }

  const handleDeleteScript = (id: number) => {
    setScripts(scripts.filter(script => script.id !== id))
  }

  const handleRunScript = (id: number) => {
    setScripts(scripts.map(script => 
      script.id === id ? { ...script, status: 'running' } : script
    ))
  }

  const handlePauseScript = (id: number) => {
    setScripts(scripts.map(script => 
      script.id === id ? { ...script, status: 'paused' } : script
    ))
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scripts</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Script</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Script</DialogTitle>
              <DialogDescription>
                Enter the details for your new script.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newScript.name}
                  onChange={(e) => setNewScript({ ...newScript, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={newScript.content}
                  onChange={(e) => setNewScript({ ...newScript, content: e.target.value })}
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
      <Card>
        <CardHeader>
          <CardTitle>Your Scripts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scripts.map((script) => (
                <TableRow key={script.id}>
                  <TableCell>{script.name}</TableCell>
                  <TableCell>{script.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleRunScript(script.id)}>
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handlePauseScript(script.id)}>
                        <Pause className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteScript(script.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

