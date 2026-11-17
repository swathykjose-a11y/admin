"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles, Server } from "lucide-react";

interface AdminHeaderProps {
  isBackendConnected: boolean;
}

export function AdminHeader({ isBackendConnected }: AdminHeaderProps) {
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
            Manage jewelry catalog, dropship fulfillment & homepage banners
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="flex items-center gap-2 text-xs font-mono bg-neutral-50 border rounded-full px-3 py-1">
          <Server className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">API:</span>
          {isBackendConnected ? (
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected (8787)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Preview Mode
            </span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground font-mono">
          <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
          <span>v1.0.0</span>
        </div>
      </div>
    </header>
  );
}
