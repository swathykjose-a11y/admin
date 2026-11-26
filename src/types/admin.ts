export interface CustomerAddress {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productHandle: string;
  variantId: string;
  variantTitle: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "ordered_from_supplier"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "upi" | "phonepe" | "cod" | "online";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod | string;
  paymentStatus: PaymentStatus | string;
  status: OrderStatus;
  supplierOrderId?: string;
  supplierOrderUrl?: string;
  supplierCost?: number;
  supplierNotes?: string;
  courierTrackingNumber?: string;
  courierTrackingUrl?: string;
  notes?: string;
  items?: AdminOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StoreUpiConfig {
  payeeName: string;
  vpa: string;
  phone: string;
  sampleUri?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  merchantTransactionId: string;
  provider: string;
  amountInPaise: string;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  providerReferenceId?: string | null;
  providerResponseCode?: string | null;
  pollCount?: number;
  lastPolledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PollingAuditLog {
  id: string;
  jobName: string;
  workerId: string;
  recordsChecked: number;
  recordsUpdated: number;
  status: "SUCCESS" | "FAILED";
  durationMs: number;
  createdAt: string;
}

export interface PaymentReceivingOverview {
  storeUpi: StoreUpiConfig;
  stats: {
    totalPaidInr: number;
    pendingVerificationInr: number;
    pendingVerificationCount: number;
    paymentMethodCounts: {
      upi: number;
      phonepe: number;
      cod: number;
      online: number;
    };
    paymentStatusCounts: {
      pending: number;
      paid: number;
      failed: number;
      refunded: number;
    };
    totalTransactionsRecorded: number;
  };
  recentTransactions: PaymentTransaction[];
  recentAuditLogs: PollingAuditLog[];
}

export interface ProductVariantInput {
  id?: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: number;
  compareAtPrice?: number;
}

export interface AdminProduct {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  availableForSale: boolean;
  totalInventory: number;
  minPrice: number;
  compareAtPrice?: number;
  currency: string;
  tags: string[];
  images: Array<{ url: string; altText: string | null }>;
  variants: ProductVariantInput[];
  isActive?: boolean;
}

export interface HeroBannerCMS {
  imageUrl: string;
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export interface FeaturedSectionCMS {
  eyebrow: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export interface EditorialBannerCMS {
  imageUrl: string;
  headline: string;
  subtitle: string;
}

export interface StorySectionCMS {
  imageUrl: string;
  eyebrow: string;
  headline: string;
  paragraph1: string;
  paragraph2: string;
  ctaText: string;
  ctaLink: string;
}
