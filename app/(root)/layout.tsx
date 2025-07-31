import { SessionNavBar } from "@/components/sessionNavBar";
import { Sidebar } from "@/components/ui/sidebar";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
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
