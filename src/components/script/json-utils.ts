import { z } from "zod";

export function parseJson(jsonString: string): any {
  return JSON.parse(jsonString);
}

export function stringifyJson(json: any): string {
  return JSON.stringify(json, null, 2);
}

export function reorderNodes(
  json: any,
  sourcePath: string[],
  destinationPath: string[],
  sourceIndex: number,
  destinationIndex: number
): any {
  const newJson = JSON.parse(JSON.stringify(json)); // 深拷贝

  const getParent = (obj: any, path: string[]) => {
    return path.reduce((acc, key) => acc[key], obj);
  };

  const sourceParent = getParent(newJson, sourcePath);
  const destParent = getParent(newJson, destinationPath);

  if (Array.isArray(sourceParent) && Array.isArray(destParent)) {
    const [removed] = sourceParent.splice(sourceIndex, 1);
    destParent.splice(destinationIndex, 0, removed);
  } else if (
    typeof sourceParent === "object" &&
    typeof destParent === "object"
  ) {
    const keys = Object.keys(sourceParent);
    const [removedKey] = keys.splice(sourceIndex, 1);
    keys.forEach((key, idx) => {
      sourceParent[key] = sourceParent[key];
    });
    destParent.splice(destinationIndex, 0, {
      [removedKey]: sourceParent[removedKey],
    });
    delete sourceParent[removedKey];
  }

  return newJson;
}

export function parseInputData(data: any): any {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Invalid JSON string:", error);
      return {};
    }
  } else if (typeof data === "object" && data !== null) {
    return data;
  } else {
    console.error("Invalid input data type");
    return {};
  }
}

export function validateJson(json: any, schema?: z.ZodTypeAny): boolean {
  try {
    // 基本JSON验证
    JSON.stringify(json);
    
    // 如果提供了schema，进行额外验证
    if (schema) {
      const result = schema.safeParse(json);
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
    }
    return true;
  } catch (error) {
    console.error("JSON validation failed:", error);
    return false;
  }
}

export function formatJson(json: any, indent = 2): string {
  try {
    return JSON.stringify(json, null, indent);
  } catch (error) {
    console.error("Failed to format JSON:", error);
    return "{}";
  }
}

export function minifyJson(json: any): string {
  try {
    return JSON.stringify(json);
  } catch (error) {
    console.error("Failed to minify JSON:", error);
    return "{}";
  }
}

export function getNodeDepth(path: string[]): number {
  return path.length;
}

export function generateUniqueKey(parent: any, baseKey: string): string {
  let key = baseKey;
  let counter = 1;
  while (parent[key] !== undefined) {
    key = `${baseKey}${counter}`;
    counter++;
  }
  return key;
}

export function validateJsonStructure(json: any, schema: any): boolean {
  // 使用zod进行结构校验
  try {
    const parsedSchema = z.object(schema);
    parsedSchema.parse(json);
    return true;
  } catch (error) {
    console.error("JSON structure validation failed:", error);
    return false;
  }
}
