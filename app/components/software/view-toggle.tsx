import { Grid, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ViewToggleProps {
  view: "list" | "grid" | "detail";
  onViewChange: (view: "list" | "grid" | "detail") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(v) => onViewChange(v as "list" | "grid" | "detail")}
      className="flex space-x-2"
    >
      <ToggleGroupItem value="list" aria-label="List view" className="w-10">
        <List className="h-4 w-4 mx-auto" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view" className="w-10">
        <Grid className="h-4 w-4 mx-auto" />
      </ToggleGroupItem>
      <ToggleGroupItem value="detail" aria-label="Detail view" className="w-10">
        <LayoutGrid className="h-4 w-4 mx-auto" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
