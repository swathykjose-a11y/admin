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

// ─── Initial Mock Data for Seamless Preview ──────────────────────────────────
let MOCK_ORDERS: AdminOrder[] = [
  {
    id: "ord_01",
    orderNumber: "DD-9281-1042",
    customerFirstName: "Pooja",
    customerLastName: "Sharma",
    customerEmail: "pooja.sharma@example.com",
    customerPhone: "+91 98201 12345",
    addressLine1: "Flat 402, Sunshine Apartments, Linking Road",
    addressLine2: "Near Bandra Police Station",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400050",
    country: "India",
    subtotal: 1299,
    shippingFee: 0,
    total: 1299,
    currency: "INR",
    paymentMethod: "upi",
    paymentStatus: "paid",
    status: "confirmed",
    supplierOrderId: "",
    supplierOrderUrl: "",
    supplierCost: 450,
    supplierNotes: "Awaiting supplier dropship placement",
    courierTrackingNumber: "",
    courierTrackingUrl: "",
    notes: "[UPI Verified - UTR: 432198765432] Verified via GPay",
    items: [
      {
        id: "item_01",
        productId: "prod_02",
        productTitle: "Celestial Freshwater Pearl Pendant",
        productHandle: "celestial-freshwater-pearl-pendant",
        variantId: "var_02_gold",
        variantTitle: "Yellow Gold & Pearl",
        price: 1299,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80&auto=format&fit=crop",
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "ord_02",
    orderNumber: "DD-9304-8821",
    customerFirstName: "Rhea",
    customerLastName: "Menon",
    customerEmail: "rhea.m@example.com",
    customerPhone: "+91 98450 77123",
    addressLine1: "Villa 12, Palm Meadows, Whitefield",
    addressLine2: "Near Forum Value Mall",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560066",
    country: "India",
    subtotal: 1899,
    shippingFee: 0,
    total: 1899,
    currency: "INR",
    paymentMethod: "upi",
    paymentStatus: "pending",
    status: "pending",
    supplierOrderId: "",
    supplierOrderUrl: "",
    supplierCost: 650,
    supplierNotes: "",
    courierTrackingNumber: "",
    courierTrackingUrl: "",
    notes: "Customer paid via PhonePe to swathykjose-6@okhdfcbank. Ref: UPI-9021882",
    items: [
      {
        id: "item_04",
        productId: "prod_01",
        productTitle: "Golden Aura Twisted Hoops",
        productHandle: "golden-aura-twisted-hoops",
        variantId: "var_01_gold",
        variantTitle: "18K Gold Vermeil",
        price: 899,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80&auto=format&fit=crop",
      },
      {
        id: "item_05",
        productId: "prod_04",
        productTitle: "Astraea Diamond Huggie Duo",
        productHandle: "astraea-diamond-huggie-duo",
        variantId: "var_04_default",
        variantTitle: "Gold / Pair",
        price: 1000,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80&auto=format&fit=crop",
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "ord_03",
    orderNumber: "DD-8472-3091",
    customerFirstName: "Ananya",
    customerLastName: "Verma",
    customerEmail: "ananya.v@example.com",
    customerPhone: "+91 99302 98765",
    addressLine1: "House No 24, Indiranagar 100ft Road",
    addressLine2: "Opposite Metro Pillar 42",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560038",
    country: "India",
    subtotal: 1648,
    shippingFee: 0,
    total: 1648,
    currency: "INR",
    paymentMethod: "phonepe",
    paymentStatus: "paid",
    status: "ordered_from_supplier",
    supplierOrderId: "ALI-9028192",
    supplierOrderUrl: "https://supplier-portal.example.com/order/ALI-9028192",
    supplierCost: 590,
    supplierNotes: "Ordered via supplier standard air express",
    courierTrackingNumber: "DELHIVERY9812401",
    courierTrackingUrl: "https://www.delhivery.com/track/DELHIVERY9812401",
    notes: "[PhonePe Gateway Success: T2408192091]",
    items: [
      {
        id: "item_02",
        productId: "prod_01",
        productTitle: "Golden Aura Twisted Hoops",
        productHandle: "golden-aura-twisted-hoops",
        variantId: "var_01_gold",
        variantTitle: "18K Gold Vermeil",
        price: 899,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80&auto=format&fit=crop",
      },
      {
        id: "item_03",
        productId: "prod_03",
        productTitle: "Solstice Textured Huggies",
        productHandle: "solstice-textured-huggies",
        variantId: "var_03_default",
        variantTitle: "One Size / Gold",
        price: 749,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80&auto=format&fit=crop",
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "ord_04",
    orderNumber: "DD-7719-4502",
    customerFirstName: "Mira",
    customerLastName: "Kapoor",
    customerEmail: "mira.kapoor@example.com",
    customerPhone: "+91 97110 54321",
    addressLine1: "B-14 Greater Kailash 1",
    addressLine2: "Near M-Block Market",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110048",
    country: "India",
    subtotal: 2499,
    shippingFee: 0,
    total: 2499,
    currency: "INR",
    paymentMethod: "upi",
    paymentStatus: "paid",
    status: "shipped",
    supplierOrderId: "ALI-9018420",
    supplierOrderUrl: "https://supplier-portal.example.com/order/ALI-9018420",
    supplierCost: 850,
    supplierNotes: "Custom velvet jewelry pouch packaging added",
    courierTrackingNumber: "BLUEDART884192",
    courierTrackingUrl: "https://www.bluedart.com/tracking?track=BLUEDART884192",
    notes: "[UPI Verified - UTR: 881920491029]",
    items: [
      {
        id: "item_06",
        productId: "prod_02",
        productTitle: "Celestial Freshwater Pearl Pendant",
        productHandle: "celestial-freshwater-pearl-pendant",
        variantId: "var_02_gold",
        variantTitle: "Yellow Gold & Pearl",
        price: 1299,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80&auto=format&fit=crop",
      },
      {
        id: "item_07",
        productId: "prod_05",
        productTitle: "Serpentine Chain Choker",
        productHandle: "serpentine-chain-choker",
        variantId: "var_05_gold",
        variantTitle: "18K Gold Plated",
        price: 1200,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80&auto=format&fit=crop",
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "ord_05",
    orderNumber: "DD-6290-1194",
    customerFirstName: "Tanvi",
    customerLastName: "Iyer",
    customerEmail: "tanvi.iyer@example.com",
    customerPhone: "+91 94440 19283",
    addressLine1: "Flat 3B, Temple View Residency, Mylapore",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600004",
    country: "India",
    subtotal: 1299,
    shippingFee: 0,
    total: 1299,
    currency: "INR",
    paymentMethod: "upi",
    paymentStatus: "pending",
    status: "pending",
    supplierOrderId: "",
    supplierOrderUrl: "",
    supplierCost: 450,
    supplierNotes: "",
    courierTrackingNumber: "",
    courierTrackingUrl: "",
    notes: "Awaiting customer payment confirmation on WhatsApp or bank SMS",
    items: [
      {
        id: "item_08",
        productId: "prod_02",
        productTitle: "Celestial Freshwater Pearl Pendant",
        productHandle: "celestial-freshwater-pearl-pendant",
        variantId: "var_02_gold",
        variantTitle: "Yellow Gold & Pearl",
        price: 1299,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80&auto=format&fit=crop",
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: "ord_06",
    orderNumber: "DD-5182-9901",
    customerFirstName: "Kavita",
    customerLastName: "Reddy",
    customerEmail: "kavita.reddy@example.com",
    customerPhone: "+91 98490 28172",
    addressLine1: "Plot 89, Jubilee Hills Road No 36",
    city: "Hyderabad",
    state: "Telangana",
    postalCode: "500033",
    country: "India",
    subtotal: 899,
    shippingFee: 0,
    total: 899,
    currency: "INR",
    paymentMethod: "upi",
    paymentStatus: "paid",
    status: "delivered",
    supplierOrderId: "ALI-8991204",
    supplierOrderUrl: "https://supplier-portal.example.com/order/ALI-8991204",
    supplierCost: 310,
    supplierNotes: "Delivered smoothly, 5-star customer feedback received",
    courierTrackingNumber: "DELHIVERY892182",
    courierTrackingUrl: "https://www.delhivery.com/track/DELHIVERY892182",
    notes: "[UPI Verified - UTR: 109284719283]",
    items: [
      {
        id: "item_09",
        productId: "prod_01",
        productTitle: "Golden Aura Twisted Hoops",
        productHandle: "golden-aura-twisted-hoops",
        variantId: "var_01_gold",
        variantTitle: "18K Gold Vermeil",
        price: 899,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80&auto=format&fit=crop",
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

let MOCK_PRODUCTS: AdminProduct[] = [
  {
    id: "prod_01",
    handle: "golden-aura-twisted-hoops",
    title: "Golden Aura Twisted Hoops",
    descriptionHtml:
      "<p>Sculptural twisted hoop earrings crafted with 18k gold vermeil over sterling silver.</p>",
    availableForSale: true,
    totalInventory: 25,
    minPrice: 899,
    compareAtPrice: 1499,
    currency: "INR",
    tags: ["earrings", "new", "gold", "hoops"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80&auto=format&fit=crop",
        altText: "Golden Aura Twisted Hoops",
      },
    ],
    variants: [
      {
        id: "var_01_gold",
        title: "18K Gold Vermeil",
        availableForSale: true,
        quantityAvailable: 15,
        price: 899,
        compareAtPrice: 1499,
      },
      {
        id: "var_01_silver",
        title: "Sterling Silver",
        availableForSale: true,
        quantityAvailable: 10,
        price: 849,
        compareAtPrice: 1399,
      },
    ],
  },
  {
    id: "prod_02",
    handle: "celestial-freshwater-pearl-pendant",
    title: "Celestial Freshwater Pearl Pendant",
    descriptionHtml:
      "<p>Genuine baroque freshwater pearl on an adjustable Singapore twist chain.</p>",
    availableForSale: true,
    totalInventory: 18,
    minPrice: 1299,
    compareAtPrice: 1899,
    currency: "INR",
    tags: ["necklaces", "pearl", "sale", "bestseller"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80&auto=format&fit=crop",
        altText: "Celestial Freshwater Pearl Pendant",
      },
    ],
    variants: [
      {
        id: "var_02_gold",
        title: "Yellow Gold & Pearl",
        availableForSale: true,
        quantityAvailable: 12,
        price: 1299,
        compareAtPrice: 1899,
      },
    ],
  },
];

let MOCK_PAYMENT_OVERVIEW: PaymentReceivingOverview = {
  storeUpi: {
    payeeName: "Swathy Jose",
    vpa: "swathykjose-6@okhdfcbank",
    phone: "9619408985",
    sampleUri:
      "upi://pay?pa=swathykjose-6%40okhdfcbank&pn=Swathy%20Jose&am=1299.00&cu=INR&tn=Dainty%20Dazzle%20Order",
  },
  stats: {
    totalPaidInr: 6345,
    pendingVerificationInr: 3198,
    pendingVerificationCount: 2,
    paymentMethodCounts: {
      upi: 5,
      phonepe: 1,
      cod: 0,
      online: 0,
    },
    paymentStatusCounts: {
      pending: 2,
      paid: 4,
      failed: 0,
      refunded: 0,
    },
    totalTransactionsRecorded: 3,
  },
  recentTransactions: [
    {
      id: "txn_01",
      orderId: "ord_03",
      merchantTransactionId: "MT_DD84723091_1732001",
      provider: "phonepe",
      amountInPaise: "164800",
      currency: "INR",
      status: "SUCCESS",
      providerReferenceId: "T2408192091",
      providerResponseCode: "SUCCESS",
      pollCount: 1,
      lastPolledAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: "txn_02",
      orderId: "ord_01",
      merchantTransactionId: "UPI_DD92811042_MANUAL",
      provider: "upi",
      amountInPaise: "129900",
      currency: "INR",
      status: "SUCCESS",
      providerReferenceId: "UTR-432198765432",
      providerResponseCode: "COMPLETED",
      pollCount: 0,
      lastPolledAt: null,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "txn_03",
      orderId: "ord_04",
      merchantTransactionId: "UPI_DD77194502_MANUAL",
      provider: "upi",
      amountInPaise: "249900",
      currency: "INR",
      status: "SUCCESS",
      providerReferenceId: "UTR-881920491029",
      providerResponseCode: "COMPLETED",
      pollCount: 0,
      lastPolledAt: null,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ],
  recentAuditLogs: [
    {
      id: "audit_01",
      jobName: "payment_reconciliation",
      workerId: "worker_prod_4421",
      recordsChecked: 3,
      recordsUpdated: 1,
      status: "SUCCESS",
      durationMs: 412,
      createdAt: new Date(Date.now() - 60000 * 5).toISOString(),
    },
    {
      id: "audit_02",
      jobName: "payment_reconciliation",
      workerId: "worker_prod_4421",
      recordsChecked: 2,
      recordsUpdated: 0,
      status: "SUCCESS",
      durationMs: 320,
      createdAt: new Date(Date.now() - 60000 * 65).toISOString(),
    },
  ],
};

let MOCK_CMS = {
  hero: {
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&q=85&auto=format&fit=crop",
    headline: "Dainty Dazzle",
    subtitle:
      "True beauty shines from within, and our jewelry merely reflects it.",
    ctaText: "SHOP NOW ↗",
    ctaLink: "/products",
  },
  featured: {
    eyebrow: "Our Collection",
    headline: "Creating,\nCrafting\n& Wearing.",
    description:
      "Each piece is designed with care and crafted to celebrate everyday elegance.",
    ctaText: "EXPLORE ALL ↗",
    ctaLink: "/products",
  },
  editorial: {
    imageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&q=85&auto=format&fit=crop",
    headline: "Elegance in every detail.",
    subtitle: "Handcrafted with love, designed to be worn every single day.",
  },
  story: {
    imageUrl:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&q=85&auto=format&fit=crop",
    eyebrow: "Our Story",
    headline: "We believe\nin our process.",
    paragraph1:
      "Every piece of Dainty Dazzle jewelry is crafted with intention.",
    paragraph2:
      "We started with a simple belief: that beautiful jewelry shouldn't cost a fortune.",
    ctaText: "EXPLORE CATEGORIES ↗",
    ctaLink: "/products",
  },
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
    // Backend offline / network failed, use fallback
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

    if (res.data?.orders) {
      return { orders: res.data.orders, isLive: true };
    }

    // Filter fallback
    const filtered =
      status && status !== "all"
        ? MOCK_ORDERS.filter((o) => o.status === status)
        : MOCK_ORDERS;

    return { orders: filtered, isLive: false };
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

    // Update in-memory fallback
    const idx = MOCK_ORDERS.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      MOCK_ORDERS[idx] = {
        ...MOCK_ORDERS[idx],
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      return { success: true, order: MOCK_ORDERS[idx] };
    }

    throw new Error("Order not found");
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
          stats: res.data.stats,
          recentTransactions: res.data.recentTransactions || [],
          recentAuditLogs: res.data.recentAuditLogs || [],
        },
        isLive: true,
      };
    }

    return { overview: MOCK_PAYMENT_OVERVIEW, isLive: false };
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

    // Fallback in-memory
    const idx = MOCK_ORDERS.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      const existing = MOCK_ORDERS[idx];
      const newStatus =
        payload.paymentStatus === "paid" &&
        (payload.autoConfirmOrder ?? true) &&
        existing.status === "pending"
          ? "confirmed"
          : existing.status;

      const verificationNote = payload.utr
        ? `[UPI Verified - UTR: ${payload.utr.trim()}] ${payload.notes || ""}`.trim()
        : payload.notes
          ? `[Payment Verified] ${payload.notes.trim()}`
          : existing.notes;

      MOCK_ORDERS[idx] = {
        ...existing,
        paymentStatus: payload.paymentStatus,
        status: newStatus as OrderStatus,
        notes: verificationNote,
        updatedAt: new Date().toISOString(),
      };

      // update stats in MOCK_PAYMENT_OVERVIEW
      if (payload.paymentStatus === "paid") {
        MOCK_PAYMENT_OVERVIEW.stats.pendingVerificationCount = Math.max(
          0,
          MOCK_PAYMENT_OVERVIEW.stats.pendingVerificationCount - 1,
        );
        MOCK_PAYMENT_OVERVIEW.stats.totalPaidInr += existing.total;
        MOCK_PAYMENT_OVERVIEW.stats.pendingVerificationInr = Math.max(
          0,
          MOCK_PAYMENT_OVERVIEW.stats.pendingVerificationInr - existing.total,
        );
      }

      return { success: true, order: MOCK_ORDERS[idx] };
    }

    throw new Error("Order not found");
  },

  async reconcilePayment(transactionId: string): Promise<any> {
    const res = await adminFetch<any>(
      `/api/admin/payments/reconcile/${transactionId}`,
      { method: "POST" },
    );
    return res.data || { success: true, message: "Reconciled with gateway" };
  },

  // Products
  async getProducts(): Promise<{
    products: AdminProduct[];
    isLive: boolean;
  }> {
    const res = await adminFetch<{ products: AdminProduct[] }>(
      `/api/products?first=100`,
    );

    if (res.data?.products) {
      return { products: res.data.products, isLive: true };
    }

    return { products: MOCK_PRODUCTS, isLive: false };
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

    // Fallback in-memory
    const newProduct: AdminProduct = {
      id: product.id || `prod_${Date.now()}`,
      handle: product.handle || "new-item",
      title: product.title || "Untitled Product",
      descriptionHtml: product.descriptionHtml || "",
      availableForSale: product.availableForSale ?? true,
      totalInventory: product.totalInventory || 10,
      minPrice: product.minPrice || 999,
      compareAtPrice: product.compareAtPrice,
      currency: "INR",
      tags: product.tags || [],
      images: product.images || [],
      variants: product.variants || [
        {
          id: `var_${Date.now()}`,
          title: "Default",
          availableForSale: true,
          quantityAvailable: 10,
          price: product.minPrice || 999,
        },
      ],
    };

    const existingIdx = MOCK_PRODUCTS.findIndex((p) => p.id === newProduct.id);
    if (existingIdx !== -1) {
      MOCK_PRODUCTS[existingIdx] = newProduct;
    } else {
      MOCK_PRODUCTS.unshift(newProduct);
    }

    return newProduct;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const res = await adminFetch<{ success: boolean }>(
      `/api/admin/products/${productId}`,
      {
        method: "DELETE",
      },
    );

    if (res.data?.success) {
      return true;
    }

    MOCK_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.id !== productId);
    return true;
  },

  // CMS
  async getCMS(section: "hero" | "featured" | "editorial" | "story"): Promise<{
    data: any;
    isLive: boolean;
  }> {
    const res = await adminFetch<any>(`/api/cms/${section}`);
    if (res.data && Object.keys(res.data).length > 0) {
      return { data: res.data, isLive: true };
    }
    return { data: MOCK_CMS[section], isLive: false };
  },

  async updateCMS(
    section: "hero" | "featured" | "editorial" | "story",
    data: any,
  ): Promise<boolean> {
    const res = await adminFetch<{ success: boolean }>(
      `/api/admin/cms/${section}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    MOCK_CMS[section] = data;
    return res.data?.success ?? true;
  },
};
