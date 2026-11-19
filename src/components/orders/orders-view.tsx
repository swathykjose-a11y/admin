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
import { OrderDropshipDialog } from "./order-dropship-dialog";
import {
  Package,
  Search,
  ExternalLink,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface OrdersViewProps {
  orders: AdminOrder[];
  onUpdateOrder: (
    orderId: string,
    data: {
      status: OrderStatus;
      supplierOrderId?: string;
      supplierOrderUrl?: string;
      supplierCost?: number;
      supplierNotes?: string;
      courierTrackingNumber?: string;
      courierTrackingUrl?: string;
    },
  ) => Promise<void>;
  onRefresh: () => void;
}

export function OrdersView({
  orders,
  onUpdateOrder,
  onRefresh,
}: OrdersViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      o.orderNumber.toLowerCase().includes(query) ||
      o.customerFirstName.toLowerCase().includes(query) ||
      o.customerLastName.toLowerCase().includes(query) ||
      o.customerPhone.includes(query) ||
      o.city.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300 gap-1 text-[11px]">
            <AlertCircle className="w-3 h-3" />
            Needs Ordering
          </Badge>
        );
      case "ordered_from_supplier":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300 gap-1 text-[11px]">
            <Clock className="w-3 h-3" />
            Ordered at Supplier
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

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search by order #, customer, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Orders" },
            { id: "confirmed", label: "Needs Ordering" },
            { id: "ordered_from_supplier", label: "Ordered from Supplier" },
            { id: "shipped", label: "Shipped" },
            { id: "delivered", label: "Delivered" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={statusFilter === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(tab.id)}
              className="text-xs h-8 shrink-0"
            >
              {tab.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="text-xs h-8 ml-auto"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px] text-xs">Order #</TableHead>
              <TableHead className="text-xs">Customer</TableHead>
              <TableHead className="text-xs">Items</TableHead>
              <TableHead className="text-xs">Total / Payment</TableHead>
              <TableHead className="text-xs">Dropship Status</TableHead>
              <TableHead className="text-xs">Supplier Info</TableHead>
              <TableHead className="text-right text-xs">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground text-xs"
                >
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No orders match your filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="text-xs">
                  <TableCell className="font-mono font-medium">
                    #{order.orderNumber}
                    <div className="text-[10px] text-muted-foreground font-sans">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium text-neutral-900">
                      {order.customerFirstName} {order.customerLastName}
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                      {order.city}, {order.state} • {order.customerPhone}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[200px] truncate text-neutral-700">
                      {order.items && order.items.length > 0 ? (
                        <>
                          {order.items[0].quantity}x {order.items[0].productTitle}
                          {order.items.length > 1 && (
                            <span className="text-muted-foreground">
                              {" "}
                              +{order.items.length - 1} more
                            </span>
                          )}
                        </>
                      ) : (
                        "1 item"
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-mono font-semibold">
                      ₹{order.total.toFixed(0)}
                    </div>
                    <div className="text-[10px] uppercase font-mono text-muted-foreground">
                      {order.paymentMethod} • {order.paymentStatus}
                    </div>
                  </TableCell>

                  <TableCell>{getStatusBadge(order.status)}</TableCell>

                  <TableCell>
                    {order.supplierOrderId ? (
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span>{order.supplierOrderId}</span>
                        {order.supplierOrderUrl && (
                          <a
                            href={order.supplierOrderUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[11px] italic">
                        Not ordered yet
                      </span>
                    )}

                    {order.courierTrackingNumber && (
                      <div className="text-[10px] text-purple-700 font-mono mt-0.5">
                        Track: {order.courierTrackingNumber}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                      className="h-8 text-xs font-medium"
                    >
                      Fulfill Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dropship Details Modal */}
      {selectedOrder && (
        <OrderDropshipDialog
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={onUpdateOrder}
        />
      )}
    </div>
  );
}
