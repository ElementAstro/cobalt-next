import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploaderProps {
  onUpload: (imageUrl: string) => void
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState('')

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImageUrl(result)
        onUpload(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">上传背景图片:</Label>
      <Input id="image-upload" type="file" accept="image/*" onChange={handleUpload} />
      {imageUrl && (
        <div className="mt-2">
          <img src={imageUrl} alt="Uploaded background" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  )
}

