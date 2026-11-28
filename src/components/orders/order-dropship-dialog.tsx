"use client";

import { useState } from "react";
import type { AdminOrder, OrderStatus } from "@/types/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, PackageCheck } from "lucide-react";

interface OrderDropshipDialogProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    orderId: string,
    data: {
      status: OrderStatus;
      paymentStatus?: string;
      courierTrackingNumber?: string;
      courierTrackingUrl?: string;
      notes?: string;
    },
  ) => Promise<void>;
}

export function OrderDropshipDialog({
  order,
  isOpen,
  onClose,
  onSave,
}: OrderDropshipDialogProps) {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [status, setStatus] = useState<OrderStatus>(order?.status || "confirmed");
  const [paymentStatus, setPaymentStatus] = useState<string>(order?.paymentStatus || "pending");
  const [notes, setNotes] = useState(order?.notes || "");

  if (!order) return null;

  const fullAddress = `${order.customerFirstName} ${order.customerLastName}\n${order.addressLine1}${
    order.addressLine2 ? `\n${order.addressLine2}` : ""
  }\n${order.city}, ${order.state} - ${order.postalCode}\n${order.country}\nPhone: ${order.customerPhone}\nEmail: ${order.customerEmail}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(order.id, {
        status,
        paymentStatus,
        notes: notes.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-xl font-bold">
              Fulfill Order #{order.orderNumber}
            </DialogTitle>
            <Badge variant="outline" className="uppercase font-mono text-xs">
              {order.paymentMethod.toUpperCase()} (₹{order.total})
            </Badge>
          </div>
          <DialogDescription>
            Copy the customer delivery address and update order status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6 pt-2">
          {/* Customer Address Copy Box */}
          <div className="rounded-lg border bg-neutral-50/80 p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Customer Delivery Address
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyAddress}
                className="h-7 text-xs gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Address
                  </>
                )}
              </Button>
            </div>
            <pre className="text-xs font-mono text-neutral-800 whitespace-pre-wrap leading-relaxed select-all">
              {fullAddress}
            </pre>
          </div>

          {/* Ordered Items Breakdown */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
              Ordered Products ({order.items?.length || 1})
            </h4>
            <div className="border rounded-md divide-y">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productTitle}
                        className="w-10 h-10 object-cover rounded border"
                      />
                    )}
                    <div>
                      <p className="font-medium text-neutral-900">
                        {item.productTitle}
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Variant: {item.variantTitle} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-medium">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status & Notes */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              Order Status &amp; Payment
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Payment Verification Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-ring font-medium"
                >
                  <option value="paid">Paid &amp; Verified</option>
                  <option value="pending">Pending Verification</option>
                  <option value="failed">Failed / Unpaid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-ring font-medium"
                >
                  <option value="pending">Pending Confirmation</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Placed / In Progress</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Payment Reference / UTR / Order Notes
                </label>
                <Input
                  placeholder="e.g. [UPI Verified - UTR: 432198765432] or customer note"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Update Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
