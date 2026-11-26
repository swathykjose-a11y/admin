"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  LogOut,
  Menu,
  RefreshCw,
  CreditCard,
  Plus,
  ShieldCheck,
  Search,
} from "lucide-react";

interface AdminHeaderProps {
  isBackendConnected: boolean;
  activeTab: string;
  onOpenMobileSidebar: () => void;
  pendingPaymentsCount: number;
  onNavigateTab: (tab: string) => void;
  onRefresh: () => void;
  onLogout: () => void;
  onOpenAddProduct?: () => void;
}

export function AdminHeader({
  isBackendConnected,
  activeTab,
  onOpenMobileSidebar,
  pendingPaymentsCount,
  onNavigateTab,
  onRefresh,
  onLogout,
  onOpenAddProduct,
}: AdminHeaderProps) {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "overview":
        return { title: "Dashboard Overview", subtitle: "Real-time revenue, orders & dropship metrics" };
      case "payments":
        return { title: "Payment Receiving & Reconciliation", subtitle: "Direct UPI receiving, bank verifications & gateway logs" };
      case "orders":
        return { title: "Orders & Dropship Fulfillment", subtitle: "Customer orders, supplier procurement & tracking" };
      case "products":
        return { title: "Jewelry Catalog & Inventory", subtitle: "Manage products, variant pricing & stock" };
      case "revenue":
        return { title: "Revenue, Profit & Margins", subtitle: "Gross sales, supplier costs & net margins" };
      case "cms":
        return { title: "Homepage CMS & Editorial", subtitle: "Hero banners, featured showcases & brand story" };
      default:
        return { title: "Dashboard", subtitle: "Dainty Dazzle Hub" };
    }
  };

  const { title, subtitle } = getTabTitle(activeTab);

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenMobileSidebar}
          className="lg:hidden h-8 w-8 p-0 text-neutral-600"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Title & Subtitle */}
        <div className="truncate">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight truncate">
              {title}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Pending payments alert shortcut */}
        {pendingPaymentsCount > 0 && activeTab !== "payments" && (
          <Button
            size="sm"
            onClick={() => onNavigateTab("payments")}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs h-8 px-2.5 gap-1.5 shadow-2xs hidden sm:flex"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Verify {pendingPaymentsCount} Payment{pendingPaymentsCount > 1 ? "s" : ""}</span>
          </Button>
        )}

        {/* Add Product Shortcut if in products */}
        {activeTab === "products" && onOpenAddProduct && (
          <Button
            size="sm"
            onClick={onOpenAddProduct}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs h-8 px-2.5 gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Product</span>
          </Button>
        )}

        {/* Refresh Data button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="h-8 px-2.5 text-xs text-neutral-600 gap-1.5"
          title="Refresh Dashboard Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sync</span>
        </Button>

        {/* Backend Status indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono bg-neutral-50 border rounded-full px-2.5 py-1">
          <Server className="w-3 h-3 text-muted-foreground" />
          {isBackendConnected ? (
            <span className="flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-600 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Preview
            </span>
          )}
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="h-8 px-2 text-xs text-neutral-500 hover:text-red-600 hover:bg-red-50"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden xl:inline ml-1">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
