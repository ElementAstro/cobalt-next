"use client";

import React from 'react'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

interface LoginFormProps {
  form: UseFormReturn<any>
  showPassword: boolean
  togglePasswordVisibility: () => void
}

export function LoginForm({ form, showPassword, togglePasswordVisibility }: LoginFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <Label className="flex items-center gap-1 text-sm">
              <User className="w-3 h-3" />
              用户名
            </Label>
            <FormControl>
              <Input placeholder="输入用户名" className="h-9" {...field} />
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
            <Label className="flex items-center gap-1 text-sm">
              <Lock className="w-3 h-3" />
              密码
            </Label>
            <div className="relative">
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="输入密码"
                  className="h-9 pr-10"
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}