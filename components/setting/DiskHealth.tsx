import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface DiskHealthProps {
  health: "good" | "fair" | "poor";
}

export function DiskHealth({ health }: DiskHealthProps) {
  switch (health) {
    case "good":
      return <CheckCircle className="text-green-500" />;
    case "fair":
      return <AlertTriangle className="text-yellow-500" />;
    case "poor":
      return <XCircle className="text-red-500" />;
    default:
      return <Info className="text-gray-500" />;
  }
}
