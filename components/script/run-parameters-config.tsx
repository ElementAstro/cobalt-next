import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash } from 'lucide-react'

interface Parameter {
  name: string
  value: string
}

interface RunParametersConfigProps {
  parameters: Parameter[]
  onChange: (parameters: Parameter[]) => void
}

export function RunParametersConfig({ parameters, onChange }: RunParametersConfigProps) {
  const [newParam, setNewParam] = useState<Parameter>({ name: '', value: '' })

  const handleAddParameter = () => {
    if (newParam.name && newParam.value) {
      onChange([...parameters, newParam])
      setNewParam({ name: '', value: '' })
    }
  }

  const handleRemoveParameter = (index: number) => {
    const updatedParams = parameters.filter((_, i) => i !== index)
    onChange(updatedParams)
  }

  const handleParameterChange = (index: number, field: 'name' | 'value', value: string) => {
    const updatedParams = parameters.map((param, i) =>
      i === index ? { ...param, [field]: value } : param
    )
    onChange(updatedParams)
  }

  return (
    <div className="space-y-4">
      {parameters.map((param, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={param.name}
            onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
            placeholder="Parameter name"
          />
          <Input
            value={param.value}
            onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
            placeholder="Parameter value"
          />
          <Button variant="outline" size="icon" onClick={() => handleRemoveParameter(index)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Input
          value={newParam.name}
          onChange={(e) => setNewParam({ ...newParam, name: e.target.value })}
          placeholder="New parameter name"
        />
        <Input
          value={newParam.value}
          onChange={(e) => setNewParam({ ...newParam, value: e.target.value })}
          placeholder="New parameter value"
        />
        <Button variant="outline" size="icon" onClick={handleAddParameter}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

