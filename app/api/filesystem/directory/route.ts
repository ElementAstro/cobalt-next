import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ROOT_DIR = process.env.ROOT_DIR || "/";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dirPath = searchParams.get("path") || "/";

  try {
    const fullPath = path.join(ROOT_DIR, dirPath);
    const contents = await fs.readdir(fullPath, { withFileTypes: true });
    const items = contents.map((item) => ({
      name: item.name,
      isDirectory: item.isDirectory(),
    }));
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read directory" },
      { status: 500 }
    );
  }
}
