import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ROOT_DIR = process.env.ROOT_DIR || "/";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get("path") || "/";
  const fileName = searchParams.get("name");

  if (!fileName) {
    return NextResponse.json(
      { error: "File name is required" },
      { status: 400 }
    );
  }

  try {
    const fullPath = path.join(ROOT_DIR, filePath, fileName);
    const content = await fs.readFile(fullPath);
    return new NextResponse(content);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get("path") || "/";
  const fileName = searchParams.get("name");

  if (!fileName) {
    return NextResponse.json(
      { error: "File name is required" },
      { status: 400 }
    );
  }

  try {
    const fullPath = path.join(ROOT_DIR, filePath, fileName);
    await fs.unlink(fullPath);
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
