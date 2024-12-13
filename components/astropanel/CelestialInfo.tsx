import { CelestialData } from "@/types/astropanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface CelestialInfoProps {
  data: CelestialData;
}

const tableVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

export default function CelestialInfo({ data }: CelestialInfoProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      setError("Unable to load celestial data");
    }
  }, [data]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-500 text-white p-4 rounded-lg"
      >
        {error}
      </motion.div>
    );
  }

  const metrics: { label: string; value: string | number }[] = [
    { label: "Current Time", value: data.current_time || "N/A" },
    {
      label: "Location",
      value: data.location
        ? `${data.location.latitude}, ${data.location.longitude}`
        : "N/A",
    },
    { label: "Temperature", value: data.weather.temperature || "N/A" },
    { label: "Humidity", value: data.weather.humidity || "N/A" },
    { label: "Pressure", value: data.weather.pressure || "N/A" },
    {
      label: "Wind",
      value:
        data.weather.wind_speed && data.weather.wind_direction
          ? `${data.weather.wind_speed} ${data.weather.wind_direction}`
          : "N/A",
    },
    { label: "Cloud Cover", value: data.weather.cloud_cover || "N/A" },
    { label: "Visibility", value: data.weather.visibility || "N/A" },
    { label: "Sunrise", value: data.sun.rise || "N/A" },
    { label: "Sunset", value: data.sun.set || "N/A" },
    { label: "Moon Phase", value: data.moon.phase || "N/A" },
    { label: "Moon Light", value: data.moon.light || "N/A" },
    {
      label: "Polaris Next Transit",
      value: data.polaris.next_transit || "N/A",
    },
    { label: "Polaris Altitude", value: data.polaris.alt || "N/A" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dark:bg-gray-800 bg-white rounded-lg shadow-lg p-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-white dark:text-gray-200">
            Current Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Metric
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Value
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {metrics.map((metric, index) => (
                    <motion.tr
                      key={metric.label}
                      custom={index}
                      variants={tableVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {metric.label}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {metric.value}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
