import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HistoryPanel({ history, onSelect }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request History</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {history.map((item, index) => (
            <li key={index}>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onSelect(item.config)}
              >
                {item.config.method} {item.config.url}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

