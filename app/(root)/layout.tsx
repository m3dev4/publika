"use client";

import { SessionNavBar } from "@/components/sessionNavBar";
import React, { useEffect } from "react";
import { useAuthStore } from "../api/store/auth.store";
import { useRouter } from "next/navigation";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  // useEffect(() => {
  //   if (isLoading) return;
  //   if (!isAuthenticated || !user) {
  //     router.push("/auth/login");
  //   }
  // }, [isLoading, isAuthenticated, user, router]);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
  //         <p className="mt-2 text-gray-600">Chargement...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <main className="min-h-screen w-full max-w-md mx-auto">
      <div className="flex items-center w-full justify-between">
        <div>
          <SessionNavBar />
        </div>

        {children}
      </div>
    </main>
  );
};

export default RootLayout;
