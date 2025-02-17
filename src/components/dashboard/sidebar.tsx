"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Home
} from "lucide-react";
import type { Summary } from "@/drizzle/schema";

interface SidebarProps {
  summaries: Summary[];
}

export function Sidebar({ summaries }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative">
      <aside className={cn(
        "h-screen border-r bg-gray-50 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="p-4 space-y-4">
          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link href="/dashboard" className={cn(
              "flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors",
              isCollapsed && "justify-center"
            )}>
              <Home className="h-5 w-5" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
            
            <Link href="/dashboard/summaries" className={cn(
              "flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors",
              isCollapsed && "justify-center"
            )}>
              <FileText className="h-5 w-5" />
              {!isCollapsed && <span>Summaries</span>}
            </Link>
          </nav>

          <div className="pt-4 border-t">
            {!isCollapsed && <h2 className="text-sm font-medium mb-2">Recent Summaries</h2>}
            <div className="space-y-1">
              {!isCollapsed && summaries.slice(0, 5).map((summary) => (
                <Link
                  key={summary.id}
                  href={`/dashboard/summary/${summary.id}`}
                  className="block p-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-medium line-clamp-1">{summary.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(summary.createdAt).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute -right-4 top-4 rounded-full bg-white shadow-md border"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </aside>
    </div>
  );
} 