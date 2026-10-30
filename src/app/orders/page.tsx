"use client";

import { useState } from "react";
import { Search, Truck } from "lucide-react";
import { Badge } from "../../components/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";

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
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof sampleOrders[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("FedEx");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === "all" || o.status === activeTab;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const openFulfillmentModal = (order: typeof sampleOrders[0]) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleUpdateStatus = (status: string) => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? { ...o, status } : o))
    );
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A211D]">Orders & Fulfillment</h1>
        <p className="text-xs text-[#737F76] mt-0.5">
          Process customer orders, verify Stripe/Razorpay webhooks, and dispatch shipments.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({orders.filter(o => o.status === "processing").length})</TabsTrigger>
            <TabsTrigger value="shipped">Shipped ({orders.filter(o => o.status === "shipped").length})</TabsTrigger>
            <TabsTrigger value="delivered">Delivered ({orders.filter(o => o.status === "delivered").length})</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#737F76] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, name..."
              className="pl-9 bg-white border-[#D5DDD6]"
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((ord) => (
                    <TableRow key={ord.id}>
                      <TableCell className="font-mono text-xs font-bold text-[#1A211D]">
                        {ord.orderNumber}
                      </TableCell>
                      <TableCell className="text-xs text-[#737F76]">{ord.date}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-xs text-[#1A211D]">{ord.customerName}</div>
                        <div className="text-[11px] text-[#737F76]">{ord.customerEmail}</div>
                      </TableCell>
                      <TableCell>
                        <span className="uppercase text-[11px] font-bold text-[#58635D]">
                          {ord.paymentProvider}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge status={ord.paymentStatus} />
                      </TableCell>
                      <TableCell>
                        <Badge status={ord.status} />
                      </TableCell>
                      <TableCell className="font-extrabold text-[#1A211D]">{ord.total}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openFulfillmentModal(ord)}
                          className="h-8 text-xs border-[#D5DDD6] text-[#194F36] hover:bg-[#EAF3EE]"
                        >
                          <Truck className="w-3.5 h-3.5 mr-1" />
                          Fulfill
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-xs text-[#737F76]">
                        No orders in this state.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Shadcn Dialog for Fulfillment */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fulfill Order {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Ship to: {selectedOrder?.shippingAddress}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1.5">
                Shipping Carrier
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full h-9 px-3 text-sm bg-white border border-[#D5DDD6] rounded-lg"
              >
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="DHL">DHL Express</option>
                <option value="BlueDart">Blue Dart / Delhivery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1.5">
                Tracking Number
              </label>
              <Input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. 1Z9999999999999999"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#194F36] hover:bg-[#133D2A] text-white"
              onClick={() => handleUpdateStatus("shipped")}
            >
              Mark as Shipped & Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
