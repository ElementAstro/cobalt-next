"use client";

import React, { useEffect } from "react";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useX11VNCStore } from "@/store/useExtraStore";
import { useXvfbStore } from "@/store/useExtraStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Terminal,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Network,
  Settings,
  Monitor,
  HardDrive,
  Key,
  Scale,
  Clipboard,
  FileText,
  Server,
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Zod schema for validation
const formSchema = z.object({
  display: z.string().min(1, "Display is required"),
  port: z.string().regex(/^\d+$/, "Must be a valid port number"),
  viewonly: z.boolean(),
  shared: z.boolean(),
  forever: z.boolean(),
  ssl: z.boolean(),
  httpPort: z.string().regex(/^\d*$/, "Must be a valid port number").optional(),
  passwd: z.string().optional(),
  allowedHosts: z.string().optional(),
  logFile: z.string().optional(),
  clipboard: z.boolean(),
  noxdamage: z.boolean(),
  scale: z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid scale factor"),
  repeat: z.boolean(),
  bg: z.boolean(),
  rfbauth: z.string().optional(),
});

export default function X11VNCConfig() {
  const { toast } = useToast();
  const store = useX11VNCStore();
  const xvfbStore = useXvfbStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      display: store.display,
      port: store.port,
      viewonly: store.viewonly,
      shared: store.shared,
      forever: store.forever,
      ssl: store.ssl,
      httpPort: store.httpPort,
      passwd: store.passwd,
      allowedHosts: store.allowedHosts,
      logFile: store.logFile,
      clipboard: store.clipboard,
      noxdamage: store.noxdamage,
      scale: store.scale,
      repeat: store.repeat,
      bg: store.bg,
      rfbauth: store.rfbauth,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = form;
  const watchAllFields = watch();

  useEffect(() => {
    if (isDirty) {
      Object.entries(watchAllFields).forEach(([key, value]) => {
        store.setConfig(key, value);
      });
      store.generateCommand();
    }
  }, [watchAllFields, store, isDirty]);

  const onSubmit = () => {
    store.generateCommand();
    toast({
      title: "Configuration Generated",
      description: "Your x11vnc command has been generated successfully.",
    });
  };

  const formAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getAvailableDisplays = () => {
    if (xvfbStore.instances?.length > 0) {
      return xvfbStore.instances.map((instance) => ({
        value: instance.display,
        label: `Xvfb ${instance.display}`,
      }));
    }
    return [];
  };

  return (
    <motion.div className="max-w-[100vw] overflow-x-auto p-2 lg:flex lg:flex-row lg:gap-4">
      <Card className="lg:w-2/3 mb-4 lg:mb-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            x11vnc Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <TabsTrigger
                    value="basic"
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Basic Settings
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="flex items-center gap-2"
                  >
                    <HardDrive className="w-4 h-4" />
                    Advanced
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Security
                  </TabsTrigger>
                </TabsList>

                {/* Basic Settings Tab */}
                <TabsContent value="basic" className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Display Select */}
                    <FormField
                      name="display"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <FormLabel className="w-full sm:w-1/3 flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            Display
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select display" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableDisplays().map(
                                  ({ value, label }) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* VNC Port Input */}
                    <FormField
                      name="port"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <FormLabel className="w-full sm:w-1/3 flex items-center gap-2">
                            <Network className="w-4 h-4" />
                            VNC Port
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="5900"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Toggle Switches */}
                    <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="viewonly"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="viewonly"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label
                                htmlFor="viewonly"
                                className="flex items-center gap-2"
                              >
                                {field.value ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                                View Only
                              </Label>
                            </>
                          )}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          name="shared"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="shared"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label
                                htmlFor="shared"
                                className="flex items-center gap-2"
                              >
                                <Server className="w-4 h-4" />
                                Shared
                              </Label>
                            </>
                          )}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          name="forever"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="forever"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label
                                htmlFor="forever"
                                className="flex items-center gap-2"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Run Forever
                              </Label>
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Advanced Settings Tab */}
                <TabsContent value="advanced" className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* HTTP Port */}
                    <FormField
                      name="httpPort"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <FormLabel className="w-full sm:w-1/3 flex items-center gap-2">
                            <Network className="w-4 h-4" />
                            HTTP Port
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="5800"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Log File */}
                    <FormField
                      name="logFile"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <FormLabel className="w-full sm:w-1/3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Log File
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="/path/to/logfile"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Advanced Toggles */}
                    <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="clipboard"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="clipboard"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label
                                htmlFor="clipboard"
                                className="flex items-center gap-2"
                              >
                                <Clipboard className="w-4 h-4" />
                                Clipboard
                              </Label>
                            </>
                          )}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          name="noxdamage"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="noxdamage"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label
                                htmlFor="noxdamage"
                                className="flex items-center gap-2"
                              >
                                <Activity className="w-4 h-4" />
                                No X Damage
                              </Label>
                            </>
                          )}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          name="repeat"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="repeat"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label
                                htmlFor="repeat"
                                className="flex items-center gap-2"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Key Repeat
                              </Label>
                            </>
                          )}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          name="bg"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="bg"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label
                                htmlFor="bg"
                                className="flex items-center gap-2"
                              >
                                <Server className="w-4 h-4" />
                                Background
                              </Label>
                            </>
                          )}
                        />
                      </div>
                    </div>

                    {/* Scale Slider */}
                    <div className="col-span-full">
                      <FormField
                        name="scale"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                            <FormLabel className="w-full sm:w-1/3 flex items-center gap-2">
                              <Scale className="w-4 h-4" />
                              Scale
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center w-full">
                                <Slider
                                  id="scale"
                                  min={0.1}
                                  max={2}
                                  step={0.1}
                                  value={[parseFloat(field.value)]}
                                  onValueChange={(value) =>
                                    field.onChange(value[0].toString())
                                  }
                                  className="flex-1 mr-2"
                                />
                                <span className="text-sm">x{field.value}</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Security Settings Tab */}
                <TabsContent value="security" className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password File */}
                    <FormField
                      name="passwd"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <FormLabel className="w-full sm:w-1/3 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Password File
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="/path/to/passwd"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* RFB Auth File */}
                    <FormField
                      name="rfbauth"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <FormLabel className="w-full sm:w-1/3 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            RFB Auth File
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="/path/to/rfbauth"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Allowed Hosts */}
                    <FormField
                      name="allowedHosts"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <FormLabel className="w-full sm:w-1/3 flex items-center gap-2">
                            <Wifi className="w-4 h-4" />
                            Allowed Hosts
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="192.168.1.0/24,10.0.0.1"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* SSL Switch */}
                    <div className="col-span-full">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="ssl"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="ssl"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label
                                htmlFor="ssl"
                                className="flex items-center gap-2"
                              >
                                <Shield className="w-4 h-4" />
                                Enable SSL
                              </Label>
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Generated Command */}
              <AnimatePresence>
                {store.command && (
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="command" className="block mb-1">
                      Generated Command:
                    </Label>
                    <div className="relative">
                      <Input
                        id="command"
                        value={store.command}
                        readOnly
                        className="font-mono bg-gray-100 dark:bg-gray-800"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center"
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  Generate Command
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Connection Status Card */}
      <div className="lg:w-1/3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Active Connections:</span>
                <Badge>3</Badge>
              </div>
              <Progress value={75} className="mb-2" />
              <p className="text-sm">Network Usage: 75%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
