import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export default function ResponseDisplay({ response, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No response yet. Send a request to see the result.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Status:</h3>
            <p>{response.status} {response.statusText}</p>
          </div>
          <div>
            <h3 className="font-semibold">Headers:</h3>
            <SyntaxHighlighter language="json" style={docco}>
              {JSON.stringify(response.headers, null, 2)}
            </SyntaxHighlighter>
          </div>
          <div>
            <h3 className="font-semibold">Body:</h3>
            <SyntaxHighlighter language="json" style={docco}>
              {JSON.stringify(response.data, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

