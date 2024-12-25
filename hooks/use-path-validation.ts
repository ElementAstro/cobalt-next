import { useState, useEffect } from "react";
import { z } from "zod";
import { PathType, PathSchema } from "@/types/custom/path-input";

const defaultUnixSchema = z
  .string()
  .regex(/^\//, "Unix 路径必须以 / 开头")
  .regex(/^(\/[a-zA-Z0-9_-]+)+$/, "Unix 路径格式无效");

const defaultWindowsSchema = z
  .string()
  .regex(/^[a-zA-Z]:\\/, "Windows 路径必须以盘符开头（例如 C:\\）")
  .regex(
    /^[a-zA-Z]:\\([a-zA-Z0-9_-]+(\\[a-zA-Z0-9_-]+)*)?$/,
    "Windows 路径格式无效"
  );

export function usePathValidation(
  path: string,
  pathType: PathType,
  allowRelativePaths: boolean,
  customSchemas?: Partial<PathSchema>
) {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    validatePath(path);
  }, [path, pathType, allowRelativePaths]);

  const validatePath = (input: string) => {
    let schema =
      pathType === "unix"
        ? customSchemas?.unix || defaultUnixSchema
        : customSchemas?.windows || defaultWindowsSchema;

    if (allowRelativePaths) {
      schema = schema.or(z.string().min(1, "路径不能为空"));
    }

    const result = schema.safeParse(input);

    if (result.success) {
      setIsValid(true);
      setError("");
    } else {
      setIsValid(false);
      setError(result.error.issues[0].message);
    }
  };

  return { isValid, error };
}
