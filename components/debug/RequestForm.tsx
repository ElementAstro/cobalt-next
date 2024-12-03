'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash, Edit, Save, Eye } from 'lucide-react'

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

export default function RequestForm({ onSubmit, settings }) {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState('')
  const [body, setBody] = useState('')
  const [timeout, setTimeoutValue] = useState(settings.defaultTimeout)
  const [retries, setRetries] = useState(3)
  const [retryDelay, setRetryDelay] = useState(1000)
  const [validateSSL, setValidateSSL] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState('none')
  const [templates, setTemplates] = useState(BUILT_IN_TEMPLATES)
  const [isEditing, setIsEditing] = useState(false)
  const [editTemplateName, setEditTemplateName] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]')
    setTemplates([...BUILT_IN_TEMPLATES, ...savedTemplates])
    const savedHistory = JSON.parse(localStorage.getItem('requestHistory') || '[]')
    setHistory(savedHistory)
  }, [])

  useEffect(() => {
    if (selectedTemplate !== 'none') {
      const template = templates.find(t => t.name === selectedTemplate)
      if (template) {
        setMethod(template.config.method || 'GET')
        setUrl(template.config.url || '')
        setHeaders(JSON.stringify(template.config.headers || {}, null, 2))
        setBody(JSON.stringify(template.config.data || {}, null, 2))
        setTimeoutValue(template.config.timeout || settings.defaultTimeout)
        setRetries(template.config.retries || 3)
        setRetryDelay(template.config.retryDelay || 1000)
        setValidateSSL(template.config.rejectUnauthorized !== false)
      }
    }
  }, [selectedTemplate, templates, settings.defaultTimeout])

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      const config = {
        method,
        url,
        headers: headers ? JSON.parse(headers) : {},
        data: body ? JSON.parse(body) : undefined,
        timeout,
        retries,
        retryDelay,
        rejectUnauthorized: validateSSL,
      }
      onSubmit(config)
      // 保存请求到历史记录
      const newHistory = [{ ...config, timestamp: new Date().toISOString() }, ...history]
      setHistory(newHistory)
      localStorage.setItem('requestHistory', JSON.stringify(newHistory))
    } catch (error) {
      alert('Headers 或 Body 必须是有效的 JSON 格式')
    }
  }

  const saveAsTemplate = () => {
    const templateName = prompt('输入模板名称:')
    if (templateName) {
      const newTemplate = {
        name: templateName,
        config: {
          method,
          url,
          headers: headers ? JSON.parse(headers) : {},
          data: body ? JSON.parse(body) : undefined,
          timeout,
          retries,
          retryDelay,
          rejectUnauthorized: validateSSL,
        }
      }
      const updatedTemplates = [...templates, newTemplate]
      setTemplates(updatedTemplates)
      localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates.filter(t => !BUILT_IN_TEMPLATES.some(bt => bt.name === t.name))))
    }
  }

  const deleteTemplate = (templateName) => {
    const updatedTemplates = templates.filter(t => t.name !== templateName)
    setTemplates(updatedTemplates)
    localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates.filter(t => !BUILT_IN_TEMPLATES.some(bt => bt.name === t.name))))
  }

  const editTemplate = (templateName) => {
    const template = templates.find(t => t.name === templateName)
    if (template) {
      setSelectedTemplate(templateName)
      setIsEditing(true)
      setEditTemplateName(templateName)
    }
  }

  const saveEditedTemplate = () => {
    if (editTemplateName) {
      const updatedTemplates = templates.map(t => 
        t.name === editTemplateName ? {
          ...t,
          config: {
            method,
            url,
            headers: headers ? JSON.parse(headers) : {},
            data: body ? JSON.parse(body) : undefined,
            timeout,
            retries,
            retryDelay,
            rejectUnauthorized: validateSSL,
          }
        } : t
      )
      setTemplates(updatedTemplates)
      localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates.filter(t => !BUILT_IN_TEMPLATES.some(bt => bt.name === t.name))))
      setIsEditing(false)
      setEditTemplateName('')
    }
  }

  const clearForm = () => {
    setMethod('GET')
    setUrl('')
    setHeaders('')
    setBody('')
    setTimeoutValue(settings.defaultTimeout)
    setRetries(3)
    setRetryDelay(1000)
    setValidateSSL(true)
    setSelectedTemplate('none')
    setIsEditing(false)
    setEditTemplateName('')
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('requestHistory')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <Card>
        <CardHeader>
          <CardTitle>HTTP 请求</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center sm:space-x-4"
            >
              <Label className="mb-1 sm:mb-0">选择模板</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-full sm:w-64 dark:bg-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="选择模板" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无模板</SelectItem>
                  {templates.map((template, index) => (
                    <SelectItem key={index} value={template.name}>
                      {template.name}
                      {!BUILT_IN_TEMPLATES.some(bt => bt.name === template.name) && (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); deleteTemplate(template.name) }}
                            className="ml-2"
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                            <span className="sr-only">删除模板</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); editTemplate(template.name) }}
                            className="ml-1"
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                            <span className="sr-only">编辑模板</span>
                          </Button>
                        </>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isEditing && (
                <Button
                  type="button"
                  onClick={saveEditedTemplate}
                  variant="primary"
                  className="mt-2 sm:mt-0 flex items-center"
                >
                  <Save className="h-4 w-4 mr-1" />
                  保存模板
                </Button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row sm:space-x-4"
            >
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-full sm:w-1/3 dark:bg-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="方法" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                  <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="输入 URL"
                className="w-full sm:w-2/3 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label className="mb-1 text-sm font-medium dark:text-gray-300">Headers (JSON 格式)</Label>
              <Textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder='例如: {"Authorization": "Bearer token"}'
                rows={4}
                className="w-full dark:bg-gray-700 dark:text-gray-200"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label className="mb-1 text-sm font-medium dark:text-gray-300">请求体 (JSON 格式)</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='例如: {"name": "John Doe", "email": "john@example.com"}'
                rows={4}
                className="w-full dark:bg-gray-700 dark:text-gray-200"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Input
                type="number"
                value={timeout}
                onChange={(e) => setTimeoutValue(Number(e.target.value))}
                placeholder="超时时间 (毫秒)"
                className="dark:bg-gray-700 dark:text-gray-200"
                required
                min={0}
              />
              <Input
                type="number"
                value={retries}
                onChange={(e) => setRetries(Number(e.target.value))}
                placeholder="重试次数"
                className="dark:bg-gray-700 dark:text-gray-200"
                required
                min={0}
              />
              <Input
                type="number"
                value={retryDelay}
                onChange={(e) => setRetryDelay(Number(e.target.value))}
                placeholder="重试延迟 (毫秒)"
                className="dark:bg-gray-700 dark:text-gray-200"
                required
                min={0}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-2"
            >
              <Switch
                id="validate-ssl"
                checked={validateSSL}
                onCheckedChange={setValidateSSL}
              />
              <Label htmlFor="validate-ssl" className="dark:text-gray-300">验证 SSL</Label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row sm:space-x-2"
            >
              <Button type="submit" className="flex-grow flex items-center justify-center dark:bg-blue-600 dark:text-white">
                <Eye className="h-4 w-4 mr-1" />
                发送请求
              </Button>
              <Button type="button" onClick={saveAsTemplate} variant="outline" className="flex-grow flex items-center justify-center dark:border-gray-600 dark:text-gray-200">
                <Plus className="h-4 w-4 mr-1" />
                保存为模板
              </Button>
              <Button type="button" onClick={clearForm} variant="secondary" className="flex-grow flex items-center justify-center dark:bg-gray-600 dark:text-white">
                <Trash className="h-4 w-4 mr-1" />
                清空表单
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      {/* 请求历史记录 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>请求历史记录</CardTitle>
          <Button type="button" onClick={clearHistory} variant="outline" size="sm" className="flex items-center">
            <Trash className="h-4 w-4 mr-1" />
            清空历史
          </Button>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {history.length > 0 ? (
                  history.map((req, index) => (
                    <Card key={index} className="bg-gray-50 dark:bg-gray-700">
                      <CardHeader className="flex justify-between items-center">
                        <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">{req.method} {req.url}</CardTitle>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(req.timestamp).toLocaleString()}</span>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm"><strong>Headers:</strong> {JSON.stringify(req.headers)}</p>
                        {req.data && <p className="text-sm"><strong>Body:</strong> {JSON.stringify(req.data)}</p>}
                        <p className="text-sm"><strong>Timeout:</strong> {req.timeout} ms</p>
                        <p className="text-sm"><strong>Retries:</strong> {req.retries}</p>
                        <p className="text-sm"><strong>Retry Delay:</strong> {req.retryDelay} ms</p>
                        <p className="text-sm"><strong>Validate SSL:</strong> {req.rejectUnauthorized ? '是' : '否'}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">没有历史记录。</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <Button type="button" onClick={() => setShowHistory(!showHistory)} variant="ghost" className="mt-4 flex items-center">
            {showHistory ? '隐藏历史记录' : '显示历史记录'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}