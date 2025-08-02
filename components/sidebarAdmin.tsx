"use client";

import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd, LayoutDashboard, Search } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuthStore } from "@/app/api/store/auth.store";

export function SidebarAdmin() {
    const { user } = useAuthStore();
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-2xl font-bold">Publika - Admin</h1>
      </SidebarHeader>
      <SidebarContent className="my-10">
        <div className="">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Link href="/admin" className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" /> 
                 <span className="text-sm font-bold">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Link href="/admin/category" className="flex items-center gap-2">
                <GalleryVerticalEnd className="h-5 w-5" /> 
                 <span className="text-sm font-bold">Category</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <div className="absolute bottom-0 flex items-center justify-center">
       <div className="flex items-center gap-2">
        <span>{user?.username}</span>
       </div>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
