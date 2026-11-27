"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  ShieldCheck,
  Copy,
  Check,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingPaymentsCount: number;
  needsDropshipCount: number;
  productsCount: number;
  isBackendConnected?: boolean;
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
          badge: null,
        },
        {
          id: "payments",
          label: "Payment Receiving",
          badge:
            pendingPaymentsCount > 0 ? (
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px] px-1.5 py-0 h-4.5 min-w-4.5 flex items-center justify-center font-bold">
                {pendingPaymentsCount}
              </Badge>
            ) : null,
        },
        {
          id: "orders",
          label: "Orders & Dropship",
          badge:
            needsDropshipCount > 0 ? (
              <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-[10px] px-1.5 py-0 h-4.5 min-w-4.5 flex items-center justify-center font-bold">
                {needsDropshipCount}
              </Badge>
            ) : null,
        },
        {
          id: "products",
          label: "Jewelry Catalog",
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
          badge: null,
        },
        {
          id: "cms",
          label: "Homepage CMS",
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
        {/* Mobile-only close button header */}
        <div className="lg:hidden p-3 border-b flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCloseMobile}
            className="h-7 w-7 p-0 text-neutral-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <p className="px-3 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                {group.group}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                        isActive
                          ? "bg-neutral-900 text-white shadow-2xs font-medium"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 font-normal"
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {item.badge}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Store UPI Card */}
          <div className="mx-1 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Store UPI Active
              </span>
              <button
                type="button"
                onClick={handleCopyVpa}
                className="text-[10px] text-emerald-700 hover:text-emerald-950 font-medium flex items-center gap-0.5 cursor-pointer"
              >
                {copiedVpa ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedVpa ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="font-mono text-[11px] font-medium text-neutral-800 truncate">
              swathykjose-6@okhdfcbank
            </p>
            <p className="text-[10px] text-neutral-500">
              Swathy Jose • +91 9619408985
            </p>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t bg-neutral-50/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-xs font-semibold shrink-0">
                A
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  Admin Store
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  ankitbhavarthe123@gmail.com
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="h-8 w-8 p-0 text-neutral-400 hover:text-red-600 hover:bg-red-50 shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          <div className="pt-2 border-t border-neutral-200/60 text-center">
            <p className="text-[11px] text-neutral-400">
              Developed by{" "}
              <a
                href="https://kairosartifex.site"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-neutral-600 hover:text-neutral-900 underline underline-offset-2 transition-colors"
              >
                Kairos
              </a>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
