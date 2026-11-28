"use client";

import { Button } from "@/components/ui/button";
import {
  LogOut,
  Menu,
  RefreshCw,
  Plus,
  ShieldCheck,
} from "lucide-react";

interface AdminHeaderProps {
  isBackendConnected?: boolean;
  activeTab: string;
  onOpenMobileSidebar: () => void;
  pendingPaymentsCount: number;
  onNavigateTab: (tab: string) => void;
  onRefresh: () => void;
  onLogout: () => void;
  onOpenAddProduct?: () => void;
}

export function AdminHeader({
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
        return {
          title: "Dashboard",
          subtitle: "Real-time revenue, orders & fulfillment metrics",
        };
      case "payments":
        return {
          title: "Payment",
          subtitle: "Direct UPI receiving, bank verifications & gateway logs",
        };
      case "orders":
        return {
          title: "Orders",
          subtitle: "Customer orders, verification & shipping tracking",
        };
      case "products":
        return {
          title: "Products",
          subtitle: "Manage products, category pricing & stock",
        };
      case "revenue":
        return {
          title: "Revenue & Margins",
          subtitle: "Gross sales, verified payments & product performance",
        };
      case "cms":
        return {
          title: "CMS",
          subtitle: "Hero banners, featured showcases & brand story",
        };
      default:
        return { title: "Dashboard", subtitle: "Dainty Dazzle Hub" };
    }
  };

  const { title, subtitle } = getTabTitle(activeTab);

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-2xs">
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
          <h1 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight truncate">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block truncate mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Pending payments alert shortcut */}
        {pendingPaymentsCount > 0 && activeTab !== "payments" && (
          <Button
            size="sm"
            onClick={() => onNavigateTab("payments")}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs h-8 px-3 gap-1.5 shadow-2xs hidden sm:flex font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>
              Verify {pendingPaymentsCount} Payment{pendingPaymentsCount > 1 ? "s" : ""}
            </span>
          </Button>
        )}

        {/* Add Product Shortcut if in products */}
        {activeTab === "products" && onOpenAddProduct && (
          <Button
            size="sm"
            onClick={onOpenAddProduct}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs h-8 px-3 gap-1.5 shadow-2xs"
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
          className="h-8 px-3 text-xs text-neutral-600 hover:text-neutral-900 gap-1.5 shadow-2xs"
          title="Refresh Dashboard Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sync</span>
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="h-8 px-2 text-xs text-neutral-500 hover:text-red-600 hover:bg-red-50"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden xl:inline ml-1.5">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
