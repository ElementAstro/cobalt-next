import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      className="w-full py-4 bg-gray-800 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold">图标编辑器</h1>
    </motion.header>
  );
}
