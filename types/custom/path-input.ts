import { z } from "zod";

export type PathType = "unix" | "windows";

export interface PathSchema {
  unix: z.ZodTypeAny;
  windows: z.ZodTypeAny;
}

export interface PathInputProps {
  onValidPath?: (path: string) => void;
  customPaths?: string[];
  initialPathType?: PathType;
  allowRelativePaths?: boolean;
  maxHistoryItems?: number;
  customSchemas?: Partial<PathSchema>;
  customIcons?: {
    folder?: React.ReactNode;
    history?: React.ReactNode;
    preview?: React.ReactNode;
  };
  labels?: {
    input?: string;
    allowRelative?: string;
    pathType?: string;
    unix?: string;
    windows?: string;
  };
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  popoverClassName?: string;
}
