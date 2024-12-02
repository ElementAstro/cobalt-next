"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Moon, Sun, Filter, Home } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AdvancedSearch } from "../../components/plugin/AdvancedSearch";
import { PluginDetails } from "../../components/plugin/PluginDetails";
import { VerticalTabs } from "../../components/plugin/VerticalTabs";
import { PluginReviews } from "../../components/plugin/PluginReviews";
import { Plugin, SearchFilters, User } from "@/types/plugin";
import { mockPlugins } from "@/utils/mock-plugin";
import { AutocompleteSearch } from "../../components/plugin/AutocompleteSearch";
import { ConfirmDialog } from "../../components/plugin/ConfirmDialog";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

export default function PluginPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Plugin[]>([]);
  const [comparePlugins, setComparePlugins] = useState<Plugin[]>([]);
  const { theme, setTheme } = useTheme();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<Plugin[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    checkOrientation();
    loadRecentlyViewed();
    window.addEventListener("resize", checkOrientation);
    fetchPlugins();
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const checkOrientation = () => {
    setIsLandscape(
      window.innerWidth > window.innerHeight && window.innerWidth < 1024
    );
  };

  const fetchPlugins = async (
    query: string = "",
    filters: SearchFilters = {}
  ) => {
    setIsLoading(true);
    setError(null);

    if (useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const filteredPlugins = mockPlugins.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(query.toLowerCase()) ||
          plugin.description.toLowerCase().includes(query.toLowerCase())
      );
      setPlugins(filteredPlugins);
      if (query) {
        setSearchResults(filteredPlugins);
      } else {
        setSearchResults([]);
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/plugins?query=${query}&${new URLSearchParams(
          filters as any
        ).toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch plugins");
      }
      const data = await response.json();
      setPlugins(data);
      if (query) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError("An error occurred while fetching plugins");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string, filters: SearchFilters = {}) => {
    fetchPlugins(query, filters);
    setSelectedPlugin(null);
  };

  const handleInstallComplete = (id: number) => {
    setConfirmMessage("Are you sure you want to install this plugin?");
    setConfirmAction(() => () => {
      setPlugins(
        plugins.map((plugin) =>
          plugin.id === id ? { ...plugin, installed: true } : plugin
        )
      );
      setSelectedPlugin((prev) => (prev ? { ...prev, installed: true } : null));
    });
    setShowConfirmDialog(true);
  };

  const handleUninstall = (id: number) => {
    setConfirmMessage("Are you sure you want to uninstall this plugin?");
    setConfirmAction(() => () => {
      setPlugins(
        plugins.map((plugin) =>
          plugin.id === id ? { ...plugin, installed: false } : plugin
        )
      );
      setSelectedPlugin((prev) =>
        prev ? { ...prev, installed: false } : null
      );
    });
    setShowConfirmDialog(true);
  };

  const handleLogin = (email: string, password: string) => {
    console.log("Login:", email, password);
    setCurrentUser({
      id: "1",
      name: "John Doe",
      email,
      avatar: "/placeholder.svg",
    });
  };

  const handleRegister = (name: string, email: string, password: string) => {
    console.log("Register:", name, email, password);
    setCurrentUser({ id: "1", name, email, avatar: "/placeholder.svg" });
  };

  const handleAddReview = (
    pluginId: number,
    rating: number,
    comment: string
  ) => {
    setPlugins(
      plugins.map((plugin) =>
        plugin.id === pluginId
          ? {
              ...plugin,
              reviews: [
                ...(plugin.reviews || []),
                {
                  id: Date.now().toString(),
                  userId: currentUser!.id,
                  pluginId,
                  rating,
                  comment,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : plugin
      )
    );
  };

  const handleViewPlugin = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    addToRecentlyViewed(plugin);
  };

  const addToRecentlyViewed = (plugin: Plugin) => {
    const updatedRecentlyViewed = [
      plugin,
      ...recentlyViewed.filter((p) => p.id !== plugin.id),
    ].slice(0, 5);
    setRecentlyViewed(updatedRecentlyViewed);
    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(updatedRecentlyViewed)
    );
  };

  const loadRecentlyViewed = () => {
    const storedRecentlyViewed = localStorage.getItem("recentlyViewed");
    if (storedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(storedRecentlyViewed));
    }
  };

  const handleAddToCompare = (plugin: Plugin) => {
    setComparePlugins((prev) => [...prev, plugin].slice(0, 3));
  };

  const handleReturnHome = () => {
    setSelectedPlugin(null);
    setSearchResults([]);
  };

  const renderFeaturedPlugins = () => (
    <motion.section
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="mt-6"
    >
      <motion.h2
        variants={headerVariants}
        className="mb-6 text-2xl font-semibold"
      >
        Featured Plugins
      </motion.h2>
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {plugins.slice(0, 3).map((plugin) => (
            <motion.div key={plugin.id} variants={itemVariants}>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <div className="text-center">
                        <Image
                          src={plugin.image}
                          alt={plugin.name}
                          width={200}
                          height={200}
                          className="mx-auto mb-4 rounded-lg object-cover"
                        />
                        <h3 className="font-semibold">{plugin.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {plugin.description}
                        </p>
                        <Button
                          className="mt-4"
                          onClick={() => handleViewPlugin(plugin)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </motion.div>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </motion.section>
  );

  const renderPluginGrid = (pluginsToRender: Plugin[], title: string) => (
    <motion.section
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="mt-6"
    >
      <motion.h2
        variants={headerVariants}
        className="mb-6 text-2xl font-semibold"
      >
        {title}
      </motion.h2>
      {isLoading ? (
        <p>Loading plugins...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {pluginsToRender.map((plugin) => (
            <motion.div key={plugin.id} variants={itemVariants}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src={plugin.image}
                    alt={plugin.name}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{plugin.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plugin.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {plugin.price}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleViewPlugin(plugin)}
                      >
                        {plugin.installed ? "Installed" : "View"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );

  const renderRecentlyViewed = () => (
    <motion.section
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="mt-6"
    >
      <motion.h2
        variants={headerVariants}
        className="mb-6 text-2xl font-semibold"
      >
        Recently Viewed
      </motion.h2>
      <div className="flex space-x-4 overflow-x-auto">
        {recentlyViewed.map((plugin) => (
          <motion.div key={plugin.id} variants={itemVariants}>
            <Card className="w-64 flex-shrink-0">
              <CardContent className="p-4">
                <Image
                  src={plugin.image}
                  alt={plugin.name}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover mb-4"
                />
                <h3 className="font-semibold">{plugin.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plugin.description}
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => handleViewPlugin(plugin)}
                >
                  View Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );

  const renderComparePlugins = () => (
    <motion.section
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="mt-6"
    >
      <motion.h2
        variants={headerVariants}
        className="mb-6 text-2xl font-semibold"
      >
        Compare Plugins
      </motion.h2>
      <div className="overflow-x-auto">
        <motion.table
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full border-collapse"
        >
          <thead>
            <tr>
              <th className="border p-2">Feature</th>
              {comparePlugins.map((plugin) => (
                <th key={plugin.id} className="border p-2">
                  {plugin.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <motion.tr variants={itemVariants}>
              <td className="border p-2">Price</td>
              {comparePlugins.map((plugin) => (
                <td key={plugin.id} className="border p-2">
                  {plugin.price}
                </td>
              ))}
            </motion.tr>
            <motion.tr variants={itemVariants}>
              <td className="border p-2">Rating</td>
              {comparePlugins.map((plugin) => (
                <td key={plugin.id} className="border p-2">
                  {plugin.rating.toFixed(1)}
                </td>
              ))}
            </motion.tr>
            <motion.tr variants={itemVariants}>
              <td className="border p-2">Downloads</td>
              {comparePlugins.map((plugin) => (
                <td key={plugin.id} className="border p-2">
                  {plugin.downloads.toLocaleString()}
                </td>
              ))}
            </motion.tr>
          </tbody>
        </motion.table>
      </div>
    </motion.section>
  );

  const tabs = [
    {
      value: "featured",
      label: "Featured Plugins",
      content: renderFeaturedPlugins(),
    },
    {
      value: "all",
      label: "All Plugins",
      content: renderPluginGrid(plugins, "All Plugins"),
    },
    {
      value: "installed",
      label: "Installed Plugins",
      content: renderPluginGrid(
        plugins.filter((plugin) => plugin.installed),
        "Installed Plugins"
      ),
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-screen overflow-hidden bg-background"
    >
      <main className="flex-grow overflow-hidden" ref={mainContentRef}>
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 h-full overflow-y-auto"
        >
          <AutocompleteSearch
            plugins={plugins}
            onSearch={handleSearch}
            className="mb-6"
          />
          {showAdvancedSearch && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <AdvancedSearch onSearch={handleSearch} />
            </motion.div>
          )}
          {selectedPlugin ? (
            <>
              <motion.div variants={itemVariants}>
                <PluginDetails
                  plugin={selectedPlugin}
                  onInstallComplete={handleInstallComplete}
                  onUninstall={handleUninstall}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PluginReviews
                  reviews={selectedPlugin.reviews || []}
                  onAddReview={(rating, comment) =>
                    handleAddReview(selectedPlugin.id, rating, comment)
                  }
                  currentUser={currentUser}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  className="mt-4"
                  onClick={() => handleAddToCompare(selectedPlugin)}
                >
                  Add to Compare
                </Button>
              </motion.div>
            </>
          ) : searchResults.length > 0 ? (
            <motion.div variants={itemVariants}>
              {renderPluginGrid(searchResults, "Search Results")}
            </motion.div>
          ) : isLandscape ? (
            <motion.div variants={itemVariants}>
              <VerticalTabs tabs={tabs} />
            </motion.div>
          ) : (
            <motion.div variants={containerVariants}>
              <motion.div variants={itemVariants}>
                {renderFeaturedPlugins()}
              </motion.div>
              <motion.div variants={itemVariants}>
                {renderPluginGrid(plugins, "All Plugins")}
              </motion.div>
              <motion.div variants={itemVariants}>
                {renderPluginGrid(
                  plugins.filter((plugin) => plugin.installed),
                  "Installed Plugins"
                )}
              </motion.div>
            </motion.div>
          )}

          {recentlyViewed.length > 0 && (
            <motion.div variants={itemVariants}>
              {renderRecentlyViewed()}
            </motion.div>
          )}
          {comparePlugins.length > 0 && (
            <motion.div variants={itemVariants}>
              {renderComparePlugins()}
            </motion.div>
          )}
        </motion.div>
      </main>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          confirmAction();
          setShowConfirmDialog(false);
        }}
        message={confirmMessage}
      />
    </motion.div>
  );
}
