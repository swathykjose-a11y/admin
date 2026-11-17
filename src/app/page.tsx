"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/layout/admin-header";
import { OrdersView } from "@/components/orders/orders-view";
import { ProductsView } from "@/components/products/products-view";
import { CmsView } from "@/components/cms/cms-view";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { adminApi } from "@/lib/api";
import type { AdminOrder, AdminProduct, OrderStatus } from "@/types/admin";
import {
  ShoppingBag,
  AlertTriangle,
  IndianRupee,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        adminApi.getOrders(),
        adminApi.getProducts(),
      ]);

      setOrders(ordersRes.orders);
      setProducts(productsRes.products);
      setIsBackendConnected(ordersRes.isLive || productsRes.isLive);
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
      supplierOrderId?: string;
      supplierOrderUrl?: string;
      supplierCost?: number;
      supplierNotes?: string;
      courierTrackingNumber?: string;
      courierTrackingUrl?: string;
    },
  ) => {
    const res = await adminApi.updateOrderDropship(orderId, payload);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...res.order } : o)),
    );
  };

  const handleAddProduct = async (productData: Partial<AdminProduct>) => {
    const created = await adminApi.upsertProduct(productData);
    setProducts((prev) => [created, ...prev]);
  };

  const handleDeleteProduct = async (id: string) => {
    await adminApi.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveCms = async (
    section: "hero" | "featured" | "editorial" | "story",
    data: any,
  ) => {
    return await adminApi.updateCMS(section, data);
  };

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingDropshipOrders = orders.filter(
    (o) => o.status === "confirmed",
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col">
      <AdminHeader isBackendConnected={isBackendConnected} />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Total Revenue
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 mt-1">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Total Orders
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 mt-1">
                  {orders.length}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={
              pendingDropshipOrders > 0
                ? "border-amber-300 bg-amber-50/30"
                : ""
            }
          >
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Needs Supplier Order
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-700 mt-1">
                  {pendingDropshipOrders}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Catalog Products
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 mt-1">
                  {products.length}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs Navigation */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="bg-neutral-100/80 p-1 border">
            <TabsTrigger value="orders" className="text-xs gap-1.5 font-medium">
              <ShoppingBag className="w-3.5 h-3.5" />
              Orders & Dropship ({orders.length})
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="text-xs gap-1.5 font-medium"
            >
              <Layers className="w-3.5 h-3.5" />
              Products Catalog ({products.length})
            </TabsTrigger>
            <TabsTrigger value="cms" className="text-xs gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Homepage Banners (CMS)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersView
              orders={orders}
              onUpdateOrder={handleUpdateOrder}
              onRefresh={loadData}
            />
          </TabsContent>

          <TabsContent value="products">
            <ProductsView
              products={products}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </TabsContent>

          <TabsContent value="cms">
            <CmsView onSaveCms={handleSaveCms} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
