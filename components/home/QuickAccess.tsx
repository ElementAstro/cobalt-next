import { motion } from "framer-motion";
import Link from "next/link";
import { Site } from "@/types/home";

interface QuickAccessProps {
  quickAccessSites: Site[];
}

const QuickAccess: React.FC<QuickAccessProps> = ({ quickAccessSites }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-wrap gap-4 justify-center my-6 px-4 landscape:flex-col landscape:fixed landscape:right-4 landscape:top-1/2 landscape:-translate-y-1/2"
    >
      {quickAccessSites.map((site: Site, index) => (
        <motion.div
          key={site.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
