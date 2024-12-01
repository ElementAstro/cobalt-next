import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FilterPanelProps {
  filters: {
    constellations: string[]
    types: string[]
    minMagnitude: number
    maxMagnitude: number
    minDistance: number
    maxDistance: number
  }
  onFilterChange: (filters: FilterPanelProps['filters']) => void
}

const CONSTELLATIONS = ["UMA", "CYG", "PYX", "ORI", "CAS", "LEO", "AQR", "SCO", "TAU", "VIR"]
const OBJECT_TYPES = ["OPNCL", "DRKNB", "BRTNB", "GALXY", "PLNTN", "STAR", "ASTER", "COMET", "NOVA"]

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleCheckboxChange = (key: 'constellations' | 'types', value: string) => {
    const currentValues = filters[key]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    onFilterChange({ ...filters, [key]: newValues })
  }

  const handleSliderChange = (key: 'minMagnitude' | 'maxMagnitude' | 'minDistance' | 'maxDistance', value: number[]) => {
    onFilterChange({ ...filters, [key]: value[0] })
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-6 p-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="constellations">
            <AccordionTrigger>Constellations</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {CONSTELLATIONS.map(constellation => (
                  <div key={constellation} className="flex items-center space-x-2">
                    <Checkbox
                      id={`constellation-${constellation}`}
                      checked={filters.constellations.includes(constellation)}
                      onCheckedChange={() => handleCheckboxChange('constellations', constellation)}
                    />
                    <Label htmlFor={`constellation-${constellation}`}>{constellation}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="types">
            <AccordionTrigger>Object Types</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {OBJECT_TYPES.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.types.includes(type)}
                      onCheckedChange={() => handleCheckboxChange('types', type)}
                    />
                    <Label htmlFor={`type-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="magnitude">
            <AccordionTrigger>Magnitude</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label>Minimum Magnitude: {filters.minMagnitude}</Label>
                  <Slider
                    min={-30}
                    max={30}
                    step={0.1}
                    value={[filters.minMagnitude]}
                    onValueChange={(value) => handleSliderChange('minMagnitude', value)}
                  />
                </div>
                <div>
                  <Label>Maximum Magnitude: {filters.maxMagnitude}</Label>
                  <Slider
                    min={-30}
                    max={30}
                    step={0.1}
                    value={[filters.maxMagnitude]}
                    onValueChange={(value) => handleSliderChange('maxMagnitude', value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="distance">
            <AccordionTrigger>Distance (Light Years)</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label>Minimum Distance: {filters.minDistance} ly</Label>
                  <Slider
                    min={0}
                    max={1000000}
                    step={100}
                    value={[filters.minDistance]}
                    onValueChange={(value) => handleSliderChange('minDistance', value)}
                  />
                </div>
                <div>
                  <Label>Maximum Distance: {filters.maxDistance} ly</Label>
                  <Slider
                    min={0}
                    max={1000000}
                    step={100}
                    value={[filters.maxDistance]}
                    onValueChange={(value) => handleSliderChange('maxDistance', value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button onClick={() => onFilterChange({
          constellations: [],
          types: [],
          minMagnitude: -30,
          maxMagnitude: 30,
          minDistance: 0,
          maxDistance: 1000000
        })}>
          Reset Filters
        </Button>
      </div>
    </ScrollArea>
  )
}

