import Link from "next/link";
import { DollarSign, ShoppingCart, Package, Users, Plus, ArrowUpRight } from "lucide-react";
import { MetricsCard } from "../components/MetricsCard";
import { Badge } from "../components/Badge";

// Sample mock data for quick initial visual presentation
const recentOrders = [
  {
    id: "ord_1",
    orderNumber: "ORD-9281-402",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah@example.com",
    total: "$149.00",
    paymentStatus: "paid",
    status: "processing",
    date: "12 mins ago",
  },
  {
    id: "ord_2",
    orderNumber: "ORD-9280-119",
    customerName: "Alex Rivera",
    customerEmail: "alex@example.com",
    total: "$89.50",
    paymentStatus: "paid",
    status: "shipped",
    date: "1 hour ago",
  },
  {
    id: "ord_3",
    orderNumber: "ORD-9279-881",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    total: "$240.00",
    paymentStatus: "pending",
    status: "pending",
    date: "3 hours ago",
  },
  {
    id: "ord_4",
    orderNumber: "ORD-9278-301",
    customerName: "Marcus Vance",
    customerEmail: "marcus@example.com",
    total: "$64.00",
    paymentStatus: "paid",
    status: "delivered",
    date: "Yesterday",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111815]">Store Overview</h1>
          <p className="text-sm text-[#737F76] mt-0.5">
            Real-time telemetry and store operations powered by Cloudflare Workers & Neon Postgres.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 bg-[#194F36] hover:bg-[#133D2A] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Revenue"
          value="$14,280.00"
          change="+18.4%"
          subtitle="vs last month"
          icon={DollarSign}
        />
        <MetricsCard
          title="Total Orders"
          value="184"
          change="+12.1%"
          subtitle="vs last month"
          icon={ShoppingCart}
        />
        <MetricsCard
          title="Active Products"
          value="42"
          subtitle="100% in R2 storage"
          icon={Package}
        />
        <MetricsCard
          title="Total Customers"
          value="260"
          change="+8.3%"
          subtitle="new accounts"
          icon={Users}
        />
      </div>

      {/* Cloud Infrastructure Status Banner */}
      <div className="bg-[#EAF3EE] border border-[#D5DDD6] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h4 className="text-sm font-semibold text-[#111815]">Serverless Edge Architecture Active</h4>
          </div>
          <p className="text-xs text-[#58635D]">
            Cloudflare Workers (0ms cold start) • Neon Serverless Postgres • Cloudflare R2 ($0 egress) • Upstash Redis Rate Limiting
          </p>
        </div>
        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#194F36] hover:underline"
        >
          <span>View Cloud Quotas</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[#E2E8E4] rounded-xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[#E2E8E4] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base text-[#111815]">Recent Orders</h3>
            <p className="text-xs text-[#737F76] mt-0.5">Live order stream processed via Stripe & Razorpay webhooks</p>
          </div>
          <Link
            href="/orders"
            className="text-xs font-medium text-[#194F36] hover:underline"
          >
            View all orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAF9] text-xs font-semibold text-[#737F76] uppercase tracking-wider border-b border-[#E2E8E4]">
              <tr>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Fulfillment</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E4]">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F2F5EF]/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-[#111815]">
                    {ord.orderNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#111815]">{ord.customerName}</div>
                    <div className="text-xs text-[#737F76]">{ord.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#111815]">{ord.total}</td>
                  <td className="px-6 py-4">
                    <Badge status={ord.paymentStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={ord.status} />
                  </td>
                  <td className="px-6 py-4 text-xs text-[#737F76]">{ord.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

