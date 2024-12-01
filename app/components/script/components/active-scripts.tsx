import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Pause, Square } from 'lucide-react'
import { Job } from '@/types/script'

interface ActiveScriptsProps {
  jobs: Job[]
}

export function ActiveScripts({ jobs }: ActiveScriptsProps) {
  return (
    <div className="space-y-8">
      {jobs.map((job) => (
        <div key={job.id} className="flex items-center">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">
              Script ID: {job.scriptId}
            </p>
            <p className="text-sm text-muted-foreground">
              {job.progress}% complete
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Pause className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Square className="h-4 w-4" />
            </Button>
          </div>
          <div className="ml-4 w-[100px]">
            <Progress value={job.progress} className="w-[80px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

