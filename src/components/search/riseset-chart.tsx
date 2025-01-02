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
  // Generate more detailed data points for smoother curve
  const generateDataPoints = () => {
    const points = [];
    const riseDate = new Date(`2000/01/01 ${riseTime}`);
    const setDate = new Date(`2000/01/01 ${setTime}`);
    const transitDate = new Date(`2000/01/01 ${transitTime}`);

    for (let i = 0; i <= 24; i++) {
      const time = new Date(
        riseDate.getTime() + (i * (setDate.getTime() - riseDate.getTime())) / 24
      );
      const altitude = calculateAltitude(
        time,
        riseDate,
        transitDate,
        setDate,
        transitAltitude
      );
      points.push({
        time: time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        altitude: Math.max(0, altitude),
      });
    }
    return points;
  };

  const calculateAltitude = (
    current: Date,
    rise: Date,
    transit: Date,
    set: Date,
    maxAlt: number
  ): number => {
    // Convert all times to minutes since midnight for easier calculation
    const getMinutes = (date: Date) => date.getHours() * 60 + date.getMinutes();

    const currentMin = getMinutes(current);
    const riseMin = getMinutes(rise);
    const transitMin = getMinutes(transit);
    const setMin = getMinutes(set);

    // If current time is outside rise-set period, return 0
    if (currentMin < riseMin || currentMin > setMin) {
      return 0;
    }

    // Calculate position in the arc (0 to 1)
    let position;
    if (currentMin <= transitMin) {
      // Rising phase
      position = (currentMin - riseMin) / (transitMin - riseMin);
    } else {
      // Setting phase
      position = 1 - (currentMin - transitMin) / (setMin - transitMin);
    }

    // Use sine function to create smooth curve
    return maxAlt * Math.sin((position * Math.PI) / 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full p-2 bg-background/50 backdrop-blur-sm rounded-lg"
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={generateDataPoints()}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="altitudeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
          <YAxis domain={[0, 90]} stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "0.375rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="altitude"
            stroke="url(#altitudeGradient)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
