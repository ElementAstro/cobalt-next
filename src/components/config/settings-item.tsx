"use client";

import React, { useState, useEffect } from "react";
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
import { Setting, SettingValue } from "@/types/config";
import { useSettingsStore } from "@/store/useConfigStore";

interface SettingItemProps {
  item: Setting;
  path: string[];
}

const SettingItem: React.FC<SettingItemProps> = ({ item, path }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { updateSetting, isLoading } = useSettingsStore();
  const [error, setError] = useState<string | null>(null);

  const validateSetting = (
    setting: Setting,
    value: SettingValue
  ): string | null => {
    if (!setting.validation) return null;

    for (const rule of setting.validation) {
      switch (rule.type) {
        case "required":
          if (!value) return rule.message;
          break;
        case "minLength":
          if (
            typeof value === "string" &&
            value.length < (rule.value as number)
          )
            return rule.message;
          break;
        case "maxLength":
          if (
            typeof value === "string" &&
            value.length > (rule.value as number)
          )
            return rule.message;
          break;
        case "pattern":
          if (
            typeof value === "string" &&
            !new RegExp(rule.value as string).test(value)
          )
            return rule.message;
          break;
        case "min":
          if (typeof value === "number" && value < (rule.value as number))
            return rule.message;
          break;
        case "max":
          if (typeof value === "number" && value > (rule.value as number))
            return rule.message;
          break;
        default:
          return null;
      }
    }

    return null;
  };

  const handleChange = async (value: SettingValue) => {
    setIsValidating(true);
    const validationError = validateSetting(item, value);

    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate validation delay

    setError(validationError);
    setIsValidating(false);

    if (!validationError) {
      await updateSetting(path, value);
    }
  };

  const renderInput = () => {
    switch (item.type) {
      case "text":
        return (
          <>
            <Input
              type="text"
              value={item.value as string}
              onChange={(e) => handleChange(e.target.value)}
              className={error ? "border-red-500" : ""}
              disabled={isLoading}
              aria-label={item.label}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </>
        );
      case "number":
        return (
          <>
            <Input
              type="number"
              value={item.value as number}
              onChange={(e) => handleChange(Number(e.target.value))}
              className={error ? "border-red-500" : ""}
              disabled={isLoading}
              aria-label={item.label}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </>
        );
      case "checkbox":
        return (
          <Checkbox
            checked={item.value as boolean}
            onCheckedChange={(checked) => handleChange(checked)}
            disabled={isLoading}
            aria-label={item.label}
          />
        );
      case "select":
        return (
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
        );
      case "color":
        return (
          <ColorPicker
            color={item.value as string}
            onChange={(color) => handleChange(color)}
            disabled={isLoading}
            ariaLabel={item.label}
          />
        );
      case "range":
        return (
          <RangeSlider
            min={item.min}
            max={item.max}
            step={item.step}
            value={[item.value as number]}
            onValueChange={([value]) => handleChange(value)}
            disabled={isLoading}
            aria-label={item.label}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="space-y-2"
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
          <Icons.HelpCircle className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <motion.div
        className="relative"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {renderInput()}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="text-red-500 text-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {isValidating && (
        <motion.div
          className="absolute right-2 top-2"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Icons.Loader2 className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default SettingItem;
