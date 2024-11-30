import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileItem } from './FileItem'
import { Download, Share, Archive } from 'lucide-react'

interface FileOperationsProps {
  onFileOperation: (operation: string, file: FileItem, content?: string) => void
  currentPath: string
  files: FileItem[]
}

export function FileOperations({ onFileOperation, currentPath, files }: FileOperationsProps) {
  const [newFileName, setNewFileName] = React.useState('')
  const [fileContent, setFileContent] = React.useState('')

  const handleCreate = () => {
    onFileOperation('create', { name: newFileName, isDirectory: false, size: 0, modifiedAt: new Date().toISOString() }, fileContent)
    setNewFileName('')
    setFileContent('')
  }

  const handleCreateFolder = () => {
    onFileOperation('create', { name: newFileName, isDirectory: true, size: 0, modifiedAt: new Date().toISOString() })
    setNewFileName('')
  }

  const handleDownload = async (file: FileItem) => {
    if (file.isDirectory) return
    try {
      const response = await fetch(`/api/fs?action=download&path=${encodeURIComponent(`${currentPath}${file.name}`)}`)
      if (!response.ok) throw new Error('Failed to download file')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const handleCompress = async () => {
    try {
      const response = await fetch('/api/fs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'compress',
          path: currentPath,
          items: files.map(file => file.name)
        })
      })
      if (!response.ok) throw new Error('Failed to compress files')
      const { archiveName } = await response.json()
      handleDownload({ name: archiveName, isDirectory: false, size: 0, modifiedAt: new Date().toISOString() })
    } catch (error) {
      console.error('Error compressing files:', error)
    }
  }

  const handleShare = async (file: FileItem) => {
    try {
      const response = await fetch('/api/fs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'share',
          path: currentPath,
          fileName: file.name
        })
      })
      if (!response.ok) throw new Error('Failed to generate share link')
      const { shareLink } = await response.json()
      // You can implement a modal or toast to show the share link
      console.log('Share link:', shareLink)
    } catch (error) {
      console.error('Error generating share link:', error)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">File Operations</h2>
      <div>
        <Input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="New file/folder name"
          className="mb-2"
        />
        <div className="flex space-x-2">
          <Button onClick={handleCreate}>Create File</Button>
          <Button onClick={handleCreateFolder}>Create Folder</Button>
        </div>
      </div>
      <div>
        <Textarea
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
          placeholder="File content (for new files)"
          className="mb-2"
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={handleCompress}>
          <Archive className="mr-2 h-4 w-4" />
          Compress All
        </Button>
      </div>
      {files.map((file) => (
        <div key={file.name} className="flex items-center justify-between">
          <span>{file.name}</span>
          <div className="flex space-x-2">
            <Button onClick={() => handleDownload(file)} disabled={file.isDirectory}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={() => handleShare(file)}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

