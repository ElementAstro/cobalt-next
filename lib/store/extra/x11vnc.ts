import { create } from "zustand";

interface X11VNCState {
  display: string;
  port: string;
  viewonly: boolean;
  shared: boolean;
  forever: boolean;
  ssl: boolean;
  httpPort: string;
  passwd: string;
  allowedHosts: string;
  logFile: string;
  clipboard: boolean;
  noxdamage: boolean;
  scale: string;
  repeat: boolean;
  bg: boolean;
  rfbauth: string;
  command: string;
  setConfig: (key: string, value: string | boolean) => void;
  generateCommand: () => void;
}

export const useX11VNCStore = create<X11VNCState>((set, get) => ({
  display: "",
  port: "5900",
  viewonly: false,
  shared: false,
  forever: false,
  ssl: false,
  httpPort: "",
  passwd: "",
  allowedHosts: "",
  logFile: "",
  clipboard: true,
  noxdamage: false,
  scale: "1",
  repeat: false,
  bg: false,
  rfbauth: "",
  command: "",
  setConfig: (key, value) => set({ [key]: value }),
  generateCommand: () => {
    const state = get();
    let cmd = "x11vnc";
    if (state.display) cmd += ` -display ${state.display}`;
    if (state.port !== "5900") cmd += ` -rfbport ${state.port}`;
    if (state.viewonly) cmd += " -viewonly";
    if (state.shared) cmd += " -shared";
    if (state.forever) cmd += " -forever";
    if (state.ssl) cmd += " -ssl";
    if (state.httpPort) cmd += ` -http ${state.httpPort}`;
    if (state.passwd) cmd += ` -passwd ${state.passwd}`;
    if (state.allowedHosts) cmd += ` -allow ${state.allowedHosts}`;
    if (state.logFile) cmd += ` -o ${state.logFile}`;
    if (!state.clipboard) cmd += " -noclipboard";
    if (state.noxdamage) cmd += " -noxdamage";
    if (state.scale !== "1") cmd += ` -scale ${state.scale}`;
    if (state.repeat) cmd += " -repeat";
    if (state.bg) cmd += " -bg";
    if (state.rfbauth) cmd += ` -rfbauth ${state.rfbauth}`;
    set({ command: cmd });
  },
}));
