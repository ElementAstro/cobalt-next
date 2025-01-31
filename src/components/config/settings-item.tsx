"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "./color-picker";
import { Slider as RangeSlider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Setting, SettingValue } from "@/types/config";
import { useSettingsStore } from "@/store/useConfigStore";

// Helper function to get setting by path
const getSettingByPath = (
  settings: Record<string, any>,
  path: string[]
): Setting | null => {
  let current: Record<string, Setting> | Setting = settings;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (!current || typeof current !== "object") return null;

    if (i === path.length - 1) {
      // Last item in path should be a Setting
      return (current as Record<string, Setting>)[key] || null;
    } else {
      // Interior items should be Record<string, Setting>
      current = (current as Record<string, Setting>)[key];
    }
  }

  return null;
};

// Helper function for restart confirmation
const showRestartConfirmation = async (): Promise<boolean> => {
  return window.confirm(
    "This setting requires a restart. Do you want to continue?"
  );
};

interface SettingItemProps {
  item: Setting;
  path: string[];
  className?: string;
  style?: React.CSSProperties;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  item,
  path,
  className,
  style,
  onError,
  onSuccess,
}) => {
  const previousValue = useRef<SettingValue>(item.value);
  const [isValidating, setIsValidating] = useState(false);
  const { updateSetting, isLoading, debouncedUpdate, settings } =
    useSettingsStore();
  const [error, setError] = useState<string | null>(null);

  // Check dependencies
  useEffect(() => {
    if (item.dependsOn && settings) {
      const parentSetting = getSettingByPath(
        settings,
        item.dependsOn.setting.split(".")
      );
      if (parentSetting?.value !== item.dependsOn.value) {
        setError("Dependency condition not met");
      }
    }
  }, [item.dependsOn, settings]);

  const validateSetting = (
    setting: Setting,
    value: SettingValue
  ): string | null => {
    if (!setting.validation) return null;

    for (const rule of setting.validation) {
      switch (rule.type) {
        case "required":
          if (!value) return rule.message || "This field is required";
          break;
        case "minLength":
          if (
            typeof value === "string" &&
            value.length < (rule.value as number)
          )
            return rule.message || `Minimum length is ${rule.value}`;
          break;
        case "maxLength":
          if (
            typeof value === "string" &&
            value.length > (rule.value as number)
          )
            return rule.message || `Maximum length is ${rule.value}`;
          break;
        case "pattern":
          if (
            typeof value === "string" &&
            !new RegExp(rule.value as string).test(value)
          )
            return rule.message || "Invalid format";
          break;
        case "min":
          if (typeof value === "number" && value < (rule.value as number))
            return rule.message || `Minimum value is ${rule.value}`;
          break;
        case "max":
          if (typeof value === "number" && value > (rule.value as number))
            return rule.message || `Maximum value is ${rule.value}`;
          break;
        default:
          return null;
      }
    }
    return null;
  };

  const handleChange = useCallback(
    async (value: SettingValue) => {
      setIsValidating(true);
      setError(null);

      try {
        const validationError = validateSetting(item, value);
        if (validationError) {
          setError(validationError);
          onError?.(validationError);
          return;
        }

        if (item.requiresRestart) {
          const confirmed = await showRestartConfirmation();
          if (!confirmed) return;
        }

        await debouncedUpdate(path, value);
        previousValue.current = value;
        onSuccess?.();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsValidating(false);
      }
    },
    [item, path, debouncedUpdate, onError, onSuccess]
  );

  const renderInput = () => {
    switch (item.type) {
      case "text":
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              type="text"
              value={item.value as string}
              onChange={(e) => handleChange(e.target.value)}
              className={error ? "border-red-500" : ""}
              disabled={isLoading}
              aria-label={item.label}
            />
          </motion.div>
        );
      case "number":
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              type="number"
              value={item.value as number}
              onChange={(e) => handleChange(Number(e.target.value))}
              className={error ? "border-red-500" : ""}
              disabled={isLoading}
              aria-label={item.label}
            />
          </motion.div>
        );
      case "checkbox":
        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Checkbox
              checked={item.value as boolean}
              onCheckedChange={(checked) => handleChange(checked)}
              disabled={isLoading}
              aria-label={item.label}
            />
          </motion.div>
        );
      case "select":
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Select
              value={item.value as string}
              onValueChange={(value) => handleChange(value)}
              disabled={isLoading}
              aria-label={item.label}
            >
              <SelectTrigger>
                <SelectValue placeholder={item.label} />
              </SelectTrigger>
              <SelectContent>
                {item.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        );
      case "color":
        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ColorPicker
              color={item.value as string}
              onChange={(color) => handleChange(color)}
              disabled={isLoading}
              ariaLabel={item.label}
            />
          </motion.div>
        );
      case "range":
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <RangeSlider
              min={item.min}
              max={item.max}
              step={item.step}
              value={[item.value as number]}
              onValueChange={([value]) => handleChange(value)}
              disabled={isLoading}
              aria-label={item.label}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`space-y-2 ${className}`}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {item.label}
        </Label>
        {item.description && (
          <Tooltip>
            <TooltipTrigger>
              <Icons.HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.description}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <motion.div
        className="relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {renderInput()}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-2 text-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Icons.AlertTriangle className="h-4 w-4 text-astro-red-500" />
            <span className="text-astro-red-500">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isValidating && (
        <motion.div
          className="absolute right-2 top-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          exit={{ opacity: 0 }}
          transition={{
            rotate: { repeat: Infinity, duration: 1, ease: "linear" },
            opacity: { duration: 0.2 },
          }}
        >
          <Icons.Satellite className="h-4 w-4 text-astro-purple-500" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default SettingItem;
