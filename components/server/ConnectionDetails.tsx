import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { UseFormReturn } from 'react-hook-form'

interface ConnectionDetailsProps {
  form: UseFormReturn<any>
  isSSL: boolean
  setIsSSL: (value: boolean) => void
}

export function ConnectionDetails({ form, isSSL, setIsSSL }: ConnectionDetailsProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
      <FormField
        control={form.control}
        name="ip"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>IP / Hostname</FormLabel>
            <FormControl>
              <Input placeholder="Write here address" {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Insert IP or Hostname - leave blank for localhost
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="port"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Port</FormLabel>
            <div className="flex items-center gap-2">
              <FormControl>
                <Input type="number" className="w-24" {...field} />
              </FormControl>
              <div className="flex items-center gap-1">
                <Switch
                  id="ssl"
                  checked={isSSL}
                  onCheckedChange={setIsSSL}
                />
                <Label htmlFor="ssl" className="text-sm">
                  SSL
                </Label>
              </div>
            </div>
            <FormMessage />
            <p className="text-sm text-muted-foreground">Port number</p>
          </FormItem>
        )}
      />
    </div>
  )
}