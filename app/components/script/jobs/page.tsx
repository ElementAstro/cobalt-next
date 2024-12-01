import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const jobs = [
  { id: 1, name: 'Backup Database', startTime: '2023-06-15 10:30', status: 'Running' },
  { id: 2, name: 'Update User Permissions', startTime: '2023-06-14 15:45', status: 'Completed' },
  { id: 3, name: 'Generate Monthly Report', startTime: '2023-06-15 00:00', status: 'Failed' },
]

export default function JobsPage() {
  return (
    <div className="flex flex-col space-y-4 md:space-y-6 lg:space-y-8">
      <h1 className="text-3xl font-bold">Jobs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Name</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.name}</TableCell>
                  <TableCell>{job.startTime}</TableCell>
                  <TableCell>
                    <Badge
                      variant={job.status === 'Running' ? 'default' : job.status === 'Completed' ? 'success' : 'destructive'}
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

