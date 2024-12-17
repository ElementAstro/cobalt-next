import { create } from "zustand";
import CryptoJS from "crypto-js";
import { useCookies } from "react-cookie";

interface CookieData {
  name: string;
  value: string;
  selected?: boolean;
}

interface CookieState {
  cookies: CookieData[];
  loadCookies: () => void;
  addCookie: (cookie: CookieData) => void;
  updateCookie: (cookie: CookieData) => void;
  deleteCookie: (name: string) => void;
  selectAll: (selected: boolean) => void;
  toggleSelect: (name: string, selected: boolean) => void;
  deleteSelected: () => void;
  encryptCookie: (data: string, key: string) => string;
  decryptCookie: (data: string, key: string) => string | null;
}

export const useCookieStore = create<CookieState>((set, get) => {
  const [cookies, setCookie, removeCookie] = useCookies(["*"]);

  return {
    cookies: [],

    loadCookies: () => {
      const cookieList = Object.entries(cookies).map(([name, value]) => ({
        name,
        value: String(value),
        selected: false,
      }));
      set({ cookies: cookieList });
    },

    addCookie: (cookie) => {
      setCookie(cookie.name, cookie.value, { path: "/", sameSite: "strict" });
      get().loadCookies();
    },

    updateCookie: (cookie) => {
      setCookie(cookie.name, cookie.value, { path: "/", sameSite: "strict" });
      get().loadCookies();
    },

    deleteCookie: (name) => {
      removeCookie(name, { path: "/" });
      get().loadCookies();
    },

    selectAll: (selected) => {
      set({
        cookies: get().cookies.map((cookie) => ({ ...cookie, selected })),
      });
    },

    toggleSelect: (name, selected) => {
      set({
        cookies: get().cookies.map((cookie) =>
          cookie.name === name ? { ...cookie, selected } : cookie
        ),
      });
    },

    deleteSelected: () => {
      get()
        .cookies.filter((cookie) => cookie.selected)
        .forEach((cookie) => {
          removeCookie(cookie.name, { path: "/" });
        });
      get().loadCookies();
    },

    encryptCookie: (data, key) => {
      return CryptoJS.AES.encrypt(data, key).toString();
    },

    decryptCookie: (data, key) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, key);
        return bytes.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error("解密 Cookie 时出错:", error);
        return null;
      }
    },
  };
});
