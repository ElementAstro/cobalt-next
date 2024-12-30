"use client";

import React, { useEffect } from "react";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
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
import { Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function X11VNCConfig() {
  const { toast } = useToast();
  const store = useX11VNCStore();
  const xvfbStore = useXvfbStore();
  const form = useForm({
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

  const { control, handleSubmit, watch } = form;
  const watchAllFields = watch();

  useEffect(() => {
    Object.entries(watchAllFields).forEach(([key, value]) => {
      store.setConfig(key, value);
    });
    store.generateCommand();
  }, [watchAllFields, store]);

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
          <CardTitle className="text-xl font-bold">
            x11vnc Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="display"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <FormLabel className="w-full sm:w-1/3">
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
                    <FormField
                      name="port"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^\d+$/,
                          message: "Must be a number",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <FormLabel className="w-full sm:w-1/3">
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
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <Controller
                          name="viewonly"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="viewonly"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mr-2"
                              />
                              <Label htmlFor="viewonly">View Only</Label>
                            </>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <Controller
                          name="shared"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="shared"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mr-2"
                              />
                              <Label htmlFor="shared">Shared</Label>
                            </>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <Controller
                          name="forever"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="forever"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mr-2"
                              />
                              <Label htmlFor="forever">Run Forever</Label>
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="advanced" className="mt-2">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <Label htmlFor="httpPort" className="w-full sm:w-1/3">
                        HTTP Port (optional)
                      </Label>
                      <Controller
                        name="httpPort"
                        control={control}
                        rules={{
                          pattern: {
                            value: /^\d*$/,
                            message: "Must be a number",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="5800"
                            className="w-full"
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <Label htmlFor="logFile" className="w-full sm:w-1/3">
                        Log File
                      </Label>
                      <Controller
                        name="logFile"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="/path/to/logfile"
                            className="w-full"
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <Controller
                          name="clipboard"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="clipboard"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mr-2"
                              />
                              <Label htmlFor="clipboard">
                                Enable Clipboard
                              </Label>
                            </>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <Controller
                          name="noxdamage"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="noxdamage"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mr-2"
                              />
                              <Label htmlFor="noxdamage">No X Damage</Label>
                            </>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <Controller
                          name="repeat"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="repeat"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mr-2"
                              />
                              <Label htmlFor="repeat">Key Repeat</Label>
                            </>
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <Controller
                          name="bg"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Switch
                                id="bg"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mr-2"
                              />
                              <Label htmlFor="bg">Run in Background</Label>
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <Label htmlFor="scale" className="w-full sm:w-1/3">
                        Scale
                      </Label>
                      <Controller
                        name="scale"
                        control={control}
                        render={({ field }) => (
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
                            <span>x</span>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="security" className="mt-2">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <Label htmlFor="passwd" className="w-full sm:w-1/3">
                        Password File
                      </Label>
                      <Controller
                        name="passwd"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="/path/to/passwd"
                            className="w-full"
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <Label htmlFor="rfbauth" className="w-full sm:w-1/3">
                        RFB Auth File
                      </Label>
                      <Controller
                        name="rfbauth"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="/path/to/rfbauth"
                            className="w-full"
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <Label htmlFor="allowedHosts" className="w-full sm:w-1/3">
                        Allowed Hosts
                      </Label>
                      <Controller
                        name="allowedHosts"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="192.168.1.0/24,10.0.0.1"
                            className="w-full"
                          />
                        )}
                      />
                    </div>
                    <div className="flex items-center">
                      <Controller
                        name="ssl"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Switch
                              id="ssl"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mr-2"
                            />
                            <Label htmlFor="ssl">Enable SSL</Label>
                          </>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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

      <div className="lg:w-1/3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
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
