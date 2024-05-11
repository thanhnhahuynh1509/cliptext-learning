import React from "react";
import Aside from "./_components/aside";
import Navbar from "./_components/navbar";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuShortcut,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Bell, Monitor, Settings } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | cliptext.com",
  description: "Your video and audio clip to text",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="w-full h-full bg-slate-50">
      <Aside />

      <div className="ml-14 h-full flex">
        {/* <DashboardBar /> */}

        <div className="flex-1">
          <Navbar />
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="w-full h-[calc(100%-80px)] p-6">{children}</div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <ContextMenuItem inset className="cursor-pointer">
                <Monitor className="w-4 h-4 mr-2" /> New project
                <ContextMenuShortcut>Ctrl+N</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem inset className="cursor-pointer">
                <Bell className="w-4 h-4 mr-2" /> Notification
                <ContextMenuShortcut>Ctrl+B</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem inset className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" /> Settings
                <ContextMenuShortcut>Ctrl+S</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
