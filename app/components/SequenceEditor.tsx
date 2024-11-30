import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SequenceStep {
  type: "light" | "dark" | "bias" | "flat";
  count: number;
  exposure: number;
  filter?: string;
}

interface SequenceEditorProps {
  onClose: () => void;
}

export function SequenceEditor({ onClose }: SequenceEditorProps) {
  const [sequence, setSequence] = useState<SequenceStep[]>([]);
  const [currentStep, setCurrentStep] = useState<SequenceStep>({
    type: "light",
    count: 1,
    exposure: 30,
  });

  const addStep = () => {
    setSequence([...sequence, currentStep]);
    setCurrentStep({ type: "light", count: 1, exposure: 30 });
  };

  const startSequence = () => {
    // In a real application, this would start the imaging sequence
    console.log("Starting sequence:", sequence);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Sequence Editor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Select
              value={currentStep.type}
              onValueChange={(value: "light" | "dark" | "bias" | "flat") =>
                setCurrentStep({ ...currentStep, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Frame Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="bias">Bias</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Count"
              value={currentStep.count}
              onChange={(e) =>
                setCurrentStep({
                  ...currentStep,
                  count: parseInt(e.target.value),
                })
              }
            />
            <Input
              type="number"
              placeholder="Exposure (s)"
              value={currentStep.exposure}
              onChange={(e) =>
                setCurrentStep({
                  ...currentStep,
                  exposure: parseInt(e.target.value),
                })
              }
            />
            {currentStep.type === "light" && (
              <Select
                value={currentStep.filter}
                onValueChange={(value) =>
                  setCurrentStep({ ...currentStep, filter: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="luminance">Luminance</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button onClick={addStep}>Add Step</Button>
          </div>
          <div className="space-y-2">
            {sequence.map((step, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-700 p-2 rounded"
              >
                <span>{step.type}</span>
                <span>{step.count}x</span>
                <span>{step.exposure}s</span>
                {step.filter && <span>{step.filter}</span>}
              </div>
            ))}
          </div>
          <Button onClick={startSequence} disabled={sequence.length === 0}>
            Start Sequence
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
