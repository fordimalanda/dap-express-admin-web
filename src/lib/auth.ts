import { AdminUser } from "@/types";

const TOKEN_KEY = "dap_admin_token";
const USER_KEY = "dap_admin_user";

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  getUser: (): AdminUser | null => {
    if (typeof window === "undefined") return null;
    const str = localStorage.getItem(USER_KEY);
    return str ? JSON.parse(str) : null;
  },
  setUser: (user: AdminUser) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },
};
