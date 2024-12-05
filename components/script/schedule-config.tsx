import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ScheduleConfigProps {
  schedule: {
    frequency: string
    time: string
  }
  onChange: (schedule: { frequency: string; time: string }) => void
}

export function ScheduleConfig({ schedule, onChange }: ScheduleConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Select
          value={schedule.frequency}
          onValueChange={(value) => onChange({ ...schedule, frequency: value })}
        >
          <SelectTrigger id="frequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={schedule.time}
          onChange={(e) => onChange({ ...schedule, time: e.target.value })}
        />
      </div>
    </div>
  )
}

