import { useState } from "react";
import Image from "next/image";
import { Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plugin } from "@/types/plugin";
import { motion } from "framer-motion";

interface PluginDetailsProps {
  plugin: Plugin;
  onInstallComplete: (id: number) => void;
  onUninstall: (id: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function PluginDetails({
  plugin,
  onInstallComplete,
  onUninstall,
}: PluginDetailsProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);

  if (!plugin) {
    return <div className="text-center text-red-500">插件未找到</div>;
  }

  const handleInstall = () => {
    setIsInstalling(true);
    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsInstalling(false);
          onInstallComplete(plugin.id);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleUninstall = () => {
    onUninstall(plugin.id);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-8"
    >
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <Image
            src={plugin.image}
            alt={plugin.name}
            width={600}
            height={400}
            className="rounded-lg object-cover w-full shadow-lg dark:shadow-gray-700"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4 dark:text-white">
              {plugin.name}
            </h1>
            <p className="text-lg mb-4 dark:text-gray-300">
              {plugin.description}
            </p>
            <div className="flex items-center mb-4">
              <Star className="text-yellow-400 mr-1" />
              <span className="text-gray-200">{plugin.rating.toFixed(1)}</span>
              <span className="mx-2 text-gray-500">|</span>
              <Download className="mr-1 text-gray-400" />
              <span className="text-gray-200">
                {plugin.downloads.toLocaleString()} 次下载
              </span>
            </div>
            <p className="mb-2 dark:text-gray-300">
              <strong>版本:</strong> {plugin.version} |{" "}
              <strong>更新日期:</strong> {plugin.lastUpdated}
            </p>
            <p className="mb-2 dark:text-gray-300">
              <strong>开发者:</strong> {plugin.developer}
            </p>
            <p className="mb-4 dark:text-gray-300">
              <strong>分类:</strong> {plugin.category} / {plugin.subcategory}
            </p>
            <div className="mb-4">
              <strong className="text-gray-200">标签:</strong>
              <div className="flex flex-wrap mt-1">
                {plugin.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-700 text-gray-200 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-2xl font-bold mb-4 dark:text-white">
              {plugin.price}
            </p>
            {plugin.reviews && plugin.reviews.length > 0 ? (
              <div className="mb-4 dark:text-gray-300">
                <h2 className="text-xl font-semibold mb-2">用户评价</h2>
                {plugin.reviews.map((review, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-yellow-400">★ {review.rating}</p>
                    <p className="text-gray-200">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-4 text-gray-500">暂无评价。</p>
            )}
          </div>
          <div>
            {plugin.installed ? (
              <Button
                onClick={handleUninstall}
                className="w-full"
                variant="destructive"
                size="lg"
              >
                卸载
              </Button>
            ) : isInstalling ? (
              <div className="w-full flex flex-col items-center">
                <Progress value={installProgress} className="w-full mb-2" />
                <p className="text-gray-200">安装中... {installProgress}%</p>
              </div>
            ) : (
              <Button onClick={handleInstall} className="w-full" size="lg">
                安装
              </Button>
            )}
          </div>
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="mt-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">详细描述</h2>
        <p className="dark:text-gray-300">{plugin.longDescription}</p>
      </motion.div>
      <motion.div variants={itemVariants} className="mt-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">系统要求</h2>
        <ul className="list-disc pl-5 dark:text-gray-300">
          {plugin.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
