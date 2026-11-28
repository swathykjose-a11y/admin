"use client";

import { useState } from "react";
import type { AdminOrder, OrderStatus } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OrderDropshipDialog } from "./order-dropship-dialog";
import { PaymentVerifyDialog } from "../payments/payment-verify-dialog";
import {
  Package,
  Search,
  ExternalLink,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  RefreshCw,
  TrendingUp,
  MapPin,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

interface OrdersViewProps {
  orders: AdminOrder[];
  onUpdateOrder: (
    orderId: string,
    data: {
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
  ) => Promise<void>;
  onVerifyPayment?: (
    orderId: string,
    payload: {
      paymentStatus: "paid" | "failed" | "refunded";
      utr?: string;
      notes?: string;
      autoConfirmOrder?: boolean;
    },
  ) => Promise<void>;
  onRefresh: () => void;
}

export function OrdersView({
  orders,
  onUpdateOrder,
  onVerifyPayment,
  onRefresh,
}: OrdersViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [selectedOrderForPayment, setSelectedOrderForPayment] =
    useState<AdminOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const filteredOrders = orders.filter((o) => {
    let matchesStatus = true;
    if (statusFilter !== "all") {
      matchesStatus = o.status === statusFilter;
    }

    let matchesPayment = true;
    if (paymentFilter === "pending") {
      matchesPayment = o.paymentStatus === "pending" || !o.paymentStatus;
    } else if (paymentFilter === "paid") {
      matchesPayment = o.paymentStatus === "paid";
    }

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      o.orderNumber.toLowerCase().includes(query) ||
      o.customerFirstName.toLowerCase().includes(query) ||
      o.customerLastName.toLowerCase().includes(query) ||
      o.customerPhone.includes(query) ||
      o.city.toLowerCase().includes(query) ||
      (o.notes && o.notes.toLowerCase().includes(query));

    return matchesStatus && matchesPayment && matchesQuery;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 gap-1 text-[11px]">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300 gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-300 gap-1 text-[11px]">
            <Truck className="w-3 h-3" />
            Shipped / In Transit
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300 gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px]">
            {status}
          </Badge>
        );
    }
  };

  const getPaymentBadge = (order: AdminOrder) => {
    const isPaid = order.paymentStatus === "paid";
    return isPaid ? (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 text-[10px] gap-1 font-mono">
        <CheckCircle2 className="w-2.5 h-2.5" />
        {order.paymentMethod?.toUpperCase() || "UPI"} PAID
      </Badge>
    ) : (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300 text-[10px] gap-1 font-mono">
        <Clock className="w-2.5 h-2.5" />
        {order.paymentMethod?.toUpperCase() || "UPI"} PENDING
      </Badge>
    );
  };

  const needsDropshipCount = orders.filter((o) => o.status === "confirmed").length;
  const pendingPaymentCount = orders.filter((o) => o.paymentStatus === "pending").length;

  return (
    <div className="space-y-6">
      {/* Table Card */}
      <Card>
        <CardHeader className="p-5 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold">
                Orders &amp; Fulfillment
              </CardTitle>
              <CardDescription className="text-xs">
                Manage incoming orders, payment verification, and courier tracking
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="text-xs gap-1.5 h-8 shrink-0 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search order #, customer, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {[
                { key: "all", label: `All (${orders.length})` },
                {
                  key: "confirmed",
                  label: `Ready to Ship (${needsDropshipCount})`,
                  highlight: needsDropshipCount > 0,
                },
                { key: "shipped", label: "Shipped" },
                { key: "delivered", label: "Delivered" },
              ].map((f) => (
                <Button
                  key={f.key}
                  variant={statusFilter === f.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(f.key)}
                  className={`text-xs h-8 px-2.5 whitespace-nowrap ${
                    statusFilter === f.key
                      ? "bg-neutral-900 text-white"
                      : f.highlight
                        ? "border-amber-300 text-amber-800 bg-amber-50/60"
                        : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {f.label}
                </Button>
              ))}

              {/* Payment filter toggle */}
              <div className="h-4 w-px bg-neutral-200 mx-1" />

              <Button
                variant={paymentFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setPaymentFilter(paymentFilter === "pending" ? "all" : "pending")
                }
                className={`text-xs h-8 px-2.5 whitespace-nowrap ${
                  paymentFilter === "pending"
                    ? "bg-amber-700 text-white"
                    : pendingPaymentCount > 0
                      ? "border-amber-300 text-amber-800 bg-amber-50"
                      : "text-neutral-600"
                }`}
              >
                Pending UPI ({pendingPaymentCount})
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-50/60">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Order / Date</TableHead>
                  <TableHead className="text-xs font-semibold">Customer & Delivery</TableHead>
                  <TableHead className="text-xs font-semibold">Ordered Items</TableHead>
                  <TableHead className="text-xs font-semibold">Retail & Payment</TableHead>
                  <TableHead className="text-xs font-semibold">Fulfillment</TableHead>
                  <TableHead className="text-xs font-semibold">Tracking</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-40 text-center text-muted-foreground text-xs"
                    >
                      <Package className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                      <p className="font-medium text-neutral-600">No orders match your filter criteria.</p>
                      {(statusFilter !== "all" || searchQuery || paymentFilter !== "all") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setStatusFilter("all");
                            setPaymentFilter("all");
                            setSearchQuery("");
                          }}
                          className="mt-2 text-xs text-neutral-600 hover:text-neutral-900"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const isPaymentPending = order.paymentStatus === "pending";
                    const supplierCostNum = parseFloat(order.supplierCost as any) || 0;
                    const profitNum = order.total - supplierCostNum;

                    return (
                      <TableRow key={order.id} className="hover:bg-neutral-50/50">
                        {/* Order & Date */}
                        <TableCell>
                          <div className="font-mono text-xs font-bold text-neutral-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </TableCell>

                        {/* Customer */}
                        <TableCell>
                          <div className="text-xs font-semibold text-neutral-900">
                            {order.customerFirstName} {order.customerLastName}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {order.customerPhone}
                          </div>
                          <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate max-w-[140px]">
                              {order.city}, {order.state}
                            </span>
                          </div>
                        </TableCell>

                        {/* Items */}
                        <TableCell>
                          <div className="space-y-1 max-w-[200px]">
                            {order.items?.slice(0, 2).map((item) => (
                              <div key={item.id} className="flex items-center gap-1.5 text-xs truncate">
                                {item.imageUrl && (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.productTitle}
                                    className="w-5 h-5 rounded object-cover shrink-0"
                                  />
                                )}
                                <span className="font-medium text-neutral-800 truncate">
                                  {item.productTitle}
                                </span>
                                <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                                  ×{item.quantity}
                                </span>
                              </div>
                            ))}
                            {(order.items?.length || 0) > 2 && (
                              <span className="text-[10px] text-muted-foreground block">
                                +{(order.items?.length || 0) - 2} more item(s)
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Retail & Payment */}
                        <TableCell>
                          <div className="text-xs font-bold text-neutral-900">
                            ₹{order.total.toLocaleString("en-IN")}
                          </div>
                          <div className="mt-1">
                            {getPaymentBadge(order)}
                          </div>
                        </TableCell>

                        {/* Fulfillment Status */}
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>

                        {/* Tracking */}
                        <TableCell>
                          {order.courierTrackingNumber ? (
                            <a
                              href={order.courierTrackingUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-mono"
                            >
                              <Truck className="w-3 h-3" />
                              {order.courierTrackingNumber}
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Not shipped yet
                            </span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPaymentPending && onVerifyPayment && (
                              <Button
                                size="sm"
                                onClick={() => setSelectedOrderForPayment(order)}
                                className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700 text-white px-2 gap-1 shadow-2xs"
                              >
                                <ShieldCheck className="w-3 h-3" />
                                Verify
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="text-[11px] h-7 px-2.5 text-neutral-700 hover:text-neutral-900 gap-1 bg-white"
                            >
                              <PackageCheck className="w-3 h-3" />
                              Fulfill
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dropship Fulfillment Dialog */}
      <OrderDropshipDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onSave={onUpdateOrder}
      />

      {/* Payment Verify Dialog */}
      {onVerifyPayment && (
        <PaymentVerifyDialog
          order={selectedOrderForPayment}
          isOpen={!!selectedOrderForPayment}
          onClose={() => setSelectedOrderForPayment(null)}
          onVerify={onVerifyPayment}
        />
      )}
    </div>
  );
}
