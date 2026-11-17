import type {
  AdminOrder,
  AdminProduct,
  HeroBannerCMS,
  FeaturedSectionCMS,
  EditorialBannerCMS,
  StorySectionCMS,
  OrderStatus,
} from "@/types/admin";

const SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8787";
const ADMIN_API_KEY =
  process.env.NEXT_PUBLIC_ADMIN_KEY || "dd_admin_secret_key_change_me";

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
    paymentMethod: "phonepe",
    paymentStatus: "paid",
    status: "confirmed",
    supplierOrderId: "",
    supplierOrderUrl: "",
    supplierCost: 450,
    supplierNotes: "Pending fulfillment on supplier site",
    courierTrackingNumber: "",
    courierTrackingUrl: "",
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
    paymentMethod: "cod",
    paymentStatus: "pending",
    status: "ordered_from_supplier",
    supplierOrderId: "ALI-9028192",
    supplierOrderUrl: "https://supplier-portal.example.com/order/ALI-9028192",
    supplierCost: 590,
    supplierNotes: "Ordered via supplier standard air express",
    courierTrackingNumber: "DELHIVERY9812401",
    courierTrackingUrl: "https://www.delhivery.com/track/DELHIVERY9812401",
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

// ─── HTTP Helper ─────────────────────────────────────────────────────────────
async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<{ data: T | null; isFallback: boolean }> {
  try {
    const url = `${SERVER_BASE_URL.replace(/\/+$/, "")}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": ADMIN_API_KEY,
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
      supplierOrderId?: string;
      supplierOrderUrl?: string;
      supplierCost?: number;
      supplierNotes?: string;
      courierTrackingNumber?: string;
      courierTrackingUrl?: string;
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
