"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "../api/store/auth.store";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSidebar";

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
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full bg-neutral-950">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default RootLayout;
