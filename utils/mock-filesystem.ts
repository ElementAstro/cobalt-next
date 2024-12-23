import { File, Folder } from "@/types/filesystem";

export const mockFileSystem: Folder = {
  id: "1",
  name: "root",
  files: [
    {
      id: "2",
      name: "图片",
      type: "folder",
      files: [
        {
          id: "2-1",
          name: "image1.png",
          type: "image",
          size: 1024000,
          lastModified: new Date("2023-12-01"),
          createdAt: new Date("2023-11-01"),
          owner: "user1",
          permissions: "rw-r--r--",
          path: "/root/图片/image1.png",
        },
        {
          id: "2-2",
          name: "image2.jpg",
          type: "image",
          size: 768000,
          lastModified: new Date("2023-12-04"),
          createdAt: new Date("2023-11-02"),
          owner: "user2",
          permissions: "rw-r--r--",
          path: "/root/图片/image2.jpg",
        },
      ],
    },
    {
      id: "3",
      name: "文档",
      type: "folder",
      files: [
        {
          id: "3-1",
          name: "document1.pdf",
          type: "document",
          size: 256000,
          lastModified: new Date("2023-12-05"),
          createdAt: new Date("2023-11-03"),
          owner: "user3",
          permissions: "rw-r--r--",
          content: "This is a sample PDF content.",
          path: "/root/文档/document1.pdf",
        },
        {
          id: "3-2",
          name: "document2.docx",
          type: "document",
          size: 384000,
          lastModified: new Date("2023-12-06"),
          createdAt: new Date("2023-11-04"),
          owner: "user4",
          permissions: "rw-r--r--",
          content: "This is a sample Word document content.",
          path: "/root/文档/document2.docx",
        },
      ],
    },
  ],
};
