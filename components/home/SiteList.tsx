import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import SiteCard from "./SiteCard";
import { Site } from "@/types/home";

interface SiteListProps {
  sites: Site[];
  onDragEnd: (result: any) => void;
  removeSite: (site: Site) => void;
  toggleQuickAccess: (site: Site) => void;
  setEditingSite: (site: Site) => void;
  controls: any;
  onPreview: (site: Site) => void;
}

const SiteList: React.FC<SiteListProps> = ({
  sites,
  onDragEnd,
  removeSite,
  toggleQuickAccess,
  setEditingSite,
  controls,
  onPreview,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sites">
        {(provided) => (
          <motion.div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 
            landscape:md:grid-cols-2 landscape:lg:grid-cols-3 landscape:xl:grid-cols-4 
            gap-2 sm:gap-4 transition-all duration-300"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
            initial="hidden"
            animate={controls}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.1,
                },
              },
              hidden: {
                transition: {
                  staggerChildren: 0.05,
                  staggerDirection: -1,
                },
              },
            }}
          >
            <AnimatePresence>
              {sites.map((site: Site, index: number) => (
                <Draggable key={site.id} draggableId={site.id} index={index}>
                  {(provided) => (
                    <SiteCard
                      site={site}
                      provided={provided}
                      removeSite={removeSite}
                      toggleQuickAccess={toggleQuickAccess}
                      setEditingSite={setEditingSite}
                      onPreview={onPreview}
                    />
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </motion.div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SiteList;
