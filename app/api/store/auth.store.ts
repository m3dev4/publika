import { User } from "@/types/user.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string | null;
  hydrated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setPendingVerification: (email: string) => void;
  setEmailVerified: (user: User) => void;
  logout: () => void;
  setHydrated: () => void;

  // Getters
  needsEmailVerification: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      pendingEmail: null,
      hydrated: false,

      setUser: (user) => {
        console.log("Setting user in store:", user);
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setPendingVerification: (email) => {
        set({
          pendingEmail: email,
          user: null,
          isAuthenticated: false,
        });
      },

      setEmailVerified: (user) => {
        set({
          user,
          isAuthenticated: true,
          pendingEmail: null,
        });
        // Forcer la sauvegarde dans localStorage
        if (typeof window !== 'undefined') {
          const storageData = {
            user,
            isAuthenticated: true,
            pendingEmail: null,
          };
          localStorage.setItem('auth-storage', JSON.stringify({ state: storageData, version: 0 }));
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          pendingEmail: null,
        });
      },

      setHydrated: () => {
        set({ hydrated: true });
      },

      // Vérifie si on attend une vérification d'email
      needsEmailVerification: () => {
        const { pendingEmail } = get();
        return !!pendingEmail;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        pendingEmail: state.pendingEmail,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrating auth store:", state);
        if (state?.user) {
          console.log("User found in storage:", state.user);
        }
        // Marquer comme hydraté après la réhydratation
        setTimeout(() => {
          useAuthStore.getState().setHydrated();
        }, 0);
      },
    }
  )
);
