export interface Command {
  id: string;
  title: string;
  description: string;
  action: () => void | Promise<void>;
  icon?: React.ReactNode;
  shortcut?: string;
  loading?: boolean;
  disabled?: boolean;
}

export interface CommandPaletteProps {
  commands: Command[];
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  maxDisplayedCommands?: number;
  showShortcuts?: boolean;
  showIcons?: boolean;
  hotkey?: string;
  useTransition?: boolean;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

export type StartTransition = (callback: () => void) => void;
