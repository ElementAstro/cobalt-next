import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef } from "react";

interface StarChartProps {
  onClose: () => void;
}

export function StarChart({ onClose }: StarChartProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = "https://aladin.cds.unistra.fr/AladinLite/";
    }
  }, []);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Star Chart</DialogTitle>
        </DialogHeader>
        <div className="flex-grow">
          <iframe
            ref={iframeRef}
            title="Aladin Lite Star Chart"
            width="100%"
            height="600px"
            frameBorder="0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
