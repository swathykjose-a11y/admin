export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  categoryId?: string;
  status: "draft" | "published" | "archived";
  price: string;
  compareAtPrice?: string;
  costPrice?: string;
  images: Array<{ url: string; key: string; alt?: string }>;
  featured: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  sku?: string;
  price: string;
  quantity: number;
  total: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  currency: string;
  subtotal: string;
  shippingAmount: string;
  taxAmount: string;
  total: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded" | "failed";
  paymentProvider?: "stripe" | "razorpay" | "cod";
  trackingNumber?: string;
  shippingCarrier?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalRevenue: string;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  totalProducts: number;
  totalCustomers: number;
}

