import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface MockFile {
  name: string;
  isDirectory: boolean;
  size: number;
  modifiedAt: string;
  content?: string;
}

class MockFileSystem {
  private fileSystem: { [path: string]: MockFile[] } = {
    "/": [
      {
        name: "Documents",
        isDirectory: true,
        size: 0,
        modifiedAt: new Date().toISOString(),
      },
      {
        name: "Images",
        isDirectory: true,
        size: 0,
        modifiedAt: new Date().toISOString(),
      },
      {
        name: "hello.txt",
        isDirectory: false,
        size: 13,
        modifiedAt: new Date().toISOString(),
        content: "Hello, World!",
      },
    ],
    "/Documents/": [
      {
        name: "report.pdf",
        isDirectory: false,
        size: 1024,
        modifiedAt: new Date().toISOString(),
        content: "Mock PDF content",
      },
    ],
    "/Images/": [
      {
        name: "photo.jpg",
        isDirectory: false,
        size: 2048,
        modifiedAt: new Date().toISOString(),
        content: "Mock image data",
      },
    ],
  };

  listFiles(path: string): MockFile[] {
    return this.fileSystem[path] || [];
  }

  createFile(
    path: string,
    name: string,
    content: string,
    isDirectory: boolean
  ) {
    const newFile: MockFile = {
      name,
      isDirectory,
      size: isDirectory ? 0 : content.length,
      modifiedAt: new Date().toISOString(),
      content: isDirectory ? undefined : content,
    };
    if (!this.fileSystem[path]) {
      this.fileSystem[path] = [];
    }
    this.fileSystem[path].push(newFile);
  }

  updateFile(path: string, name: string, content: string) {
    const file = this.fileSystem[path].find((f) => f.name === name);
    if (file) {
      file.content = content;
      file.size = content.length;
      file.modifiedAt = new Date().toISOString();
    }
  }

  deleteFile(path: string, name: string) {
    this.fileSystem[path] = this.fileSystem[path].filter(
      (f) => f.name !== name
    );
  }

  renameFile(path: string, oldName: string, newName: string) {
    const fileIndex = this.fileSystem[path].findIndex(
      (f) => f.name === oldName
    );
    if (fileIndex !== -1) {
      this.fileSystem[path][fileIndex].name = newName;
      this.fileSystem[path][fileIndex].modifiedAt = new Date().toISOString();
    }
  }

  fileExists(path: string, name: string): boolean {
    return this.fileSystem[path]?.some((f) => f.name === name) || false;
  }

  searchFiles(path: string, query: string): MockFile[] {
    const files = this.listFiles(path);
    return files.filter((file) =>
      file.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  uploadFile(path: string, file: File) {
    const newFile: MockFile = {
      name: file.name,
      isDirectory: false,
      size: file.size,
      modifiedAt: new Date().toISOString(),
      content: "Mock file content",
    };
    if (!this.fileSystem[path]) {
      this.fileSystem[path] = [];
    }
    this.fileSystem[path].push(newFile);
  }

  compressItems(path: string, items: string[]): string {
    // In mock mode, we'll just return a fake archive name
    return `mock-archive-${Date.now()}.zip`;
  }

  generateShareLink(path: string, fileName: string): string {
    // In mock mode, we'll just return a fake share link
    return `/share/mock-${uuidv4()}`;
  }

  getFileVersions(path: string, fileName: string): string[] {
    // In mock mode, we'll return some fake version timestamps
    return [
      Date.now().toString(),
      (Date.now() - 86400000).toString(),
      (Date.now() - 172800000).toString(),
    ];
  }
}

export function useMockMode() {
  const [isMockMode, setIsMockMode] = useState(false);
  const [mockFileSystem] = useState(new MockFileSystem());

  const toggleMockMode = () => {
    setIsMockMode(!isMockMode);
  };

  return { isMockMode, toggleMockMode, mockFileSystem };
}
