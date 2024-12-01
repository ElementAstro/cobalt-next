export function parseJson(jsonString: string): any {
  return JSON.parse(jsonString)
}

export function stringifyJson(json: any): string {
  return JSON.stringify(json, null, 2)
}

export function reorderNodes(json: any, sourcePath: string[], destinationPath: string[], sourceIndex: number, destinationIndex: number): any {
  const newJson = { ...json }
  
  let sourceParent = newJson
  for (let i = 0; i < sourcePath.length - 1; i++) {
    sourceParent = sourceParent[sourcePath[i]]
  }
  
  let destParent = newJson
  for (let i = 0; i < destinationPath.length - 1; i++) {
    destParent = destParent[destinationPath[i]]
  }
  
  const sourceKey = sourcePath[sourcePath.length - 1]
  const destKey = destinationPath[destinationPath.length - 1]
  
  if (Array.isArray(sourceParent) && Array.isArray(destParent)) {
    const [removed] = sourceParent.splice(sourceIndex, 1)
    destParent.splice(destinationIndex, 0, removed)
  } else if (typeof sourceParent === 'object' && typeof destParent === 'object') {
    const sourceKeys = Object.keys(sourceParent)
    const destKeys = Object.keys(destParent)
    
    const [removed] = sourceKeys.splice(sourceIndex, 1)
    destKeys.splice(destinationIndex, 0, removed)
    
    const newSourceParent: any = {}
    sourceKeys.forEach(key => {
      newSourceParent[key] = sourceParent[key]
    })
    
    const newDestParent: any = {}
    destKeys.forEach(key => {
      newDestParent[key] = key === removed ? sourceParent[removed] : destParent[key]
    })
    
    Object.assign(sourceParent, newSourceParent)
    Object.assign(destParent, newDestParent)
  }
  
  return newJson
}

export function parseInputData(data: any): any {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error("Invalid JSON string:", error)
      return {}
    }
  } else if (typeof data === 'object' && data !== null) {
    return data
  } else {
    console.error("Invalid input data type")
    return {}
  }
}

