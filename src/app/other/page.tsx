"use client";

import { AuthorIntro } from "@/components/other/author-info";
import { ProjectList } from "@/components/other/project-list";
import { DependencyList } from "@/components/other/dependency-list";
import { LicenseDisplay } from "@/components/other/license-display";
import { ContactForm } from "@/components/other/contact-form";
import { ClientInfo } from "@/components/other/client-info";
import { UpdateLogModal } from "@/components/other/changelog";

interface Project {
  name: string;
  description: string;
  link: string;
  category: string;
  tags?: string[];
  rating?: number;
  isFavorite?: boolean;
}

const projects: Project[] = [
  {
    name: "星空追踪器",
    description: "一个用于追踪和记录天文摄影的应用程序。",
    link: "https://example.com/project1",
    category: "工具",
    tags: ["天文", "摄影", "工具"],
    rating: 5,
    isFavorite: true,
  },
  {
    name: "银河图库",
    description: "展示高质量银河系摄影作品的图库平台。",
    link: "https://example.com/project2",
    category: "图库",
    tags: ["银河", "图库", "摄影"],
    rating: 4,
    isFavorite: false,
  },
  // 更多项目...
];

const author = {
  name: "张伟",
  avatar: "/avatars/zhangwei.png",
  bio: "天文摄影爱好者，专注于捕捉宇宙的美丽瞬间。",
  skills: ["React", "Next.js", "TypeScript", "Framer Motion"],
  github: "https://github.com/zhangwei",
  twitter: "https://twitter.com/zhangwei",
  linkedin: "https://linkedin.com/in/zhangwei",
  email: "zhangwei@example.com",
  website: "https://zhangwei.com",
  instagram: "https://instagram.com/zhangwei",
  projects: projects.map(({ name, description, link, category }) => ({
    name,
    description,
    link,
    category,
  })),
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <main className="container mx-auto p-4">
        <section className="my-8">
          <AuthorIntro {...author} />
        </section>
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            项目列表
          </h2>
          <ProjectList projects={projects} />
        </section>
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            依赖列表
          </h2>
          <DependencyList />
        </section>
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            许可证
          </h2>
          <LicenseDisplay />
        </section>
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            联系我
          </h2>
          <ContactForm />
        </section>
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            客户端信息
          </h2>
          <ClientInfo />
        </section>
      </main>
      <UpdateLogModal />
    </div>
  );
}
