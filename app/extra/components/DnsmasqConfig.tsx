"use client";

import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useDnsmasqStore, DnsmasqConfig } from "@/lib/store/extra/dnsmasq";
import { Variants } from "framer-motion";

export const fadeInOut: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUpDown: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

export const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const formFields = [
  { name: "listenAddress", label: "Listen Address", type: "text" },
  { name: "port", label: "Port", type: "text" },
  { name: "dnsServers", label: "DNS Servers", type: "text" },
  { name: "cacheSize", label: "Cache Size", type: "text" },
  { name: "domainNeeded", label: "Domain Needed", type: "checkbox" },
  { name: "bogusPriv", label: "Bogus Priv", type: "checkbox" },
  { name: "expandHosts", label: "Expand Hosts", type: "checkbox" },
  { name: "noCacheNegative", label: "No Cache Negative", type: "checkbox" },
  { name: "strictOrder", label: "Strict Order", type: "checkbox" },
  { name: "noHosts", label: "No Hosts", type: "checkbox" },
];

export function DnsmasqConfigPanel() {
  const { config, isAdvancedOpen, updateConfig, toggleAdvanced, saveConfig } =
    useDnsmasqStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DnsmasqConfig>({
    defaultValues: config,
  });

  const onSubmit = async (data: DnsmasqConfig) => {
    updateConfig(data);
    await saveConfig();
    toast({
      title: "Configuration Saved",
      description: "Your dnsmasq configuration has been updated.",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dnsmasq Config</CardTitle>
        <CardDescription>Configure your dnsmasq settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 gap-4"
          >
            {formFields.slice(0, 4).map((field) => (
              <motion.div
                key={field.name}
                variants={fadeInOut}
                className="space-y-2"
              >
                <Label htmlFor={field.name}>{field.label}</Label>
                <Controller
                  name={field.name as keyof DnsmasqConfig}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, ...fieldProps } }) => (
                    <Input
                      {...fieldProps}
                      id={field.name}
                      value={String(value)}
                      className={cn(
                        errors[field.name as keyof DnsmasqConfig] &&
                          "border-red-500"
                      )}
                    />
                  )}
                />
                {errors[field.name as keyof DnsmasqConfig] && (
                  <p className="text-red-500 text-xs">This field is required</p>
                )}
              </motion.div>
            ))}
          </motion.div>
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={toggleAdvanced}
              className="w-full justify-between"
            >
              Advanced Options
              <motion.span
                animate={{ rotate: isAdvancedOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </Button>
          </div>
          <AnimatePresence>
            {isAdvancedOpen && (
              <motion.div
                variants={slideUpDown}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                {formFields.slice(4).map((field) => (
                  <motion.div
                    key={field.name}
                    variants={fadeInOut}
                    className="flex items-center space-x-2"
                  >
                    <Controller
                      name={field.name as keyof DnsmasqConfig}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          id={field.name}
                          checked={value as boolean}
                          onCheckedChange={onChange}
                        />
                      )}
                    />
                    <Label htmlFor={field.name}>{field.label}</Label>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <Button type="submit" className="w-full">
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
