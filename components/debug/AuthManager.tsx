import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AuthManager({ auth, onChange }) {
  const [type, setType] = useState(auth.type || 'none')
  const [token, setToken] = useState(auth.token || '')
  const [username, setUsername] = useState(auth.username || '')
  const [password, setPassword] = useState(auth.password || '')

  const handleSave = () => {
    onChange({ type, token, username, password })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select auth type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="bearer">Bearer Token</SelectItem>
              <SelectItem value="basic">Basic Auth</SelectItem>
            </SelectContent>
          </Select>
          {type === 'bearer' && (
            <Input
              placeholder="Bearer Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          )}
          {type === 'basic' && (
            <>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
          <Button onClick={handleSave}>Save Authentication</Button>
        </div>
      </CardContent>
    </Card>
  )
}

