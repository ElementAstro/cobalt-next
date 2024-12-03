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
    <>
      <FormField
        control={form.control}
        name="ip"
        render={({ field }) => (
          <FormItem>
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
          <FormItem>
            <FormLabel>Port</FormLabel>
            <div className="flex items-center gap-4">
              <FormControl>
                <Input type="number" className="max-w-[200px]" {...field} />
              </FormControl>
              <div className="flex items-center gap-2">
                <Switch
                  id="ssl"
                  checked={isSSL}
                  onCheckedChange={setIsSSL}
                />
                <Label htmlFor="ssl">SSL</Label>
              </div>
            </div>
            <FormMessage />
            <p className="text-sm text-muted-foreground">Port number</p>
          </FormItem>
        )}
      />
    </>
  )
}

