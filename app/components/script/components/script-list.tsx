import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Script } from '@/types/script'

interface ScriptListProps {
  scripts: Script[]
}

export function ScriptList({ scripts }: ScriptListProps) {
  return (
    <div className="space-y-8">
      {scripts.map((script) => (
        <div key={script.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/${script.id}.png`} alt="Avatar" />
            <AvatarFallback>{script.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{script.name}</p>
            <p className="text-sm text-muted-foreground">
              {script.lastRun}
            </p>
          </div>
          <div className={`ml-auto font-medium ${script.status === 'Success' ? 'text-green-500' : 'text-red-500'}`}>
            {script.status}
          </div>
        </div>
      ))}
    </div>
  )
}

