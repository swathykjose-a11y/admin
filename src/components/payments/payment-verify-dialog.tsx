"use client";

import { useState } from "react";
import type { AdminOrder, PaymentStatus } from "@/types/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  IndianRupee,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Package,
} from "lucide-react";

interface PaymentVerifyDialogProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (
    orderId: string,
    payload: {
      paymentStatus: "paid" | "failed" | "refunded";
      utr?: string;
      notes?: string;
      autoConfirmOrder?: boolean;
    },
  ) => Promise<void>;
}

export function PaymentVerifyDialog({
  order,
  isOpen,
  onClose,
  onVerify,
}: PaymentVerifyDialogProps) {
  const [utr, setUtr] = useState("");
  const [notes, setNotes] = useState("");
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);

  if (!order) return null;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText("swathykjose-6@okhdfcbank");
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleSubmit = async (status: "paid" | "failed" | "refunded") => {
    setIsSubmitting(true);
    try {
      await onVerify(order.id, {
        paymentStatus: status,
        utr: utr.trim() || undefined,
        notes: notes.trim() || undefined,
        autoConfirmOrder: autoConfirm,
      });
      onClose();
    } catch (err) {
      console.error("Failed to verify payment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Verify Incoming UPI Payment
              </DialogTitle>
              <DialogDescription className="text-xs">
                Confirm fund receipt for order #{order.orderNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Order & Payment Summary Card */}
          <div className="rounded-lg border bg-neutral-50/70 p-3 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-neutral-900">
                  {order.customerFirstName} {order.customerLastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.customerPhone} • {order.city}, {order.state}
                </p>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-neutral-900 flex items-center justify-end">
                  <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                  {order.total.toLocaleString("en-IN")}
                </div>
                <Badge
                  variant="outline"
                  className={
                    order.paymentStatus === "paid"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 text-[10px]"
                      : "border-amber-300 bg-amber-50 text-amber-700 text-[10px]"
                  }
                >
                  {order.paymentStatus.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Target Account Note */}
            <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
                <span>Store UPI: <strong className="text-neutral-800">swathykjose-6@okhdfcbank</strong></span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyVpa}
                className="h-6 px-1.5 text-[11px] gap-1 text-neutral-600"
              >
                {copiedVpa ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedVpa ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Items Preview */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Order Items ({order.items.length})
              </p>
              <div className="rounded-md border divide-y max-h-32 overflow-y-auto bg-card">
                {order.items.map((item) => (
                  <div key={item.id} className="p-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productTitle}
                          className="w-7 h-7 rounded object-cover shrink-0"
                        />
                      )}
                      <div className="truncate">
                        <span className="font-medium text-neutral-800 truncate block">
                          {item.productTitle}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          Qty: {item.quantity} • {item.variantTitle}
                        </span>
                      </div>
                    </div>
                    <span className="font-medium shrink-0 ml-2">
                      ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank UTR / Reference ID Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-800 flex items-center justify-between">
              <span>Bank UPI Reference / UTR Number</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                12-digit reference from GPay/PhonePe/Bank SMS
              </span>
            </label>
            <Input
              placeholder="e.g. 432198765432"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              className="font-mono text-xs h-9"
            />
          </div>

          {/* Verification Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-800">
              Admin Verification Notes (Optional)
            </label>
            <Textarea
              placeholder="e.g. Verified received in HDFC account on 27 Nov"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs min-h-[50px] resize-none"
            />
          </div>

          {/* Auto-confirm checkbox */}
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={autoConfirm}
              onChange={(e) => setAutoConfirm(e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 w-4 h-4"
            />
            <span className="text-xs text-neutral-700">
              Automatically move order to <strong>Confirmed</strong> for dropship placement
            </span>
          </label>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSubmit("failed")}
            disabled={isSubmitting}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Mark Unpaid / Failed
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleSubmit("paid")}
              disabled={isSubmitting}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirm Received (₹{order.total.toLocaleString("en-IN")})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
