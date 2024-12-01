'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Editor from '@monaco-editor/react'
import { RunParametersConfig } from '../../components/run-parameters-config'
import { ScheduleConfig } from '../../components/schedule-config'

const initialScript = {
  id: 1,
  name: 'Backup Database',
  content: '#!/bin/bash\n# Backup script\necho "Backing up database..."\n# Add your backup logic here',
  parameters: [
    { name: 'DB_NAME', value: 'mydb' },
    { name: 'BACKUP_PATH', value: '/backups' }
  ],
  schedule: { frequency: 'daily', time: '02:00' }
}

export default function EditScriptPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [script, setScript] = useState(initialScript)

  useEffect(() => {
    // In a real application, fetch the script data based on the ID
    console.log('Fetching script with ID:', params.id)
  }, [params.id])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScript({ ...script, name: e.target.value })
  }

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setScript({ ...script, content: value })
    }
  }

  const handleParametersChange = (parameters: Array<{ name: string; value: string }>) => {
    setScript({ ...script, parameters })
  }

  const handleScheduleChange = (schedule: { frequency: string; time: string }) => {
    setScript({ ...script, schedule })
  }

  const handleSave = () => {
    // Here you would typically send the updated script to your backend
    console.log('Saving script:', script)
    router.push('/')
  }

  return (
    <div className="flex flex-col space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Script</h1>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Script Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="script-name">Script Name</Label>
              <Input
                id="script-name"
                value={script.name}
                onChange={handleNameChange}
              />
            </div>
            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="parameters">Run Parameters</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              <TabsContent value="content">
                <div className="border rounded-md">
                  <Editor
                    height="400px"
                    defaultLanguage="shell"
                    value={script.content}
                    onChange={handleContentChange}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="parameters">
                <RunParametersConfig
                  parameters={script.parameters}
                  onChange={handleParametersChange}
                />
              </TabsContent>
              <TabsContent value="schedule">
                <ScheduleConfig
                  schedule={script.schedule}
                  onChange={handleScheduleChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

