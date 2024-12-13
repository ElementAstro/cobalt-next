import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterOptions, PropertyState } from "@/types/indi";

interface AdvancedFilterProps {
  options: FilterOptions;
  onChange: (newOptions: FilterOptions) => void;
  groups: string[];
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  options,
  onChange,
  groups,
}) => {
  const propertyTypes = ["text", "number", "switch", "light", "blob"];
  const propertyStates: PropertyState[] = ["Idle", "Ok", "Busy", "Alert"];

  const handleCheckboxChange = (
    category: keyof FilterOptions,
    item: string
  ) => {
    const newOptions = { ...options };
    const array = newOptions[category] as string[];
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
    onChange(newOptions);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div>
        <Label htmlFor="search" className="dark:text-gray-300">
          搜索
        </Label>
        <Input
          id="search"
          value={options.searchTerm}
          onChange={(e) => onChange({ ...options, searchTerm: e.target.value })}
          placeholder="搜索属性..."
          className="dark:bg-gray-700 dark:text-gray-300"
        />
      </div>
      <div>
        <Label className="dark:text-gray-300">属性类型</Label>
        <div className="grid grid-cols-2 gap-2">
          {propertyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={options.propertyTypes.includes(type)}
                onCheckedChange={() =>
                  handleCheckboxChange("propertyTypes", type)
                }
                className="dark:bg-gray-700 dark:border-gray-600"
              />
              <Label htmlFor={`type-${type}`} className="dark:text-gray-300">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label className="dark:text-gray-300">属性状态</Label>
        <div className="grid grid-cols-2 gap-2">
          {propertyStates.map((state) => (
            <div key={state} className="flex items-center space-x-2">
              <Checkbox
                id={`state-${state}`}
                checked={options.propertyStates.includes(state)}
                onCheckedChange={() =>
                  handleCheckboxChange("propertyStates", state)
                }
                className="dark:bg-gray-700 dark:border-gray-600"
              />
              <Label htmlFor={`state-${state}`} className="dark:text-gray-300">
                {state}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label className="dark:text-gray-300">Groups</Label>
        <div className="grid grid-cols-2 gap-2">
          {groups.map((group) => (
            <div key={group} className="flex items-center space-x-2">
              <Checkbox
                id={`group-${group}`}
                checked={options.groups.includes(group)}
                onCheckedChange={() => handleCheckboxChange("groups", group)}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
              <Label htmlFor={`group-${group}`} className="dark:text-gray-300">
                {group}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
