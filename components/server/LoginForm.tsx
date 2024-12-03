import React from 'react'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

interface LoginFormProps {
  form: UseFormReturn<any>
  showPassword: boolean
  togglePasswordVisibility: () => void
}

export function LoginForm({ form, showPassword, togglePasswordVisibility }: LoginFormProps) {
  return (
    <div className="space-y-2">
      <Label>Login data</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Insert Username and Password as set in Voyager before connection
      </p>
    </div>
  )
}

