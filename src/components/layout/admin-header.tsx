"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, LogOut, User } from "lucide-react";

interface AdminHeaderProps {
  isBackendConnected: boolean;
}

export function AdminHeader({ isBackendConnected }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b bg-card px-6 py-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-neutral-900 text-white flex items-center justify-center font-serif text-lg font-bold">
          D
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-semibold tracking-tight text-neutral-900">
              Dainty Dazzle
            </h1>
            <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">
              Admin & Dropship Hub
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage jewelry catalog, dropship fulfillment, revenue & homepage banners
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Connection status */}
        <div className="flex items-center gap-2 text-xs font-mono bg-neutral-50 border rounded-full px-3 py-1">
          <Server className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">API:</span>
          {isBackendConnected ? (
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Preview Mode
            </span>
          )}
        </div>

        {/* User indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-md">
          <User className="w-3 h-3 text-neutral-500" />
          <span className="font-medium text-[11px]">ankitbhavarthe123@gmail.com</span>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-xs text-neutral-600 hover:text-red-600 hover:border-red-200 gap-1.5 h-8 px-2.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
