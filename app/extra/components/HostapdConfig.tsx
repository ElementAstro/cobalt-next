"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  HostapdConfig,
  hostapdConfigSchema,
  CHANNEL_OPTIONS,
} from "@/types/extra/hostapd";
import { saveHostapdConfig } from "@/app/actions/hostapd";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Save, AlertCircle, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HostapdConfigForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive" | "error">(
    "inactive"
  );
  const [availableChannels, setAvailableChannels] = useState<number[]>(
    CHANNEL_OPTIONS["2.4GHz"]
  );

  const form = useForm<HostapdConfig>({
    resolver: zodResolver(hostapdConfigSchema),
    defaultValues: {
      ssid: "",
      wpa_passphrase: "",
      interface: "wlan0",
      driver: "nl80211",
      hw_mode: "g",
      channel: 6,
      wpa: 2,
      wpa_key_mgmt: "WPA-PSK",
      wpa_pairwise: "TKIP",
      rsn_pairwise: "CCMP",
      auth_algs: 1,
      country_code: "US",
      ieee80211n: 1,
      ieee80211ac: 1,
      wmm_enabled: 1,
      macaddr_acl: 0,
      ignore_broadcast_ssid: 0,
    },
  });

  const watchHwMode = form.watch("hw_mode");

  useEffect(() => {
    if (watchHwMode === "a") {
      setAvailableChannels(CHANNEL_OPTIONS["5GHz"]);
      form.setValue("channel", 36);
    } else {
      setAvailableChannels(CHANNEL_OPTIONS["2.4GHz"]);
      form.setValue("channel", 6);
    }
  }, [watchHwMode, form]);

  const handleToggleAP = async () => {
    setIsLoading(true);
    try {
      const newStatus = status === "active" ? "inactive" : "active";
      setStatus(newStatus);
      toast({
        title: `WiFi Access Point ${
          newStatus === "active" ? "Started" : "Stopped"
        }`,
        description: `The access point has been ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully.`,
      });
    } catch (error) {
      setStatus("error");
      toast({
        title: "Error",
        description: "Failed to toggle the access point status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(values: HostapdConfig) {
    setIsLoading(true);
    try {
      await saveHostapdConfig(values);
      toast({
        title: "Configuration saved",
        description: "The hostapd configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the hostapd configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="w-6 h-6" />
          Hostapd Configuration
        </CardTitle>
        <CardDescription>
          Configure your WiFi access point settings
        </CardDescription>
        <div className="flex items-center justify-between">
          <Button
            variant={status === "active" ? "destructive" : "default"}
            onClick={handleToggleAP}
            disabled={isLoading}
          >
            {status === "active" ? (
              <WifiOff className="mr-2" />
            ) : (
              <Wifi className="mr-2" />
            )}
            {status === "active" ? "Stop Access Point" : "Start Access Point"}
          </Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-mode"
              checked={isAdvancedMode}
              onCheckedChange={setIsAdvancedMode}
            />
            <Label htmlFor="advanced-mode">Advanced Mode</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Form {...form}>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ssid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Network Name (SSID)</FormLabel>
                        <FormControl>
                          <Input placeholder="MyWiFi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country Code</FormLabel>
                        <FormControl>
                          <Input placeholder="US" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {isAdvancedMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="hw_mode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency Band</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select band" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="a">
                                  5 GHz (802.11a/n/ac)
                                </SelectItem>
                                <SelectItem value="g">
                                  2.4 GHz (802.11b/g/n)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="channel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Channel</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select channel" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableChannels.map((channel) => (
                                  <SelectItem
                                    key={channel}
                                    value={channel.toString()}
                                  >
                                    Channel {channel}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}
              </motion.form>
            </Form>
          </TabsContent>

          <TabsContent value="security">
            <Form {...form}>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="wpa_passphrase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isAdvancedMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ignore_broadcast_ssid"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Hide Network
                                </FormLabel>
                                <FormDescription>
                                  Don't broadcast SSID
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value === 1}
                                  onCheckedChange={(checked) =>
                                    field.onChange(checked ? 1 : 0)
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="wmm_enabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  WMM (QoS)
                                </FormLabel>
                                <FormDescription>
                                  Enable WiFi Multimedia
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value === 1}
                                  onCheckedChange={(checked) =>
                                    field.onChange(checked ? 1 : 0)
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.form>
            </Form>
          </TabsContent>
        </Tabs>

        {status === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was a problem with the access point configuration.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
