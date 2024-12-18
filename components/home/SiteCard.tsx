import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Zap, Eye } from "lucide-react";
import { Site } from "@/types/home";

interface SiteCardProps {
  site: Site;
  provided: any;
  removeSite: (site: Site) => void;
  toggleQuickAccess: (site: Site) => void;
  setEditingSite: (site: Site) => void;
  onPreview: (site: Site) => void;
}

const SiteCard: React.FC<SiteCardProps> = ({
  site,
  provided,
  removeSite,
  toggleQuickAccess,
  setEditingSite,
  onPreview,
}) => {
  const getFullUrl = (url: string) => {
    if (typeof window !== "undefined" && url.startsWith("/")) {
      return `${window.location.origin}${url}`;
    }
    return url;
  };

  return (
    <motion.div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="relative group touch-manipulation"
      variants={{
        hidden: { scale: 0.8, y: 20, opacity: 0, rotateX: -20 },
        visible: {
          scale: 1,
          y: 0,
          opacity: 1,
          rotateX: 0,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, rotateX: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="bg-indigo-900/80 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        initial={false}
        animate={{ borderColor: "#4f46e5" }}
      >
        <Link
          href={getFullUrl(site.url)}
          className="bg-indigo-800 dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center space-y-2 h-full border border-indigo-600 hover:border-indigo-400"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-indigo-700 dark:bg-indigo-900 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-700 transition-colors duration-300">
            <i
              className={`lucide lucide-${site.icon} text-indigo-200 dark:text-indigo-300`}
            ></i>
          </div>
          <span className="text-sm font-medium text-indigo-200 dark:text-indigo-300 group-hover:text-white transition-colors duration-300">
            {site.name}
          </span>
        </Link>
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="bg-indigo-600 hover:bg-indigo-500"
            onClick={() => onPreview(site)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Preview site</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="bg-red-600 hover:bg-red-500"
            onClick={() => removeSite(site)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove site</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-indigo-600 hover:bg-indigo-500"
            onClick={() => setEditingSite(site)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">编辑站点</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-indigo-600 hover:bg-indigo-500"
            onClick={() => toggleQuickAccess(site)}
          >
            <Zap className="h-4 w-4" />
            <span className="sr-only">Toggle quick access</span>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SiteCard;
