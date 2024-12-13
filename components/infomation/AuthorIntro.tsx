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
  Sun,
  Moon,
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
import { ProjectList } from "./ProjectList";
import { ContactForm } from "./ContactForm";

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

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        <Card className="overflow-hidden rounded-xl shadow-xl dark:bg-gray-800/50 border-none">
          <CardHeader>
            <motion.div
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={avatar}
                alt={name}
                width={96}
                height={96}
                className="rounded-full"
              />
              <div className="text-center sm:text-left">
                <CardTitle className="text-2xl">{name}</CardTitle>
                <CardDescription>Project Author</CardDescription>
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">关于</TabsTrigger>
                <TabsTrigger value="projects">项目</TabsTrigger>
                <TabsTrigger value="contact">联系</TabsTrigger>
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
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-center gap-3 p-6">
            {github && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <a href={github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>GitHub 主页</p>
                </TooltipContent>
              </Tooltip>
            )}
            {twitter && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <a href={twitter} target="_blank" rel="noopener noreferrer">
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
                    <a href={website} target="_blank" rel="noopener noreferrer">
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
  );
}
