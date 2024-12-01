import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  return (
    <div className="flex flex-col space-y-4 md:space-y-6 lg:space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Script Execution Settings</CardTitle>
            <CardDescription>Configure how scripts are executed</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-runtime">Maximum Runtime (minutes)</Label>
                <Input id="max-runtime" type="number" placeholder="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concurrent-jobs">Maximum Concurrent Jobs</Label>
                <Input id="concurrent-jobs" type="number" placeholder="5" />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch id="email-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="slack-notifications">Slack Notifications</Label>
                <Switch id="slack-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="error-notifications">Error Notifications Only</Label>
                <Switch id="error-notifications" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

