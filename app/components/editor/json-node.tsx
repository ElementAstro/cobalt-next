import { useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { ChevronDown, ChevronRight, Trash2, Plus, GripVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface JsonNodeProps {
  data: any
  path: string[]
  onchange: (path: string[], value: any) => void
  ondelete: (path: string[]) => void
  onAddChild: (path: string[]) => void
  index?: number
}

export default function JsonNode({ data, path, onchange, ondelete, onAddChild, index }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleToggle = () => setIsExpanded(!isExpanded)

  const renderValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <Droppable droppableId={path.join(',')}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="pl-4">
              {Object.entries(value).map(([key, val], idx) => (
                <JsonNode
                  key={key}
                  data={val}
                  path={[...path, key]}
                  onchange={onchange}
                  ondelete={ondelete}
                  onAddChild={onAddChild}
                  index={idx}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )
    } else {
      return (
        <Input
          value={value}
          onChange={(e) => onchange(path, e.target.value)}
          className="ml-2 w-full md:w-auto"
        />
      )
    }
  }

  const nodeContent = (
    <div className="flex items-center space-x-2">
      {typeof data === 'object' && data !== null && (
        <Button variant="ghost" size="sm" onClick={handleToggle}>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      )}
      <span className="font-medium">{path[path.length - 1] || 'root'}:</span>
      {typeof data !== 'object' && renderValue(data)}
      <Badge variant="outline">{typeof data}</Badge>
      <Button variant="ghost" size="sm" onClick={() => ondelete(path)}>
        <Trash2 className="h-4 w-4" />
      </Button>
      {typeof data === 'object' && data !== null && (
        <Button variant="ghost" size="sm" onClick={() => onAddChild(path)}>
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  )

  if (index !== undefined) {
    return (
      <Draggable draggableId={path.join(',')} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="my-2 border border-gray-200 rounded p-2"
          >
            <div className="flex items-center">
              <div {...provided.dragHandleProps} className="mr-2">
                <GripVertical className="h-4 w-4" />
              </div>
              {nodeContent}
            </div>
            {isExpanded && typeof data === 'object' && data !== null && renderValue(data)}
          </div>
        )}
      </Draggable>
    )
  }

  return (
    <div className="my-2 border border-gray-200 rounded p-2">
      {nodeContent}
      {isExpanded && typeof data === 'object' && data !== null && renderValue(data)}
    </div>
  )
}

