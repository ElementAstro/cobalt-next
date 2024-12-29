"use client";

import React, { useState } from "react";
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
    const validationError = validateSetting(item, value);
    setError(validationError);

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
    <div>
      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {item.label}
      </Label>
      {renderInput()}
    </div>
  );
};

export default SettingItem;
