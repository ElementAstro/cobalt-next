import { Button } from "@/components/ui/button";
import { Settings, RotateCcw, Power } from "lucide-react";

export function TopBar() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <RotateCcw className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <Power className="h-5 w-5" />
      </Button>
    </div>
  );
}
