import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { MoonData } from "@/types/astropanel";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface MoonProps {
  data: MoonData;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Moon = ({ data }: MoonProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const moonPhaseDetails = {
    "New Moon": "新月是月球运行到太阳与地球之间时的状态",
    "Waxing Crescent": "眉月是新月之后，月亮逐渐变亮的阶段",
    "First Quarter": "上弦月是月亮运行到公转轨道的四分之一处",
    "Waxing Gibbous": "盈凸月是上弦月之后，继续变圆的阶段",
    "Full Moon": "满月是月球运行到地球背向太阳的一面时的状态",
    "Waning Gibbous": "亏凸月是满月之后，开始变暗的阶段",
    "Last Quarter": "下弦月是月亮运行到公转轨道的四分之三处",
    "Waning Crescent": "残月是下弦月之后，继续变暗的阶段",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="dark:bg-gray-800 bg-white rounded-lg shadow-lg p-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-white dark:text-gray-200">
            月亮信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => setShowDetails(!showDetails)}
              className="cursor-pointer w-48 h-48 relative"
            >
              <Image
                src={`/assets/img/moon_${data.phase.toLowerCase()}.png`}
                alt="Moon"
                layout="fill"
                objectFit="contain"
                className="rounded-full shadow-lg"
              />
            </motion.div>
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mt-4 p-4 bg-gray-700 rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-2">月相详情</h3>
                  <p className="text-sm text-gray-300">
                    {
                      moonPhaseDetails[
                        data.phase as keyof typeof moonPhaseDetails
                      ]
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div variants={itemVariants} className="flex-1">
              <p className="mb-4 text-xl text-gray-700 dark:text-gray-300">
                {data.phase} ({data.light}%)
              </p>
              <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <TableBody>
                  <motion.tr
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      升起时间
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {data.rise || "N/A"}
                    </TableCell>
                  </motion.tr>
                  <motion.tr
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      过境时间
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {data.transit || "N/A"}
                    </TableCell>
                  </motion.tr>
                  <motion.tr
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      落下时间
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {data.set || "N/A"}
                    </TableCell>
                  </motion.tr>
                  <motion.tr
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      方位角
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {data.az || "N/A"}
                    </TableCell>
                  </motion.tr>
                  <motion.tr
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      高度角
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {data.alt || "N/A"}
                    </TableCell>
                  </motion.tr>
                </TableBody>
              </Table>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Moon;
