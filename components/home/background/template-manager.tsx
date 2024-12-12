import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Template } from './types'

interface TemplateManagerProps {
  currentSettings: Template
  onSelectTemplate: (template: Template) => void
}

export function TemplateManager({ currentSettings, onSelectTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [newTemplateName, setNewTemplateName] = useState('')

  useEffect(() => {
    const savedTemplates = localStorage.getItem('customTemplates')
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    }
  }, [])

  const saveTemplate = () => {
    if (newTemplateName) {
      const newTemplate = { ...currentSettings, name: newTemplateName }
      const updatedTemplates = [...templates, newTemplate]
      setTemplates(updatedTemplates)
      localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates))
      setNewTemplateName('')
    }
  }

  const deleteTemplate = (templateName: string) => {
    const updatedTemplates = templates.filter(t => t.name !== templateName)
    setTemplates(updatedTemplates)
    localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">模板管理</h3>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
          placeholder="新模板名称"
        />
        <Button onClick={saveTemplate}>保存当前设置为模板</Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <div key={template.name} className="flex items-center justify-between p-2 border rounded">
            <span>{template.name}</span>
            <div>
              <Button variant="outline" size="sm" onClick={() => onSelectTemplate(template)}>
                使用
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteTemplate(template.name)}>
                删除
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

