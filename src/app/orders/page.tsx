"use client";

import { useState } from "react";
import { Search, Filter, Truck } from "lucide-react";
import { Badge } from "../../components/Badge";

const sampleOrders = [
  {
    id: "ord_101",
    orderNumber: "ORD-9281-402",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah@example.com",
    itemsCount: 2,
    total: "$149.00",
    paymentProvider: "stripe",
    paymentStatus: "paid",
    status: "processing",
    shippingAddress: "742 Evergreen Terrace, Springfield, OR",
    date: "Oct 29, 2026",
  },
  {
    id: "ord_102",
    orderNumber: "ORD-9280-119",
    customerName: "Alex Rivera",
    customerEmail: "alex@example.com",
    itemsCount: 1,
    total: "$89.50",
    paymentProvider: "razorpay",
    paymentStatus: "paid",
    status: "shipped",
    shippingAddress: "124 Conch Street, Bikini Bottom, CA",
    date: "Oct 29, 2026",
  },
  {
    id: "ord_103",
    orderNumber: "ORD-9279-881",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    itemsCount: 4,
    total: "$240.00",
    paymentProvider: "stripe",
    paymentStatus: "unpaid",
    status: "pending",
    shippingAddress: "221B Baker Street, London, UK",
    date: "Oct 28, 2026",
  },
  {
    id: "ord_104",
    orderNumber: "ORD-9278-301",
    customerName: "Marcus Vance",
    customerEmail: "marcus@example.com",
    itemsCount: 1,
    total: "$64.00",
    paymentProvider: "stripe",
    paymentStatus: "paid",
    status: "delivered",
    shippingAddress: "31 Spooner Street, Quahog, RI",
    date: "Oct 27, 2026",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState<typeof sampleOrders[0] | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("FedEx");

  const handleUpdateStatus = (status: string) => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? { ...o, status } : o))
    );
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111815]">Orders & Fulfillment</h1>
        <p className="text-sm text-[#737F76] mt-0.5">
          Process customer orders, print labels, verify payments, and dispatch shipments.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8E4] flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#737F76] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, email, or name..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#58635D] bg-[#F8FAF9] hover:bg-[#F2F5EF] border border-[#E2E8E4] rounded-lg transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Payment: All
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#58635D] bg-[#F8FAF9] hover:bg-[#F2F5EF] border border-[#E2E8E4] rounded-lg transition-colors">
            Fulfillment: All
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E2E8E4] rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8FAF9] text-xs font-semibold text-[#737F76] uppercase tracking-wider border-b border-[#E2E8E4]">
            <tr>
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Gateway</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Fulfillment</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8E4]">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#F2F5EF]/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-semibold text-[#111815]">
                  {ord.orderNumber}
                </td>
                <td className="px-6 py-4 text-xs text-[#737F76]">{ord.date}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-[#111815]">{ord.customerName}</div>
                  <div className="text-xs text-[#737F76]">{ord.customerEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="uppercase text-xs font-semibold tracking-wider text-[#58635D]">
                    {ord.paymentProvider}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge status={ord.paymentStatus} />
                </td>
                <td className="px-6 py-4">
                  <Badge status={ord.status} />
                </td>
                <td className="px-6 py-4 font-bold text-[#111815]">{ord.total}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#194F36] hover:bg-[#EAF3EE] border border-[#D5DDD6] rounded-lg transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Fulfill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fulfillment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#111815]">
              Fulfill Order {selectedOrder.orderNumber}
            </h3>
            <p className="text-xs text-[#737F76]">
              Ship to: {selectedOrder.shippingAddress}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#737F76] mb-1">
                  Shipping Carrier
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg"
                >
                  <option value="FedEx">FedEx</option>
                  <option value="UPS">UPS</option>
                  <option value="DHL">DHL Express</option>
                  <option value="BlueDart">Blue Dart / Delhivery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737F76] mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. 1Z9999999999999999"
                  className="w-full px-3 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8E4]">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-medium text-[#58635D] hover:bg-[#F2F5EF] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus("shipped")}
                className="px-4 py-2 text-xs font-medium bg-[#194F36] hover:bg-[#133D2A] text-white rounded-lg transition-colors"
              >
                Mark as Shipped & Notify Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

