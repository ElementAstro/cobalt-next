import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PolarisData } from "@/types/astropanel";
import { motion } from "framer-motion";

interface PolarFinderProps {
  data: PolarisData;
}

export default function PolarFinder({ data }: PolarFinderProps) {
  const phaAngle = 360 + (data.hour_angle || 0) * -1 - 180;
  const phaFormatted = formatPHA(data.hour_angle);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dark:bg-gray-800 bg-white rounded-lg shadow-lg p-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-white dark:text-gray-200">
            Polaris
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            <motion.div
              className="relative w-72 h-72"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/assets/img/reticle.png"
                alt="Reticle"
                layout="fill"
                className="rounded-full"
              />
              <Image
                src="/assets/img/polaris.png"
                alt="Polaris"
                width={280}
                height={280}
                className="absolute top-0 left-0 rounded-full"
                style={{ transform: `rotate(${phaAngle}deg)` }}
              />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm mb-4 text-blue-300">
                View as in polar finder scope
              </p>
              <Table className="dark:text-gray-300">
                <TableBody>
                  <TableRow>
                    <TableCell>Hour Angle</TableCell>
                    <TableCell>{phaFormatted}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Next Transit</TableCell>
                    <TableCell>{data.next_transit}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Altitude</TableCell>
                    <TableCell>{data.alt}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function formatPHA(pha: number) {
  if (!pha) return "00:00:00";
  const phaH = String(Math.floor(pha / 15)).padStart(2, "0");
  const phaMtmp = (pha / 15 - Math.floor(pha / 15)) * 60;
  const phaM = String(Math.floor(phaMtmp)).padStart(2, "0");
  const phaS = String(
    Math.floor((phaMtmp - Math.floor(phaMtmp)) * 60)
  ).padStart(2, "0");
  return `${phaH}:${phaM}:${phaS}`;
}
