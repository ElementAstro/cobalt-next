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

export function validateJson(json: any): boolean {
  try {
    JSON.stringify(json);
    return true;
  } catch {
    return false;
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
