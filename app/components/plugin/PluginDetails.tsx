import { useState } from 'react'
import Image from 'next/image'
import { Star, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plugin } from '@/types/plugin'

interface PluginDetailsProps {
  plugin: Plugin
  onInstallComplete: (id: number) => void
  onUninstall: (id: number) => void
}

export function PluginDetails({ plugin, onInstallComplete, onUninstall }: PluginDetailsProps) {
  const [isInstalling, setIsInstalling] = useState(false)
  const [installProgress, setInstallProgress] = useState(0)

  if (!plugin) {
    return <div>Plugin not found</div>;
  }

  const handleInstall = () => {
    setIsInstalling(true)
    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsInstalling(false)
          onInstallComplete(plugin.id)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleUninstall = () => {
    onUninstall(plugin.id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={plugin.image}
            alt={plugin.name}
            width={600}
            height={400}
            className="rounded-lg object-cover w-full"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{plugin.name}</h1>
          <p className="text-lg mb-4">{plugin.description}</p>
          <div className="flex items-center mb-4">
            <Star className="text-yellow-400 mr-1" />
            <span>{plugin.rating.toFixed(1)}</span>
            <span className="mx-2">|</span>
            <Download className="mr-1" />
            <span>{plugin.downloads.toLocaleString()} downloads</span>
          </div>
          <p className="mb-4">
            <strong>Version:</strong> {plugin.version} | <strong>Updated:</strong> {plugin.lastUpdated}
          </p>
          <p className="mb-4">
            <strong>Developer:</strong> {plugin.developer}
          </p>
          <p className="mb-4">
            <strong>Category:</strong> {plugin.category} / {plugin.subcategory}
          </p>
          <div className="mb-4">
            <strong>Tags:</strong>
            {plugin.tags.map((tag) => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-2xl font-bold mb-4">{plugin.price}</p>
          {plugin.reviews && plugin.reviews.length > 0 ? (
            // 现有的评论渲染逻辑  This section is missing from the original code and needs to be added based on the application's requirements.  Placeholder below.
            <div>Reviews Placeholder</div>
          ) : (
            <p>No reviews yet.</p>
          )}
          {plugin.installed ? (
            <Button onClick={handleUninstall} className="w-full" variant="destructive">
              Uninstall
            </Button>
          ) : isInstalling ? (
            <div className="w-full">
              <Progress value={installProgress} className="w-full mb-2" />
              <p>Installing... {installProgress}%</p>
            </div>
          ) : (
            <Button onClick={handleInstall} className="w-full">
              Install
            </Button>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p>{plugin.longDescription}</p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">System Requirements</h2>
        <ul className="list-disc pl-5">
          {plugin.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

