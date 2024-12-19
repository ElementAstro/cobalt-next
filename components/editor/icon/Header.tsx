import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Header() {
  return (
    <motion.header
      className="sticky top-0 z-50 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          图标编辑器
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>使用说明</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>• 变换：调整图标的旋转角度和缩放比例</p>
              <p>• 滤镜：调整亮度、对比度、色相、饱和度等</p>
              <p>• 效果：添加边框、圆角、阴影等特效</p>
              <p>• 预设：快速应用预定义的样式组合</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.header>
  );
}
