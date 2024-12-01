import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AdvancedFilters() {
  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <Label>Date</Label>
        <Calendar mode="single" className="rounded-md border" />
      </div>

      <div className="space-y-2">
        <Label>Altitude</Label>
        <Select defaultValue="any">
          <SelectTrigger>
            <SelectValue placeholder="Select altitude" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="above30">Above 30°</SelectItem>
            <SelectItem value="above60">Above 60°</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Moon Phase</Label>
        <Select defaultValue="any">
          <SelectTrigger>
            <SelectValue placeholder="Select moon phase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="new">New Moon</SelectItem>
            <SelectItem value="quarter">Quarter Moon</SelectItem>
            <SelectItem value="full">Full Moon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Constellation</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select constellation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uma">UMA</SelectItem>
            <SelectItem value="ori">ORI</SelectItem>
            <SelectItem value="cyg">CYG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Object Type</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opncl">OPNCL</SelectItem>
            <SelectItem value="drknb">DRKNB</SelectItem>
            <SelectItem value="brtnb">BRTNB</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

