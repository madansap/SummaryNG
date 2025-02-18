"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Plus,
} from "lucide-react";

interface Summary {
  id: string;
  title: string;
  content: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  summaries: Summary[];
}

export function Sidebar({ summaries }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative h-screen border-r bg-muted/40 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <div className="space-y-4 py-4">
        <div className="px-4">
          {!isCollapsed && (
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Menu
            </h2>
          )}
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button variant="ghost" className={cn(
                "w-full",
                isCollapsed ? "justify-center px-2" : "justify-start"
              )}>
                <Home className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "Dashboard"}
              </Button>
            </Link>
            <Link href="/dashboard/new">
              <Button variant="ghost" className={cn(
                "w-full",
                isCollapsed ? "justify-center px-2" : "justify-start"
              )}>
                <Plus className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "New Summary"}
              </Button>
            </Link>
            <Link href="/dashboard/summaries">
              <Button variant="ghost" className={cn(
                "w-full",
                isCollapsed ? "justify-center px-2" : "justify-start"
              )}>
                <FileText className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "All Summaries"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 