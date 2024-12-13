import Image from "next/image";
import { motion } from "framer-motion";
import { CelestialData } from "@/types/astropanel";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface SolarSystemProps {
  data: CelestialData;
}

export default function SolarSystem({ data }: SolarSystemProps) {
  const planets = [
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ];

  return (
    <motion.div
      className="bg-gray-900 text-white p-4 rounded-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Solar System</h2>
      <div className="overflow-x-auto">
        <table className="w-full mb-6 table-auto">
          <thead>
            <tr className="bg-blue-800">
              <th className="text-left py-2 px-4">Planet</th>
              <th className="py-2 px-4">Rise</th>
              <th className="py-2 px-4">Transit</th>
              <th className="py-2 px-4">Set</th>
              <th className="py-2 px-4">Azimuth</th>
              <th className="py-2 px-4">Altitude</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((planet) => (
              <motion.tr
                key={planet}
                className={getPlanetColor(String(data[`${planet}_alt`] || "0"))}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <td className="capitalize py-2 px-4">{planet}</td>
                <td className="text-right py-2 px-4">
                  {formatData(data[`${planet}_rise`])}
                </td>
                <td className="text-right py-2 px-4">
                  {formatData(data[`${planet}_transit`])}
                </td>
                <td className="text-right py-2 px-4">
                  {formatData(data[`${planet}_set`])}
                </td>
                <td className="text-right py-2 px-4">
                  {formatData(data[`${planet}_az`])}
                </td>
                <td className="text-right py-2 px-4">
                  {formatData(data[`${planet}_alt`])}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <Image
            src="/assets/img/solar_system.png"
            alt="Solar System"
            width={480}
            height={240}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function getPlanetColor(altitude: string): string {
  const alt = parseFloat(altitude);
  if (alt > 25) return "text-green-500";
  if (alt > 0) return "text-orange-500";
  return "text-white";
}

function formatData(value: any): string | number {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }
  return "N/A";
}
