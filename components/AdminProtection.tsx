"use client";

import { useAuthStore } from "@/app/api/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface AdminProtectionProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AdminProtection({
  children,
  fallback,
}: AdminProtectionProps) {
  const { isAuthenticated, isAdmin, user, hydrated, isLoading } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return; // Attendre la réhydratation

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/unauthorized");
      return;
    }

    if (!user?.onboarding) {
      router.push("/onboarding");
      return;
    }
  }, [isAuthenticated, user, hydrated, router, isAdmin]);

  //   // Afficher un loader pendant la vérification
  //   if (!hydrated || !isAuthenticated || !isAdmin() || !user?.onboarding) {
  //     return (
  //       fallback || (
  //         <div className="min-h-screen flex items-center justify-center">
  //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  //         </div>
  //       )
  //     );
  //   }

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
