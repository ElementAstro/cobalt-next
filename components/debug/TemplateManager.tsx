'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const BUILT_IN_TEMPLATES = [
  {
    name: 'GET Request',
    config: {
      method: 'GET',
      url: 'https://api.example.com/users',
      headers: {},
    }
  },
  {
    name: 'POST JSON',
    config: {
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: { 'Content-Type': 'application/json' },
      data: { name: 'John Doe', email: 'john@example.com' }
    }
  },
  {
    name: 'PUT with Authentication',
    config: {
      method: 'PUT',
      url: 'https://api.example.com/users/1',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      },
      data: { name: 'Jane Doe', email: 'jane@example.com' }
    }
  },
  {
    name: 'DELETE Request',
    config: {
      method: 'DELETE',
      url: 'https://api.example.com/users/1',
      headers: { 'Authorization': 'Bearer YOUR_TOKEN_HERE' },
    }
  },
]

export default function TemplateManager() {
  const [templates, setTemplates] = useState(BUILT_IN_TEMPLATES)
  const [name, setName] = useState('')
  const [config, setConfig] = useState('')

  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]')
    setTemplates([...BUILT_IN_TEMPLATES, ...savedTemplates])
  }, [])

  const handleSave = () => {
    if (name && config) {
      try {
        const parsedConfig = JSON.parse(config)
        const newTemplate = { name, config: parsedConfig }
        const updatedTemplates = [...templates, newTemplate]
        setTemplates(updatedTemplates)
        localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates.filter(t => !BUILT_IN_TEMPLATES.some(bt => bt.name === t.name))))
        setName('')
        setConfig('')
      } catch (error) {
        alert('Invalid JSON configuration')
      }
    }
  }

  const handleRemove = (templateToRemove) => {
    const updatedTemplates = templates.filter(t => t.name !== templateToRemove.name)
    setTemplates(updatedTemplates)
    localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates.filter(t => !BUILT_IN_TEMPLATES.some(bt => bt.name === t.name))))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <Input
            placeholder="Template Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Request Configuration (JSON)"
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            rows={4}
          />
          <Button onClick={handleSave}>Save Template</Button>
        </div>
        <ul className="space-y-2">
          {templates.map((template, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{template.name}</span>
              {!BUILT_IN_TEMPLATES.some(bt => bt.name === template.name) && (
                <Button variant="destructive" size="sm" onClick={() => handleRemove(template)}>Remove</Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

