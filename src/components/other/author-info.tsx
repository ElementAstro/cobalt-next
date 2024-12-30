"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Instagram,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, useAnimation } from "framer-motion";
import { DependencyList } from "./dependency-list";
import { ProjectList } from "./project-list";
import { ContactForm } from "./contact-form";
import { LicenseDisplay } from "./license-display";
import { UpdateLogModal } from "./changelog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface AuthorIntroProps {
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  github?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
  website?: string;
  instagram?: string;
  projects: Array<{
    name: string;
    description: string;
    link: string;
    category: string;
  }>;
}

export function AuthorIntro({
  name,
  avatar,
  bio,
  skills,
  github,
  twitter,
  linkedin,
  email,
  website,
  instagram,
  projects,
}: AuthorIntroProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [theme, setTheme] = useState("dark");
  const controls = useAnimation();
  const [colorTheme, setColorTheme] = useState<"light" | "dark" | "system">(
    "system"
  );
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (colorTheme === "system") {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [colorTheme]);

  return (
    <div className={isDark ? "dark" : ""}>
      <TooltipProvider>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
          className="w-full mx-auto"
        >
          <Card className="overflow-hidden rounded-2xl shadow-2xl dark:bg-gray-800/70 border border-gray-200/20 backdrop-blur-lg">
            <CardHeader className="p-6 sm:p-8">
              <motion.div
                className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={avatar}
                    alt={name}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-white/10 shadow-lg"
                  />
                </motion.div>
                <div className="text-center sm:text-left space-y-2">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Project Author
                  </CardDescription>
                </div>
                <div className="ml-auto">
                  <UpdateLogModal />
                </div>
              </motion.div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <TabsTrigger 
                    value="about"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm"
                  >
                    关于
                  </TabsTrigger>
                  <TabsTrigger 
                    value="projects"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm"
                  >
                    项目
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contact"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm"
                  >
                    联系
                  </TabsTrigger>
                  <TabsTrigger 
                    value="license"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm"
                  >
                    许可证
                  </TabsTrigger>
                  <TabsTrigger 
                    value="dependencies"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm"
                  >
                    依赖
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="about">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.p
                      className="text-sm text-muted-foreground mb-4"
                      initial={{ height: "4.5em", overflow: "hidden" }}
                      animate={{ height: isExpanded ? "auto" : "4.5em" }}
                    >
                      {bio}
                    </motion.p>
                    <Button
                      variant="link"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-0 h-auto font-normal text-blue-500 flex items-center"
                    >
                      {isExpanded ? "收起" : "展开"}
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </motion.span>
                    </Button>
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">技能:</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Badge variant="secondary">{skill}</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
                <TabsContent value="projects">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProjectList projects={projects} />
                  </motion.div>
                </TabsContent>
                <TabsContent value="contact">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ContactForm />
                  </motion.div>
                </TabsContent>
                <TabsContent value="license">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LicenseDisplay />
                  </motion.div>
                </TabsContent>
                <TabsContent value="dependencies">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <DependencyList />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-center gap-4 p-6 sm:gap-6">
              {github && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200/20 hover:bg-white/70 shadow-sm"
                        asChild
                      >
                        <a
                          href={github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-5 w-5" />
                          <span className="sr-only">GitHub</span>
                        </a>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white/90 backdrop-blur-sm border border-gray-200/20 shadow-sm">
                    <p>GitHub 主页</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {twitter && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Twitter 主页</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {linkedin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>LinkedIn 主页</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {email && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild>
                      <a href={`mailto:${email}`}>
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Email</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>发送邮件</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {website && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">网站</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>个人网站</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {instagram && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-4 w-4" />
                        <span className="sr-only">Instagram</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Instagram 主页</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </TooltipProvider>
    </div>
  );
}
