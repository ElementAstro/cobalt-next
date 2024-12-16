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
      className="w-full py-4 bg-gray-800 flex justify-between items-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold">图标编辑器</h1>
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
    </motion.header>
  );
}
