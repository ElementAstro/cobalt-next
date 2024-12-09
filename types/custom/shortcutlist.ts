export interface Command {
  id: string;
  title: string;
  description: string;
  action: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
}

export interface CommandPaletteProps {
  commands: Command[];
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  maxDisplayedCommands?: number;
  showShortcuts?: boolean;
  showIcons?: boolean;
  theme?: "light" | "dark" | "system";
  hotkey?: string;
}
