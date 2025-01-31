"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { Server, Shield } from "lucide-react";

interface ConnectionDetailsProps {
  form: UseFormReturn<any>;
  isSSL: boolean;
  setIsSSL: (value: boolean) => void;
}

export function ConnectionDetails({
  form,
  isSSL,
  setIsSSL,
}: ConnectionDetailsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name="ip"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1 text-sm">
              <Server className="w-3 h-3" />
              IP / Hostname
            </FormLabel>
            <FormControl>
              <Input placeholder="服务器地址" {...field} className="h-9" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="port"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1 text-sm">
              <Server className="w-3 h-3" />
              端口
            </FormLabel>
            <div className="flex items-center gap-2">
              <FormControl>
                <Input
                  type="number"
                  className="w-24 h-9"
                  {...field}
                  placeholder="端口"
                />
              </FormControl>
              <div className="flex items-center gap-1">
                <Checkbox
                  id="ssl"
                  checked={isSSL}
                  onCheckedChange={setIsSSL}
                  className="h-4 w-4"
                />
                <Label htmlFor="ssl" className="text-sm">SSL</Label>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
