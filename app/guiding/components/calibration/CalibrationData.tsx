"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGuidingStore } from "@/lib/store/guiding/calibration";
import { motion } from "framer-motion";

export default function CalibrationData() {
  const { calibrationData, settingsData } = useGuidingStore();

  return (
    <motion.div
      className="mt-4 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border border-gray-700 p-4 bg-gray-800 rounded-md shadow">
        <h3 className="text-sm mb-2 text-gray-300">上次校准数据</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-gray-400 text-xs p-1">
                赤经坐标:
              </TableCell>
              <TableCell className="text-xs p-1">
                {calibrationData.raStars}
              </TableCell>
              <TableCell className="text-gray-400 text-xs p-1">
                赤纬坐标:
              </TableCell>
              <TableCell className="text-xs p-1">
                {calibrationData.decStars}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-400 text-xs p-1">
                相机角度:
              </TableCell>
              <TableCell className="text-xs p-1">
                {calibrationData.cameraAngle.toFixed(1)}
              </TableCell>
              <TableCell className="text-gray-400 text-xs p-1">
                正交误差:
              </TableCell>
              <TableCell className="text-xs p-1">
                {calibrationData.orthogonalError.toFixed(1)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-400 text-xs p-1">
                赤经速率:
              </TableCell>
              <TableCell className="whitespace-pre-line text-xs p-1">
                {calibrationData.raSpeed}
              </TableCell>
              <TableCell className="text-gray-400 text-xs p-1">
                赤纬速率:
              </TableCell>
              <TableCell className="whitespace-pre-line text-xs p-1">
                {calibrationData.decSpeed}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="border border-gray-700 p-4 bg-gray-800 rounded-md shadow">
        <h3 className="text-sm mb-2 text-gray-300">赤道仪设置</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-gray-400 text-xs p-1">修改:</TableCell>
              <TableCell className="text-xs p-1">
                {settingsData.modifiedAt}
              </TableCell>
              <TableCell className="text-gray-400 text-xs p-1">焦距:</TableCell>
              <TableCell className="text-xs p-1">
                {settingsData.focalLength}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-400 text-xs p-1">
                分辨率:
              </TableCell>
              <TableCell className="text-xs p-1">
                {settingsData.resolution}
              </TableCell>
              <TableCell className="text-gray-400 text-xs p-1">
                赤道仪方位:
              </TableCell>
              <TableCell className="text-xs p-1">
                {settingsData.raDirection}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-400 text-xs p-1">赤经</TableCell>
              <TableCell className="text-xs p-1">
                {settingsData.decValue}
              </TableCell>
              <TableCell className="text-gray-400 text-xs p-1">
                旋转绝对值:
              </TableCell>
              <TableCell className="text-xs p-1">
                {settingsData.rotationAngle}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
