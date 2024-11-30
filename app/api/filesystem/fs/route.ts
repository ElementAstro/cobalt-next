import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ROOT_DIR = process.env.ROOT_DIR || "/";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const filePath = searchParams.get("path") || "/";

  switch (action) {
    case "list":
      return handleList(filePath);
    case "read":
      return handleRead(filePath);
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const { action, path: filePath, content, newName } = await request.json();

  switch (action) {
    case "create":
      return handleCreate(filePath, content);
    case "update":
      return handleUpdate(filePath, content);
    case "delete":
      return handleDelete(filePath);
    case "rename":
      return handleRename(filePath, newName);
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}

async function handleList(dirPath: string) {
  try {
    const fullPath = path.join(ROOT_DIR, dirPath);
    const items = await fs.readdir(fullPath, { withFileTypes: true });
    const contents = items.map((item) => ({
      name: item.name,
      isDirectory: item.isDirectory(),
      size: item.isDirectory()
        ? null
        : fs.stat(path.join(fullPath, item.name)).then((stat) => stat.size),
      modifiedAt: fs
        .stat(path.join(fullPath, item.name))
        .then((stat) => stat.mtime.toISOString()),
    }));
    return NextResponse.json(await Promise.all(contents));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read directory" },
      { status: 500 }
    );
  }
}

async function handleRead(filePath: string) {
  try {
    const fullPath = path.join(ROOT_DIR, filePath);
    const content = await fs.readFile(fullPath, "utf-8");
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}

async function handleCreate(filePath: string, content: string) {
  try {
    const fullPath = path.join(ROOT_DIR, filePath);
    await fs.writeFile(fullPath, content);
    return NextResponse.json({ message: "File created successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create file" },
      { status: 500 }
    );
  }
}

async function handleUpdate(filePath: string, content: string) {
  try {
    const fullPath = path.join(ROOT_DIR, filePath);
    await fs.writeFile(fullPath, content);
    return NextResponse.json({ message: "File updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 500 }
    );
  }
}

async function handleDelete(filePath: string) {
  try {
    const fullPath = path.join(ROOT_DIR, filePath);
    await fs.unlink(fullPath);
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

async function handleRename(oldPath: string, newName: string) {
  try {
    const fullOldPath = path.join(ROOT_DIR, oldPath);
    const fullNewPath = path.join(path.dirname(fullOldPath), newName);
    await fs.rename(fullOldPath, fullNewPath);
    return NextResponse.json({ message: "File renamed successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to rename file" },
      { status: 500 }
    );
  }
}
