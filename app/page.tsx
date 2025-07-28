"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/api/store/auth.store";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    // Attendre que le store soit hydraté
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      // Pas authentifié -> rediriger vers login
      router.push("/auth/login");
    } else if (!user.onboarding) {
      // Authentifié mais pas d'onboarding -> rediriger vers onboarding
      router.push("/onboarding");
    } else {
      // Authentifié et onboarding terminé -> rediriger vers home
      router.push("/home");
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Afficher un loader pendant la vérification
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}
