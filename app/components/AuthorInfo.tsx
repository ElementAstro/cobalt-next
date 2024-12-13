"use client";

import { AuthorIntro } from "@/components/infomation/AuthorIntro";
import { useState, useEffect } from "react";

export default function AuthorInfo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AuthorIntro
      name="Max Qian"
      avatar="/placeholder.svg?height=96&width=96"
      bio="Full-stack developer with a passion for creating user-friendly web applications. Experienced in React, Node.js, and cloud technologies. I love solving complex problems and building scalable solutions. When I'm not coding, you can find me hiking in the mountains or experimenting with new recipes in the kitchen."
      skills={["React", "Node.js", "TypeScript", "AWS", "GraphQL", "Next.js"]}
      github="https://github.com/janedoe"
      twitter="https://twitter.com/janedoe"
      linkedin="https://linkedin.com/in/janedoe"
      email="jane@example.com"
      website="https://janedoe.com"
      projects={[
        {
          name: "E-commerce Platform",
          description:
            "A full-stack e-commerce solution built with Next.js and Stripe",
          link: "https://github.com/janedoe/ecommerce-platform",
          category: "Web Development",
        },
        {
          name: "Task Management App",
          description:
            "A React Native mobile app for managing tasks and projects",
          link: "https://github.com/janedoe/task-management-app",
          category: "Mobile Development",
        },
        {
          name: "Weather Dashboard",
          description:
            "A responsive weather dashboard using React and OpenWeatherMap API",
          link: "https://github.com/janedoe/weather-dashboard",
          category: "Web Development",
        },
      ]}
    />
  );
}
