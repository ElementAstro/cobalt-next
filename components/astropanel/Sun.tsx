import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import Image from "next/image";
import { SunData } from "@/types/astropanel";
import { motion } from "framer-motion";

export default function Sun({ data }: { data: SunData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg"
    >
      <Card className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-32 h-32 md:w-48 md:h-48 relative"
        >
          <Image
            src="/assets/img/sun.png"
            alt="Sun"
            layout="fill"
            objectFit="contain"
          />
        </motion.div>
        <CardContent className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Sun</h2>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead className="text-right">时刻</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Start astronomical twilight</TableCell>
                <TableCell className="text-right">{data.at_start}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Start civil twilight</TableCell>
                <TableCell className="text-right">{data.ct_start}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sunrise</TableCell>
                <TableCell className="text-right">{data.rise}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Transit</TableCell>
                <TableCell className="text-right">{data.transit}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sunset</TableCell>
                <TableCell className="text-right">{data.set}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>End civil twilight</TableCell>
                <TableCell className="text-right">{data.ct_end}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>End astronomical twilight</TableCell>
                <TableCell className="text-right">{data.at_end}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
