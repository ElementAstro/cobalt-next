import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function EnvironmentManager({ environment, onChange }) {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  const handleAdd = () => {
    if (key && value) {
      onChange({ ...environment, [key]: value })
      setKey('')
      setValue('')
    }
  }

  const handleRemove = (keyToRemove) => {
    const newEnvironment = { ...environment }
    delete newEnvironment[keyToRemove]
    onChange(newEnvironment)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Input
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
        <ul className="space-y-2">
          {Object.entries(environment).map(([k, v]) => (
            <li key={k} className="flex justify-between items-center">
              <span>{k}: {v}</span>
              <Button variant="destructive" size="sm" onClick={() => handleRemove(k)}>Remove</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

