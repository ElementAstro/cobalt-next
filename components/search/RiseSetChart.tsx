import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

interface RiseSetChartProps {
  riseTime: string;
  setTime: string;
  transitTime: string;
  transitAltitude: number;
}

export function RiseSetChart({
  riseTime,
  setTime,
  transitTime,
  transitAltitude,
}: RiseSetChartProps) {
  const data = [
    { time: riseTime, altitude: 0 },
    { time: transitTime, altitude: transitAltitude },
    { time: setTime, altitude: 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-2"
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 90]} />
          <Tooltip />
          <Line type="monotone" dataKey="altitude" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
