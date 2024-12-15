"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PixelInfoProps {
  data: any;
}

export default function PixelInfo({ data }: PixelInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
        概括信息
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <Table className="w-full">
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                时间戳:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.timestamp}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                相机:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.simulator}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                主暗场曝光的时间:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.mainFieldExposureTime}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                主暗场曝光次数:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.mainFieldBrightness}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                平均:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.average}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="w-full">
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                修正强度，热噪:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.correctionLevelHot}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                修正强度，冷噪:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.correctionLevelCold}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                标准差:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.standardDeviation}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                中位数:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.median}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                中位数绝对误差:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.medianAbsoluteDeviation}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
        结果
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <Table className="w-full">
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                热噪统计:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.hotPixelCount}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                冷像素统计:
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-100">
                {data.coldPixelCount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="space-y-2">
          <Label htmlFor="manual-pixel">手动增加像素点:</Label>
          <div className="flex space-x-2">
            <Input
              id="manual-pixel"
              value={data.manualPixel}
              onChange={(e) => data.setManualPixel(e.target.value)}
              placeholder="输入值"
              className="flex-1 p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
            />
            <Button
              onClick={() => data.handleManualAddPixel()}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
