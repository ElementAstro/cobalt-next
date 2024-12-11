import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Twitter,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styled, { ThemeProvider } from "styled-components";

interface UserCardProps {
  name?: string;
  position: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  location?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  onContactClick?: () => void;
  online?: boolean;
  twitter?: string;
  github?: string;
  linkedin?: string;
  interests?: string[];
  workExperience?: string;
  skills?: string[];
  darkMode?: boolean;
  onDarkModeToggle?: (isDark: boolean) => void;
}

const lightTheme = {
  background: "#ffffff",
  text: "#000000",
  cardBackground: "bg-card",
  cardText: "text-card-foreground",
  iconColor: "#1a202c",
};

const darkTheme = {
  background: "#1a202c",
  text: "#ffffff",
  cardBackground: "bg-gray-800",
  cardText: "text-gray-100",
  iconColor: "#ffffff",
};

// 样式容器
const StyledCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function UserCard({
  name = "Anonymous User",
  position,
  avatarUrl = "/placeholder.svg?height=100&width=100",
  email,
  phone,
  location,
  backgroundColor,
  textColor,
  iconColor,
  onContactClick = () => alert("Contact clicked!"),
  online = true,
  twitter,
  github,
  linkedin,
  interests = [],
  workExperience = "",
  skills = [],
  darkMode = false,
  onDarkModeToggle = () => {},
}: UserCardProps) {
  const [showMore, setShowMore] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => setIsFlipped(!isFlipped);

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <TooltipProvider>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <StyledCard className={`${backgroundColor} ${textColor}`}>
            <motion.div
              className="relative"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front of the card */}
              <motion.div
                className={`${isFlipped ? "invisible" : "visible"}`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarUrl} alt={`${name} 的头像`} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <CardTitle className="text-2xl font-bold">{name}</CardTitle>
                      <CardDescription className="text-lg">
                        {position}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={online ? "outline" : "secondary"}
                      className="text-xs px-2 py-1"
                    >
                      {online ? "在线" : "离线"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail color={theme.iconColor} className="mr-2" />
                        <a href={`mailto:${email}`} className="hover:underline">
                          {email}
                        </a>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone color={theme.iconColor} className="mr-2" />
                        <a href={`tel:${phone}`} className="hover:underline">
                          {phone}
                        </a>
                      </div>
                      {location && (
                        <div className="flex items-center text-sm">
                          <MapPin color={theme.iconColor} className="mr-2" />
                          <span>{location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  <AnimatePresence>
                    {showMore && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-2"
                      >
                        <motion.div variants={itemVariants}>
                          <div>
                            <h3 className="font-semibold mb-1">兴趣爱好:</h3>
                            <div className="flex flex-wrap gap-2">
                              {interests.map((interest, index) => (
                                <Badge key={index} variant="outline">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <div>
                            <h3 className="font-semibold mb-1">技能:</h3>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <div>
                            <h3 className="font-semibold mb-1">工作经验:</h3>
                            <p className="text-sm">{workExperience}</p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div variants={itemVariants} className="mt-4 flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore ? "收起" : "查看更多"}
                    </Button>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">暗黑模式</span>
                      <Switch
                        checked={darkMode}
                        onCheckedChange={(checked) => onDarkModeToggle(checked)}
                      />
                    </div>
                  </motion.div>
                </CardContent>
                <div className="flex justify-between p-4 border-t">
                  <div className="flex gap-2">
                    {twitter && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter 个人主页"
                          >
                            <Twitter color={theme.iconColor} className="h-5 w-5" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Twitter 个人主页</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {github && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub 个人主页"
                          >
                            <Github color={theme.iconColor} className="h-5 w-5" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>GitHub 个人主页</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {linkedin && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn 个人主页"
                          >
                            <Linkedin color={theme.iconColor} className="h-5 w-5" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>LinkedIn 个人主页</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <Button onClick={onContactClick}>联系</Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={flipCard}
                >
                  翻转卡片
                </Button>
              </motion.div>

              {/* Back of the card */}
              <motion.div
                className={`absolute inset-0 ${
                  isFlipped ? "visible" : "invisible"
                }`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
                variants={itemVariants}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    关于 {name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    {name} 是一位 {position}，对技术和创新充满热情。拥有丰富的行业经验，
                    {name.split(" ")[0]} 为每一个项目带来了独特的视角。
                  </p>
                  <h3 className="font-semibold mb-2">趣事:</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>最喜欢的编程语言: JavaScript</li>
                    <li>爱好: 徒步旅行、摄影和弹吉他</li>
                    <li>梦想假期: 徒步穿越欧洲</li>
                  </ul>
                </CardContent>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={flipCard}
                >
                  翻回卡片
                </Button>
              </motion.div>
            </motion.div>
          </StyledCard>
        </motion.div>
      </TooltipProvider>
    </ThemeProvider>
  );
}