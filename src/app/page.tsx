"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PaymentsView } from "@/components/payments/payments-view";
import { OrdersView } from "@/components/orders/orders-view";
import { ProductsView } from "@/components/products/products-view";
import { RevenueView } from "@/components/revenue/revenue-view";
import { CmsView } from "@/components/cms/cms-view";
import { PaymentVerifyDialog } from "@/components/payments/payment-verify-dialog";
import { UpiQrDialog } from "@/components/payments/upi-qr-dialog";
import { adminApi } from "@/lib/api";
import type {
  AdminOrder,
  AdminProduct,
  OrderStatus,
  PaymentReceivingOverview,
} from "@/types/admin";
import { Loader2 } from "lucide-react";

const VALID_TABS = [
  "overview",
  "payments",
  "orders",
  "products",
  "revenue",
  "cms",
] as const;

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation state with URL and localStorage persistence
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Restore tab from URL query param (?tab=...) or localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const queryTab = params.get("tab");
    const hashTab = window.location.hash.replace("#", "");
    const savedTab = localStorage.getItem("dd_admin_active_tab");

    const candidate = queryTab || hashTab || savedTab;
    if (candidate && (VALID_TABS as readonly string[]).includes(candidate)) {
      setActiveTab(candidate);
      if (queryTab !== candidate) {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", candidate);
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, []);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("dd_admin_active_tab", tab);
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  // Data state
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [paymentOverview, setPaymentOverview] =
    useState<PaymentReceivingOverview | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Global Dialog Modals state
  const [verifyModalOrder, setVerifyModalOrder] = useState<AdminOrder | null>(
    null,
  );
  const [showQrModal, setShowQrModal] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, productsRes, paymentsRes] = await Promise.all([
        adminApi.getOrders(),
        adminApi.getProducts(),
        adminApi.getPaymentOverview(),
      ]);

      setOrders(ordersRes.orders);
      setProducts(productsRes.products);
      setPaymentOverview(paymentsRes.overview);
      setIsBackendConnected(
        ordersRes.isLive || productsRes.isLive || paymentsRes.isLive,
      );
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateOrder = async (
    orderId: string,
    payload: {
      status: OrderStatus;
      paymentStatus?: string;
      supplierOrderId?: string;
      supplierOrderUrl?: string;
      supplierCost?: number;
      supplierNotes?: string;
      courierTrackingNumber?: string;
      courierTrackingUrl?: string;
      notes?: string;
    },
  ) => {
    const res = await adminApi.updateOrderDropship(orderId, payload);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...res.order } : o)),
    );
  };

  const handleVerifyPayment = async (
    orderId: string,
    payload: {
      paymentStatus: "paid" | "failed" | "refunded";
      utr?: string;
      notes?: string;
      autoConfirmOrder?: boolean;
    },
  ) => {
    const res = await adminApi.verifyPayment(orderId, payload);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...res.order } : o)),
    );

    // Refresh payment stats in background
    adminApi.getPaymentOverview().then((res) => {
      setPaymentOverview(res.overview);
    });
  };

  const handleAddProduct = async (productData: Partial<AdminProduct>) => {
    const created = await adminApi.upsertProduct(productData);
    setProducts((prev) => [created, ...prev]);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const ok = await adminApi.deleteProduct(id);
      if (!ok) {
        alert("Server could not delete this product. Please check your connection.");
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(`Error deleting product: ${err?.message || "Server error"}`);
    }
  };

  const handleSaveCms = async (
    section: "hero" | "featured" | "editorial" | "story",
    data: any,
  ) => {
    return await adminApi.updateCMS(section, data);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/login");
    router.refresh();
  };

  // Counts for sidebar badges
  const pendingPaymentsCount = orders.filter(
    (o) => o.paymentStatus === "pending" || !o.paymentStatus,
  ).length;
  const needsDropshipCount = orders.filter(
    (o) => o.status === "confirmed",
  ).length;

  const storeUpi = paymentOverview?.storeUpi || {
    payeeName: "Swathy Jose",
    vpa: "swathykjose-6@okhdfcbank",
    phone: "9619408985",
  };

  return (
    <div className="min-h-screen bg-neutral-50/40 text-neutral-900 flex">
      {/* ─── Modern Left Sidebar Navigation ─── */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        pendingPaymentsCount={pendingPaymentsCount}
        needsDropshipCount={needsDropshipCount}
        productsCount={products.length}
        isBackendConnected={isBackendConnected}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* ─── Main Content Canvas (offset by sidebar width on lg+) ─── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky App Header */}
        <AdminHeader
          isBackendConnected={isBackendConnected}
          activeTab={activeTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          pendingPaymentsCount={pendingPaymentsCount}
          onNavigateTab={handleSelectTab}
          onRefresh={loadData}
          onLogout={handleLogout}
          onOpenAddProduct={
            activeTab === "products"
              ? () => {
                  const addBtn = document.getElementById("admin-add-product-btn");
                  if (addBtn) addBtn.click();
                }
              : undefined
          }
        />

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {isLoading && orders.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
              <p className="text-xs font-medium">Loading Dainty Dazzle Dashboard...</p>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <DashboardOverview
                  orders={orders}
                  products={products}
                  paymentOverview={paymentOverview}
                  onNavigateTab={handleSelectTab}
                  onOpenVerifyModal={(order) => setVerifyModalOrder(order)}
                  onOpenQrModal={() => setShowQrModal(true)}
                />
              )}

              {activeTab === "payments" && (
                <PaymentsView
                  orders={orders}
                  overview={paymentOverview}
                  onVerifyPayment={handleVerifyPayment}
                  onRefresh={loadData}
                />
              )}

              {activeTab === "orders" && (
                <OrdersView
                  orders={orders}
                  onUpdateOrder={handleUpdateOrder}
                  onVerifyPayment={handleVerifyPayment}
                  onRefresh={loadData}
                />
              )}

              {activeTab === "products" && (
                <ProductsView
                  products={products}
                  onAddProduct={handleAddProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onRefresh={loadData}
                />
              )}

              {activeTab === "revenue" && <RevenueView orders={orders} />}

              {activeTab === "cms" && <CmsView onSaveCms={handleSaveCms} />}
            </>
          )}
        </main>
      </div>

      {/* Global Payment Verify Dialog */}
      <PaymentVerifyDialog
        order={verifyModalOrder}
        isOpen={!!verifyModalOrder}
        onClose={() => setVerifyModalOrder(null)}
        onVerify={handleVerifyPayment}
      />

      {/* Global QR Code Dialog */}
      <UpiQrDialog
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        vpa={storeUpi.vpa}
        payeeName={storeUpi.payeeName}
        phone={storeUpi.phone}
      />
    </div>
  );
}
