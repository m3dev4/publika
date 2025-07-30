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
        const newState = {
          user,
          isAuthenticated: !!user,
        };
        set(newState);
        
        // Synchroniser avec les cookies
        if (typeof window !== 'undefined') {
          const currentState = useAuthStore.getState();
          const serializedData = JSON.stringify({ state: currentState, version: 0 });
          document.cookie = `auth-storage=${encodeURIComponent(serializedData)}; path=/; max-age=604800; SameSite=Lax`;
          console.log('Synced setUser to cookies');
        }
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
        console.log("Logging out - clearing all session data");
        
        // Vider le store Zustand
        set({
          user: null,
          isAuthenticated: false,
          pendingEmail: null,
          hydrated: false,
        });
        
        // Nettoyer le localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          
          // Nettoyer tous les cookies d'authentification
          document.cookie = 'auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          
          // Nettoyer d'autres cookies potentiels
          document.cookie = 'onboarding_completed=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          
          console.log("Session data cleared from localStorage and cookies");
        }
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
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Rehydration error:', error);
        } else {
          console.log("Rehydrating auth store:", state);
          
          // Synchroniser avec les cookies après la réhydratation
          if (state && typeof window !== 'undefined') {
            const serializedData = JSON.stringify({ state, version: 0 });
            document.cookie = `auth-storage=${encodeURIComponent(serializedData)}; path=/; max-age=604800; SameSite=Lax`;
            console.log('Synced auth data to cookies');
          }
        }
        // Toujours marquer comme hydraté
        return { ...state, hydrated: true };
      },
    }
  )
);
