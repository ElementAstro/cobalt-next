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
    <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          value={options.searchTerm}
          onChange={(e) => onChange({ ...options, searchTerm: e.target.value })}
          placeholder="Search properties..."
        />
      </div>
      <div>
        <Label>Property Types</Label>
        <div className="grid grid-cols-2 gap-2">
          {propertyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={options.propertyTypes.includes(type)}
                onCheckedChange={() =>
                  handleCheckboxChange("propertyTypes", type)
                }
              />
              <Label htmlFor={`type-${type}`}>{type}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>Property States</Label>
        <div className="grid grid-cols-2 gap-2">
          {propertyStates.map((state) => (
            <div key={state} className="flex items-center space-x-2">
              <Checkbox
                id={`state-${state}`}
                checked={options.propertyStates.includes(state)}
                onCheckedChange={() =>
                  handleCheckboxChange("propertyStates", state)
                }
              />
              <Label htmlFor={`state-${state}`}>{state}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>Groups</Label>
        <div className="grid grid-cols-2 gap-2">
          {groups.map((group) => (
            <div key={group} className="flex items-center space-x-2">
              <Checkbox
                id={`group-${group}`}
                checked={options.groups.includes(group)}
                onCheckedChange={() => handleCheckboxChange("groups", group)}
              />
              <Label htmlFor={`group-${group}`}>{group}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
