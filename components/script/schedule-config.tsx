import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ScheduleConfigProps {
  schedule: {
    frequency: string;
    time: string;
    date: string;
  };
  onChange: (schedule: {
    frequency: string;
    time: string;
    date: string;
  }) => void;
}

export function ScheduleConfig({ schedule, onChange }: ScheduleConfigProps) {
  return (
    <motion.div
      className="space-y-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="space-y-2"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Label htmlFor="frequency" className="text-gray-700 dark:text-gray-300">
          Frequency
        </Label>
        <Select
          value={schedule.frequency}
          onValueChange={(value) => onChange({ ...schedule, frequency: value })}
        >
          <SelectTrigger
            id="frequency"
            className="dark:bg-gray-700 dark:text-gray-300"
          >
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:text-gray-300">
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
      <motion.div
        className="space-y-2"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">
          Time
        </Label>
        <Input
          id="time"
          type="time"
          value={schedule.time}
          onChange={(e) => onChange({ ...schedule, time: e.target.value })}
          className="dark:bg-gray-700 dark:text-gray-300"
        />
      </motion.div>
      <motion.div
        className="space-y-2"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={schedule.date}
          onChange={(e) => onChange({ ...schedule, date: e.target.value })}
          className="dark:bg-gray-700 dark:text-gray-300"
        />
      </motion.div>
    </motion.div>
  );
}
