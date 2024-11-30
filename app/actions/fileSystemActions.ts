"use server";

import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import archiver from "archiver";
import { createWriteStream, createReadStream } from "fs";
import { pipeline } from "stream/promises";

const ROOT_DIR = process.env.ROOT_DIR || "/";
const VERSIONS_DIR = path.join(ROOT_DIR, ".versions");

export async function getDirectoryContents(dirPath: string) {
  const fullPath = path.join(ROOT_DIR, dirPath);
  const contents = await fs.readdir(fullPath, { withFileTypes: true });
  return contents.map((item) => ({
    name: item.name,
    isDirectory: item.isDirectory(),
  }));
}

export async function createItem(
  dirPath: string,
  name: string,
  isDirectory: boolean
) {
  const fullPath = path.join(ROOT_DIR, dirPath, name);
  if (isDirectory) {
    await fs.mkdir(fullPath);
  } else {
    await fs.writeFile(fullPath, "");
  }
  await createVersion(dirPath, name);
}

export async function deleteItem(dirPath: string, name: string) {
  const fullPath = path.join(ROOT_DIR, dirPath, name);
  await fs.rm(fullPath, { recursive: true, force: true });
  await deleteVersions(dirPath, name);
}

export async function renameItem(
  dirPath: string,
  oldName: string,
  newName: string
) {
  const oldPath = path.join(ROOT_DIR, dirPath, oldName);
  const newPath = path.join(ROOT_DIR, dirPath, newName);
  await fs.rename(oldPath, newPath);
  await renameVersions(dirPath, oldName, newName);
}

export async function moveItem(
  sourcePath: string,
  itemName: string,
  targetPath: string
) {
  const oldPath = path.join(ROOT_DIR, sourcePath, itemName);
  const newPath = path.join(ROOT_DIR, targetPath, itemName);
  await fs.rename(oldPath, newPath);
  await moveVersions(sourcePath, targetPath, itemName);
}

export async function getFileContent(
  dirPath: string,
  fileName: string,
  version?: string
) {
  if (version) {
    const versionPath = path.join(VERSIONS_DIR, dirPath, fileName, version);
    return await fs.readFile(versionPath, "utf-8");
  }
  const fullPath = path.join(ROOT_DIR, dirPath, fileName);
  return await fs.readFile(fullPath, "utf-8");
}

export async function updateFileContent(
  dirPath: string,
  fileName: string,
  content: string
) {
  const fullPath = path.join(ROOT_DIR, dirPath, fileName);
  await fs.writeFile(fullPath, content);
  await createVersion(dirPath, fileName);
}

export async function uploadFile(dirPath: string, file: File) {
  const fullPath = path.join(ROOT_DIR, dirPath, file.name);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(fullPath, buffer);
  await createVersion(dirPath, file.name);
}

export async function downloadFile(dirPath: string, fileName: string) {
  const fullPath = path.join(ROOT_DIR, dirPath, fileName);
  const content = await fs.readFile(fullPath);
  return content;
}

export async function searchFiles(dirPath: string, query: string) {
  const fullPath = path.join(ROOT_DIR, dirPath);
  const allFiles = await getAllFiles(fullPath);
  return allFiles.filter((file) =>
    file.name.toLowerCase().includes(query.toLowerCase())
  );
}

export async function compressItems(dirPath: string, items: string[]) {
  const zipFileName = `archive-${Date.now()}.zip`;
  const zipFilePath = path.join(ROOT_DIR, dirPath, zipFileName);
  const output = createWriteStream(zipFilePath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);

  for (const item of items) {
    const itemPath = path.join(ROOT_DIR, dirPath, item);
    const stats = await fs.stat(itemPath);
    if (stats.isDirectory()) {
      archive.directory(itemPath, item);
    } else {
      archive.file(itemPath, { name: item });
    }
  }

  await archive.finalize();
  return zipFileName;
}

export async function deleteItems(dirPath: string, items: string[]) {
  for (const item of items) {
    await deleteItem(dirPath, item);
  }
}

export async function generateShareLink(dirPath: string, fileName: string) {
  const shareId = uuidv4();
  const shareLink = `/share/${shareId}`;
  // In a real application, you would store this mapping in a database
  // For simplicity, we're just returning the link here
  return shareLink;
}

async function createVersion(dirPath: string, fileName: string) {
  const sourceFile = path.join(ROOT_DIR, dirPath, fileName);
  const versionDir = path.join(VERSIONS_DIR, dirPath, fileName);
  const versionFile = path.join(versionDir, `${Date.now()}.version`);

  await fs.mkdir(versionDir, { recursive: true });
  await fs.copyFile(sourceFile, versionFile);
}

async function deleteVersions(dirPath: string, fileName: string) {
  const versionDir = path.join(VERSIONS_DIR, dirPath, fileName);
  await fs.rm(versionDir, { recursive: true, force: true });
}

async function renameVersions(
  dirPath: string,
  oldName: string,
  newName: string
) {
  const oldVersionDir = path.join(VERSIONS_DIR, dirPath, oldName);
  const newVersionDir = path.join(VERSIONS_DIR, dirPath, newName);
  await fs.rename(oldVersionDir, newVersionDir);
}

async function moveVersions(
  sourcePath: string,
  targetPath: string,
  itemName: string
) {
  const sourceVersionDir = path.join(VERSIONS_DIR, sourcePath, itemName);
  const targetVersionDir = path.join(VERSIONS_DIR, targetPath, itemName);
  await fs.rename(sourceVersionDir, targetVersionDir);
}

export async function getFileVersions(dirPath: string, fileName: string) {
  const versionDir = path.join(VERSIONS_DIR, dirPath, fileName);
  try {
    const versions = await fs.readdir(versionDir);
    return versions.sort((a, b) => parseInt(b) - parseInt(a));
  } catch (error) {
    return [];
  }
}

async function getAllFiles(
  dir: string
): Promise<Array<{ name: string; isDirectory: boolean }>> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory()
        ? getAllFiles(res)
        : [{ name: dirent.name, isDirectory: false }];
    })
  );
  return Array.prototype.concat(...files);
}
