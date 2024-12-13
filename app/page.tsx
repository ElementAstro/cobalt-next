"use client";

import { useEffect, useState } from "react";
import Header from "@/components/home/Header";
import SearchBar from "@/components/custom/SearchBar";
import QuickAccess from "@/components/home/QuickAccess";
import CategoryFilter from "@/components/home/CategoryFilter";
import SiteList from "@/components/home/SiteList";
import PreviewModal from "@/components/home/PreviewModal";
import { Site } from "@/types/home";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import AddEditSiteDialog from "@/components/home/AddEditSiteDialog";
import { useSiteStore } from "@/lib/store/home";

const defaultSites: Site[] = [
  {
    id: "1",
    name: "GitHub",
    url: "https://github.com",
    icon: "github",
    category: "Development",
  },
  {
    id: "2",
    name: "Dashboard",
    url: "/dashboard",
    icon: "google",
    category: "Search",
  },
  // ...其他默认站点
];

export default function Home() {
  const {
    sites,
    quickAccessSites,
    searchTerm,
    activeCategory,
    addSite,
    updateSite,
    removeSite,
    toggleQuickAccess,
    setSearchTerm,
    setActiveCategory,
    setSites,
    setQuickAccessSites,
    reorderSites,
  } = useSiteStore();

  const [previewUrl, setPreviewUrl] = useState("");
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleAddNewSite = () => {
    setEditingSite(null);
    openDialog();
  };

  const handleEditSite = () => {
    openDialog();
  };

  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    const savedSites = localStorage.getItem("sites");
    if (savedSites !== null) {
      const parsedSites = JSON.parse(savedSites);
      if (parsedSites.length === 0) {
        setSites(defaultSites);
      } else {
        setSites(parsedSites);
      }
    } else {
      setSites(defaultSites);
    }
  }, [setSites]);

  useEffect(() => {
    localStorage.setItem("sites", JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeCategory === "All" || site.category === activeCategory)
  );

  const categories = [
    "All",
    ...Array.from(new Set(sites.map((site) => site.category))),
  ];

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderSites(result.source.index, result.destination.index);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(sites);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "my_navigation_hub_data.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast.success("Data exported successfully!");
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          try {
            const importedSites = JSON.parse(content);
            setSites(importedSites);
            toast.success("Data imported successfully!");
          } catch (error) {
            console.error("Error parsing imported data:", error);
            toast.error("Error importing data. Please check the file format.");
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const openPreview = (site: Site) => {
    setSelectedSite(site);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedSite(null);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 dark:from-gray-900 dark:to-black p-2 sm:p-8 transition-colors duration-300"
      ref={ref}
    >
      <div className="max-w-6xl mx-auto space-y-4">
        <Header
          exportData={exportData}
          importData={importData}
          onAddNewSite={handleAddNewSite}
        />
        <SearchBar
          initialSuggestions={sites.map((site) => site.name)}
          placeholder="搜索站点..."
          onSearch={setSearchTerm}
          variant="minimal"
        />
        <QuickAccess quickAccessSites={quickAccessSites} />
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <SiteList
          sites={filteredSites}
          onDragEnd={onDragEnd}
          removeSite={removeSite}
          toggleQuickAccess={toggleQuickAccess}
          setEditingSite={(site) => {
            setEditingSite(site);
            handleEditSite();
          }}
          controls={controls}
          onPreview={openPreview}
        />
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={closePreview}
          site={selectedSite}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <AddEditSiteDialog
              editingSite={editingSite}
              setEditingSite={setEditingSite}
            />
          </DialogContent>
        </Dialog>
      </div>
      <ToastContainer
        position="bottom-right"
        toastClassName="bg-indigo-800 text-white"
      />
    </motion.main>
  );
}
