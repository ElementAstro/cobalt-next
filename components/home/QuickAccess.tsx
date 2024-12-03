import { motion } from "framer-motion";
import Link from "next/link";
import { Site } from "@/types/home";

interface QuickAccessProps {
  quickAccessSites: Site[];
}

const QuickAccess: React.FC<QuickAccessProps> = ({ quickAccessSites }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-4 justify-center my-6"
    >
      {quickAccessSites.map((site: Site) => (
        <motion.div
          key={site.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={site.url}
            className="bg-indigo-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            <i
              className={`lucide lucide-${site.icon} text-indigo-200 text-xl`}
            ></i>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuickAccess;
