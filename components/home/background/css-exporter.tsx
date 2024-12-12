import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CSSExporterProps {
  style: React.CSSProperties
}

export function CSSExporter({ style }: CSSExporterProps) {
  const [copied, setCopied] = useState(false)

  const generateCSS = () => {
    return Object.entries(style)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
      .join("\n")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCSS())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">导出 CSS</h3>
      <pre className="p-2 bg-gray-100 rounded-md overflow-x-auto">
        <code>{generateCSS()}</code>
      </pre>
      <Button onClick={handleCopy}>
        {copied ? "已复制!" : "复制 CSS"}
      </Button>
    </div>
  )
}

