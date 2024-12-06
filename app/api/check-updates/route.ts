import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
  const dependencies = await request.json();

  interface Dependency {
    name: string;
    version: string;
  }

  interface UpdatedDependency extends Dependency {
    latestVersion: string;
  }

  const updatedDependencies: UpdatedDependency[] = await Promise.all(
    dependencies.map(async (dep: Dependency): Promise<UpdatedDependency> => {
      try {
        const { stdout } = await execPromise(`npm show ${dep.name} version`);
        const latestVersion = stdout.trim();
        return {
          ...dep,
          latestVersion,
        };
      } catch (error) {
        console.error(`Failed to get latest version for ${dep.name}:`, error);
        return {
          ...dep,
          latestVersion: "Unknown",
        };
      }
    })
  );

  return NextResponse.json(updatedDependencies);
}
