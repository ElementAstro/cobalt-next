import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Todo } from ".";
import { Label } from "@/components/ui/label";

interface AddTodoFormProps {
  onAdd: (todo: Omit<Todo, "id" | "completed">) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Todo["category"]>("personal");
  const [priority, setPriority] = useState<Todo["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [observationLocation, setObservationLocation] = useState("");
  const [weatherConditions, setWeatherConditions] = useState("");
  const [moonPhase, setMoonPhase] = useState("");
  const [celestialObjectRiseTime, setCelestialObjectRiseTime] = useState("");
  const [celestialObjectSetTime, setCelestialObjectSetTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd({
        text: text.trim(),
        category,
        priority,
        dueDate,
        observationLocation,
        weatherConditions,
        moonPhase,
        celestialObjectRiseTime,
        celestialObjectSetTime,
      });
      setText("");
      setCategory("personal");
      setPriority("medium");
      setDueDate("");
      setObservationLocation("");
      setWeatherConditions("");
      setMoonPhase("");
      setCelestialObjectRiseTime("");
      setCelestialObjectSetTime("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
      />
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={category}
          onValueChange={(value: Todo["category"]) => setCategory(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="study">Study</SelectItem>
            <SelectItem value="astronomy">Astronomy</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={priority}
          onValueChange={(value: Todo["priority"]) => setPriority(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      {category === "astronomy" && (
        <div className="space-y-2">
          <div>
            <Label htmlFor="observationLocation">Observation Location</Label>
            <Input
              id="observationLocation"
              value={observationLocation}
              onChange={(e) => setObservationLocation(e.target.value)}
              placeholder="Enter observation location"
            />
          </div>
          <div>
            <Label htmlFor="weatherConditions">Weather Conditions</Label>
            <Input
              id="weatherConditions"
              value={weatherConditions}
              onChange={(e) => setWeatherConditions(e.target.value)}
              placeholder="Enter weather conditions"
            />
          </div>
          <div>
            <Label htmlFor="moonPhase">Moon Phase</Label>
            <Input
              id="moonPhase"
              value={moonPhase}
              onChange={(e) => setMoonPhase(e.target.value)}
              placeholder="Enter moon phase"
            />
          </div>
          <div>
            <Label htmlFor="celestialObjectRiseTime">
              Celestial Object Rise Time
            </Label>
            <Input
              id="celestialObjectRiseTime"
              type="time"
              value={celestialObjectRiseTime}
              onChange={(e) => setCelestialObjectRiseTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="celestialObjectSetTime">
              Celestial Object Set Time
            </Label>
            <Input
              id="celestialObjectSetTime"
              type="time"
              value={celestialObjectSetTime}
              onChange={(e) => setCelestialObjectSetTime(e.target.value)}
            />
          </div>
        </div>
      )}
      <Button type="submit" className="w-full">
        Add Todo
      </Button>
    </form>
  );
}
