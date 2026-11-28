import type {
  AdminOrder,
  AdminProduct,
  HeroBannerCMS,
  FeaturedSectionCMS,
  EditorialBannerCMS,
  StorySectionCMS,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  PaymentReceivingOverview,
} from "@/types/admin";

// Note: Server URL and Admin API Key are securely handled on the server side
// by the Next.js /api/backend proxy route, preventing exposure via NEXT_PUBLIC.

export const DEFAULT_STORE_UPI = {
  payeeName: "Swathy Jose",
  vpa: "swathykjose-6@okhdfcbank",
  phone: "9619408985",
  sampleUri:
    "upi://pay?pa=swathykjose-6%40okhdfcbank&pn=Swathy%20Jose&am=1299.00&cu=INR&tn=Dainty%20Dazzle%20Order",
};

export const EMPTY_PAYMENT_OVERVIEW: PaymentReceivingOverview = {
  storeUpi: DEFAULT_STORE_UPI,
  stats: {
    totalPaidInr: 0,
    pendingVerificationInr: 0,
    pendingVerificationCount: 0,
    paymentMethodCounts: {
      upi: 0,
      cod: 0,
      online: 0,
    },
    paymentStatusCounts: {
      pending: 0,
      paid: 0,
      failed: 0,
      refunded: 0,
    },
    totalTransactionsRecorded: 0,
  },
  recentTransactions: [],
  recentAuditLogs: [],
};

