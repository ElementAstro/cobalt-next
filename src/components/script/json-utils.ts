import { z } from "zod";

export function parseJson(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON parsing error:", error);
    return null;
  }
}

export function stringifyJson(json: any): string {
  try {
    return JSON.stringify(json, null, 2);
  } catch (error) {
    console.error("JSON stringification error:", error);
    return "";
  }
}

export function reorderNodes(nodes: any[], oldIndex: number, newIndex: number): any[] {
  const result = Array.from(nodes);
  const [removed] = result.splice(oldIndex, 1);
  result.splice(newIndex, 0, removed);
  return result;
}

export function parseInputData(data: any): any {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
}

export function validateJson(json: any, schema?: any): string | null {
  try {
    if (typeof json === "string") {
      JSON.parse(json);
    }
    
    if (schema) {
      // Add schema validation logic here if needed
      return null;
    }
    
    return null;
  } catch (error) {
    return (error as Error).message;
  }
}

export function formatJson(json: any): string {
  try {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    return JSON.stringify(json, null, 2);
  } catch (error) {
    console.error("JSON formatting error:", error);
    throw new Error("Invalid JSON format");
  }
}

export function minifyJson(json: any): string {
  try {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    return JSON.stringify(json);
  } catch (error) {
    console.error("JSON minification error:", error);
    throw new Error("Invalid JSON format");
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

export function searchJson(json: any, query: string): any[] {
  const results: any[] = [];
  
  function search(obj: any, path: string[] = []) {
    if (!obj) return;
    
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key];
      
      if (key.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          path: currentPath.join('.'),
          key,
          value
        });
      }
      
      if (typeof value === 'object') {
        search(value, currentPath);
      }
    });
  }
  
  search(json);
  return results;
}

export function diffJson(oldJson: any, newJson: any): any {
  const diff: any = {};
  
  function compare(obj1: any, obj2: any, path: string[] = []) {
    if (obj1 === obj2) return;
    
    if (typeof obj1 !== typeof obj2) {
      diff[path.join('.')] = { old: obj1, new: obj2 };
      return;
    }
    
    if (typeof obj1 !== 'object') {
      if (obj1 !== obj2) {
        diff[path.join('.')] = { old: obj1, new: obj2 };
      }
      return;
    }
    
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    
    allKeys.forEach(key => {
      compare(obj1[key], obj2[key], [...path, key]);
    });
  }
  
  compare(oldJson, newJson);
  return diff;
}

export function mergeJson(target: any, source: any, options = { overwrite: true }): any {
  const result = { ...target };
  
  Object.entries(source).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      if (key in result && typeof result[key] === 'object') {
        result[key] = mergeJson(result[key], value, options);
      } else if (options.overwrite || !(key in result)) {
        result[key] = value;
      }
    } else if (options.overwrite || !(key in result)) {
      result[key] = value;
    }
  });
  
  return result;
}
