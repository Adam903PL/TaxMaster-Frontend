import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  loggedIn: boolean;
  userId: string | null;
  setLoggedIn: (value: boolean) => void;
  setUserId: (id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      loggedIn: false,
      userId: null,
      setLoggedIn: (value) => set({ loggedIn: value }),
      setUserId: (id) => set({ userId: id }),
      logout: () => set({ loggedIn: false, userId: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);