import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = await fs.readFile(packageJsonPath, "utf-8");
    const { dependencies, devDependencies } = JSON.parse(packageJson);

    const allDependencies = { ...dependencies, ...devDependencies };
    const dependencyList = Object.keys(allDependencies).map((name) => ({
      name,
      version: allDependencies[name],
      license: "Unknown", // 这里可以进一步改进以获取实际的许可证信息
      description: "No description available", // 这里可以进一步改进以获取实际的描述信息
    }));

    return NextResponse.json(dependencyList);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read dependencies" },
      { status: 500 }
    );
  }
}
