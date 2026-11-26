"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Layers,
  LogOut,
  User,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  X,
  Gem,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingPaymentsCount: number;
  needsDropshipCount: number;
  productsCount: number;
  isBackendConnected: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  pendingPaymentsCount,
  needsDropshipCount,
  productsCount,
  isBackendConnected,
  mobileOpen,
  onCloseMobile,
  onLogout,
}: AdminSidebarProps) {
  const [copiedVpa, setCopiedVpa] = useState(false);

  const handleCopyVpa = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("swathykjose-6@okhdfcbank");
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const navItems = [
    {
      group: "MAIN MANAGEMENT",
      items: [
        {
          id: "overview",
          label: "Dashboard Overview",
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: "payments",
          label: "Payment Receiving",
          icon: CreditCard,
          badge:
            pendingPaymentsCount > 0 ? (
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center font-bold">
                {pendingPaymentsCount}
              </Badge>
            ) : null,
        },
        {
          id: "orders",
          label: "Orders & Dropship",
          icon: ShoppingBag,
          badge:
            needsDropshipCount > 0 ? (
              <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center font-bold">
                {needsDropshipCount}
              </Badge>
            ) : null,
        },
        {
          id: "products",
          label: "Jewelry Catalog",
          icon: Gem,
          badge: (
            <span className="text-[11px] text-muted-foreground font-mono">
              {productsCount}
            </span>
          ),
        },
      ],
    },
    {
      group: "ANALYTICS & STOREFRONT",
      items: [
        {
          id: "revenue",
          label: "Revenue & Margins",
          icon: TrendingUp,
          badge: null,
        },
        {
          id: "cms",
          label: "Homepage CMS",
          icon: Layers,
          badge: null,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold shadow-2xs">
              <Gem className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-neutral-900 tracking-tight">
                  Dainty Dazzle
                </span>
                <Badge
                  variant="outline"
                  className="text-[9px] font-mono px-1 py-0 uppercase"
                >
                  Hub
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Admin & Fulfillment
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCloseMobile}
            className="lg:hidden h-7 w-7 p-0 text-neutral-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-2.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {group.group}
              </p>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-neutral-900 text-white shadow-2xs font-semibold"
                          : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? "text-amber-200" : "text-neutral-400"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Store UPI Card */}
          <div className="mx-1 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Store UPI Active
              </span>
              <button
                type="button"
                onClick={handleCopyVpa}
                className="text-[10px] text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
              >
                {copiedVpa ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedVpa ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="font-mono text-[11px] text-neutral-800 truncate">
              swathykjose-6@okhdfcbank
            </p>
            <p className="text-[10px] text-muted-foreground">
              Swathy Jose • +91 9619408985
            </p>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t bg-neutral-50/60 space-y-2">
          {/* Connection status pill */}
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-neutral-600">
            <span className="text-muted-foreground">Server API:</span>
            {isBackendConnected ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Preview Mode
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-xs font-bold shrink-0">
                A
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  Admin Store
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  ankitbhavarthe123@gmail.com
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="h-7 w-7 p-0 text-neutral-500 hover:text-red-600 hover:bg-red-50 shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
