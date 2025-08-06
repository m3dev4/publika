import AdminProtection from "@/components/AdminProtection";
import { SidebarAdmin } from "@/components/sidebarAdmin";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminProtection>
      <div className="min-h-screen w-screen">
        <SidebarProvider>
          <SidebarAdmin />
          <SidebarInset className="overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-background" />
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AdminProtection>
  );
};

export default AdminLayout;
