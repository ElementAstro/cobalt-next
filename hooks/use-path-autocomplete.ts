import { useState, useEffect } from "react";

const defaultPaths = ["/home", "/users", "/settings", "/api", "/docs"];

export function usePathAutocomplete(
  input: string,
  customPaths: string[] = defaultPaths,
  maxSuggestions: number = 5
) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (input.length > 0) {
      // 模糊匹配和分词补全
      const matchedPaths = customPaths
        .filter((path) => path.toLowerCase().includes(input.toLowerCase()))
        .slice(0, maxSuggestions); // 截取最多的建议数量

      setSuggestions(matchedPaths);
    } else {
      setSuggestions([]);
    }
  }, [input, customPaths, maxSuggestions]);

  return suggestions;
}