// ─── HTTP Helper (proxied via /api/backend to keep server credentials private) ──
async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<{ data: T | null; isFallback: boolean }> {
  try {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `/api/backend${cleanEndpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return { data, isFallback: false };
    }
  } catch {
    // Backend offline / network failed
  }

  return { data: null, isFallback: true };
}

// ─── API Client Exports ──────────────────────────────────────────────────────
export const adminApi = {
  // Orders
  async getOrders(status?: string): Promise<{
    orders: AdminOrder[];
    isLive: boolean;
  }> {
    const query = status && status !== "all" ? `?status=${status}` : "";
    const res = await adminFetch<{ orders: AdminOrder[] }>(
      `/api/admin/orders${query}`,
    );

    if (res.data?.orders && Array.isArray(res.data.orders)) {
      return { orders: res.data.orders, isLive: true };
    }

    return { orders: [], isLive: !res.isFallback };
  },

  async updateOrderDropship(
    orderId: string,
    payload: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus | string;
      paymentMethod?: PaymentMethod | string;
      supplierOrderId?: string;
      supplierOrderUrl?: string;
      supplierCost?: number;
      supplierNotes?: string;
      courierTrackingNumber?: string;
      courierTrackingUrl?: string;
      notes?: string;
    },
  ): Promise<{ success: boolean; order: AdminOrder }> {
    const res = await adminFetch<{ success: boolean; order: AdminOrder }>(
      `/api/admin/orders/${orderId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );

    if (res.data?.order) {
      return res.data;
    }

    throw new Error("Failed to update order on server");
  },

  // Payments & Receiving
  async getPaymentOverview(): Promise<{
    overview: PaymentReceivingOverview;
    isLive: boolean;
  }> {
    const res = await adminFetch<
      { success: boolean } & PaymentReceivingOverview
    >("/api/admin/payments/overview");

    if (res.data?.storeUpi) {
      return {
        overview: {
          storeUpi: res.data.storeUpi,
          stats: res.data.stats || EMPTY_PAYMENT_OVERVIEW.stats,
          recentTransactions: res.data.recentTransactions || [],
          recentAuditLogs: res.data.recentAuditLogs || [],
        },
        isLive: true,
      };
    }

    return { overview: EMPTY_PAYMENT_OVERVIEW, isLive: !res.isFallback };
  },

  async verifyPayment(
    orderId: string,
    payload: {
      paymentStatus: "paid" | "failed" | "refunded";
      utr?: string;
      notes?: string;
      autoConfirmOrder?: boolean;
    },
  ): Promise<{ success: boolean; order: AdminOrder }> {
    const res = await adminFetch<{ success: boolean; order: AdminOrder }>(
      `/api/admin/orders/${orderId}/verify-payment`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (res.data?.order) {
      return res.data;
    }

    throw new Error("Failed to verify payment on server");
  },

  // Products
  async getProducts(): Promise<{
    products: AdminProduct[];
    isLive: boolean;
  }> {
    const res = await adminFetch<{ products: AdminProduct[] }>(
      `/api/products?first=100`,
    );

    if (res.data?.products && Array.isArray(res.data.products)) {
      return { products: res.data.products, isLive: true };
    }

    return { products: [], isLive: !res.isFallback };
  },

  async upsertProduct(product: Partial<AdminProduct>): Promise<AdminProduct> {
    const res = await adminFetch<{ success: boolean; product: AdminProduct }>(
      `/api/admin/products`,
      {
        method: "POST",
        body: JSON.stringify(product),
      },
    );

    if (res.data?.product) {
      return res.data.product;
    }

    throw new Error("Failed to save product to server");
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const res = await adminFetch<{ success: boolean }>(
      `/api/admin/products/${productId}`,
      {
        method: "DELETE",
      },
    );

    return res.data?.success ?? false;
  },

  async getCategories(): Promise<Array<{ id: string; handle: string; title: string }>> {
    const res = await adminFetch<Array<{ id: string; handle: string; title: string }>>(`/api/collections`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    return [
      { id: "col_earrings", handle: "earrings", title: "Earrings" },
      { id: "col_necklaces", handle: "necklaces", title: "Necklaces" },
      { id: "col_rings", handle: "rings", title: "Rings" },
      { id: "col_bracelets", handle: "bracelets", title: "Bracelets" },
    ];
  },

  // Image Upload (Cloudinary via backend /api/admin/upload)
  async uploadImage(
    fileDataUrl: string,
    folder: string = "dainty-dazzle",
  ): Promise<{ url: string; publicId: string }> {
    const res = await adminFetch<{
      success: boolean;
      image: { url: string; publicId: string };
      error?: { message: string };
    }>(`/api/admin/upload`, {
      method: "POST",
      body: JSON.stringify({ file: fileDataUrl, folder }),
    });

    if (res.data?.image?.url) {
      return res.data.image;
    }

    throw new Error(
      res.data?.error?.message || "Failed to upload image to Cloudinary",
    );
  },

  // CMS
  async getAllCMS(): Promise<{
    sections: Record<string, any>;
    isLive: boolean;
  }> {
    const res = await adminFetch<Record<string, any>>(`/api/cms`);
    if (res.data && !res.isFallback && typeof res.data === "object") {
      return { sections: res.data, isLive: true };
    }

    // Fallback for older backend deployments without GET /api/cms
    const keys = ["hero", "featured", "editorial", "story", "bottom-banner", "shipping"] as const;
    const results = await Promise.all(keys.map((k) => adminApi.getCMS(k)));
    const sections: Record<string, any> = {};
    let anyLive = false;
    keys.forEach((k, idx) => {
      if (results[idx].isLive && results[idx].data) {
        sections[k] = results[idx].data;
        anyLive = true;
      }
    });
    return { sections, isLive: anyLive };
  },

  async getCMS(section: "hero" | "featured" | "editorial" | "story" | "bottom-banner" | "shipping"): Promise<{
    data: any;
    isLive: boolean;
  }> {
    const res = await adminFetch<any>(`/api/cms/${section}`);
    if (res.data && Object.keys(res.data).length > 0) {
      return { data: res.data, isLive: true };
    }
    return { data: null, isLive: false };
  },

  async updateCMS(
    section: "hero" | "featured" | "editorial" | "story" | "bottom-banner" | "shipping",
    data: any,
  ): Promise<boolean> {
    const res = await adminFetch<{ success: boolean }>(
      `/api/admin/cms/${section}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    return res.data?.success ?? false;
  },

  // Borzo Delivery API
  async getBorzoStatus(): Promise<{ configured: boolean; environment: string }> {
    const res = await adminFetch<{ success: boolean; configured: boolean; environment: string }>(
      `/api/admin/borzo/status`,
    );
    return {
      configured: Boolean(res.data?.configured),
      environment: res.data?.environment || "test",
    };
  },

  async calculateBorzo(orderId: string): Promise<{ deliveryFeeAmount: string; paymentAmount: string }> {
    const url = `/api/backend/api/admin/orders/${orderId}/borzo/calculate`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(json?.error?.message || "Failed to calculate Borzo delivery fee");
    }
    return json.quote;
  },

  async bookBorzo(orderId: string): Promise<{ borzo: any; order: AdminOrder }> {
    const url = `/api/backend/api/admin/orders/${orderId}/borzo/book`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(json?.error?.message || "Failed to book Borzo delivery");
    }
    return { borzo: json.borzo, order: json.order };
  },
};
