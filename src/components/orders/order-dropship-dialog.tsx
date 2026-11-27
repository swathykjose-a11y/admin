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
import { Textarea } from "@/components/ui/textarea";
import {
  Copy,
  Check,
  ExternalLink,
  PackageCheck,
  TrendingUp,
} from "lucide-react";

interface OrderDropshipDialogProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
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
}

export function OrderDropshipDialog({
  order,
  isOpen,
  onClose,
  onSave,
}: OrderDropshipDialogProps) {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [status, setStatus] = useState<OrderStatus>(order?.status || "confirmed");
  const [paymentStatus, setPaymentStatus] = useState<string>(order?.paymentStatus || "pending");
  const [notes, setNotes] = useState(order?.notes || "");
  const [supplierOrderId, setSupplierOrderId] = useState(
    order?.supplierOrderId || "",
  );
  const [supplierOrderUrl, setSupplierOrderUrl] = useState(
    order?.supplierOrderUrl || "",
  );
  const [supplierCost, setSupplierCost] = useState(
    order?.supplierCost?.toString() || "",
  );
  const [courierTrackingNumber, setCourierTrackingNumber] = useState(
    order?.courierTrackingNumber || "",
  );
  const [courierTrackingUrl, setCourierTrackingUrl] = useState(
    order?.courierTrackingUrl || "",
  );
  const [supplierNotes, setSupplierNotes] = useState(
    order?.supplierNotes || "",
  );

  if (!order) return null;

  const fullAddress = `${order.customerFirstName} ${order.customerLastName}\n${order.addressLine1}${
    order.addressLine2 ? `\n${order.addressLine2}` : ""
  }\n${order.city}, ${order.state} - ${order.postalCode}\n${order.country}\nPhone: ${order.customerPhone}\nEmail: ${order.customerEmail}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const costNum = parseFloat(supplierCost) || 0;
  const profit = order.total - costNum;
  const marginPct =
    order.total > 0 && costNum > 0
      ? ((profit / order.total) * 100).toFixed(1)
      : null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(order.id, {
        status,
        paymentStatus,
        supplierOrderId: supplierOrderId.trim() || undefined,
        supplierOrderUrl: supplierOrderUrl.trim() || undefined,
        supplierCost: costNum > 0 ? costNum : undefined,
        supplierNotes: supplierNotes.trim() || undefined,
        courierTrackingNumber: courierTrackingNumber.trim() || undefined,
        courierTrackingUrl: courierTrackingUrl.trim() || undefined,
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
            Copy the customer shipping address to order from your supplier, then record tracking details below.
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
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy for Supplier
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

          {/* Dropship Supplier Information */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                Dropshipping Supplier Info
              </h4>

              {/* Profit Calculation */}
              {marginPct && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Profit: ₹{profit.toFixed(0)} ({marginPct}%)
                </div>
              )}
            </div>

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
                  <option value="paid">Paid & Verified</option>
                  <option value="pending">Pending Verification</option>
                  <option value="failed">Failed / Unpaid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Fulfillment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-ring font-medium"
                >
                  <option value="pending">Pending Confirmation</option>
                  <option value="confirmed">Confirmed (Needs Ordering)</option>
                  <option value="ordered_from_supplier">
                    Ordered from Supplier
                  </option>
                  <option value="shipped">Shipped (In Transit)</option>
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

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Supplier Purchase Cost (₹ INR)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 450"
                  value={supplierCost}
                  onChange={(e) => setSupplierCost(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Supplier Order ID / Reference
                </label>
                <Input
                  placeholder="e.g. ALI-982140 or MEESHO-429"
                  value={supplierOrderId}
                  onChange={(e) => setSupplierOrderId(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Supplier Order URL
                </label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="https://supplier.com/order/..."
                    value={supplierOrderUrl}
                    onChange={(e) => setSupplierOrderUrl(e.target.value)}
                    className="h-9 text-xs"
                  />
                  {supplierOrderUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-9 w-9"
                      onClick={() => window.open(supplierOrderUrl, "_blank")}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Courier Tracking Number
                </label>
                <Input
                  placeholder="e.g. DELHIVERY9812401"
                  value={courierTrackingNumber}
                  onChange={(e) => setCourierTrackingNumber(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Tracking Page URL
                </label>
                <Input
                  placeholder="https://www.delhivery.com/track/..."
                  value={courierTrackingUrl}
                  onChange={(e) => setCourierTrackingUrl(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Internal Supplier Notes
              </label>
              <Textarea
                placeholder="Notes about packaging, gift card, or supplier message..."
                value={supplierNotes}
                onChange={(e) => setSupplierNotes(e.target.value)}
                rows={2}
                className="text-xs"
              />
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
              {isSaving ? "Saving..." : "Update Dropship Details"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
