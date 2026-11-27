"use client";

import { useState } from "react";
import type {
  AdminOrder,
  PaymentReceivingOverview,
  PaymentStatus,
} from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentVerifyDialog } from "./payment-verify-dialog";
import { UpiQrDialog } from "./upi-qr-dialog";
import {
  IndianRupee,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  Server,
  Activity,
  Layers,
  Sparkles,
  MessageCircle,
} from "lucide-react";

interface PaymentsViewProps {
  orders: AdminOrder[];
  overview: PaymentReceivingOverview | null;
  onVerifyPayment: (
    orderId: string,
    payload: {
      paymentStatus: "paid" | "failed" | "refunded";
      utr?: string;
      notes?: string;
      autoConfirmOrder?: boolean;
    },
  ) => Promise<void>;
  onRefresh: () => void;
  onNavigateToOrder?: (orderId: string) => void;
}

export function PaymentsView({
  orders,
  overview,
  onVerifyPayment,
  onRefresh,
  onNavigateToOrder,
}: PaymentsViewProps) {
  const [selectedOrderForVerify, setSelectedOrderForVerify] =
    useState<AdminOrder | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const storeUpi = overview?.storeUpi || {
    payeeName: "Swathy Jose",
    vpa: "swathykjose-6@okhdfcbank",
    phone: "9619408985",
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(storeUpi.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  // Pending verification orders
  const pendingOrders = orders.filter(
    (o) => o.paymentStatus === "pending" || !o.paymentStatus,
  );
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");

  // Filtered orders for ledger
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerFirstName.toLowerCase().includes(q) ||
      o.customerLastName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      (o.notes && o.notes.toLowerCase().includes(q));

    let matchesStatus = true;
    if (statusFilter === "pending") matchesStatus = o.paymentStatus === "pending";
    else if (statusFilter === "paid") matchesStatus = o.paymentStatus === "paid";
    else if (statusFilter === "upi") matchesStatus = o.paymentMethod === "upi";

    return matchesSearch && matchesStatus;
  });

  const totalCollectedInr = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingInr = pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* ─── 1. Store UPI Payment Receiving Account Card ─── */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50/40 via-neutral-50/20 to-teal-50/30 overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white gap-1 text-[11px] font-semibold px-2.5 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Direct UPI Receiving Active
                </Badge>
                <Badge variant="outline" className="border-emerald-300 text-emerald-800 text-[11px]">
                  Zero Gateway Commission (0% Fees)
                </Badge>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                  Storefront Payment Identity
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mt-0.5">
                  Customers pay directly into this personal/business UPI VPA at checkout. Funds land instantly in your bank account with order ID notes for manual or automated verification.
                </p>
              </div>

              {/* Account Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white/90 border border-neutral-200/80 rounded-lg p-2.5 shadow-2xs">
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    Store UPI ID (VPA)
                  </span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      {storeUpi.vpa}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyVpa}
                      className="h-6 px-1.5 text-xs text-neutral-600 hover:text-emerald-700 ml-1"
                    >
                      {copiedVpa ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-white/90 border border-neutral-200/80 rounded-lg p-2.5 shadow-2xs">
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    Payee Name
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5 truncate">
                    {storeUpi.payeeName}
                  </p>
                </div>

                <div className="bg-white/90 border border-neutral-200/80 rounded-lg p-2.5 shadow-2xs">
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    GPay / PhonePe Mobile
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">
                    +91 {storeUpi.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
              <Button
                onClick={() => setShowQrModal(true)}
                className="bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs gap-2 text-xs h-10 px-4"
              >
                <QrCode className="w-4 h-4" />
                View Customer QR Code
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyVpa}
                className="bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-300 gap-1.5 text-xs h-9 px-3"
              >
                {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedVpa ? "UPI ID Copied" : "Copy Payment ID"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── 2. Financial & Payment Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card className="hover:shadow-xs transition-shadow">
          <CardContent className="p-5 sm:p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Total Verified Paid
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                ₹{totalCollectedInr.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                {paidOrders.length} payments cleared
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-xs transition-shadow ${pendingOrders.length > 0 ? "border-amber-300 bg-amber-50/20" : ""}`}>
          <CardContent className="p-5 sm:p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Pending Verification
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-amber-700 mt-1">
                ₹{pendingInr.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-amber-600 font-medium mt-1">
                {pendingOrders.length} orders awaiting check
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xs transition-shadow">
          <CardContent className="p-5 sm:p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                UPI Direct Payments
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                {orders.filter((o) => o.paymentMethod === "upi").length}
              </h3>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                Primary payment method
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xs transition-shadow">
          <CardContent className="p-5 sm:p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Bank Cleared Orders
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                {paidOrders.length}
              </h3>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                Direct to Bank Account
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── 3. High-Priority Payment Verification Queue ─── */}
      {pendingOrders.length > 0 && (
        <Card className="border-amber-300 shadow-xs">
          <CardHeader className="bg-amber-50/50 border-b border-amber-200/70 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-neutral-900">
                    Awaiting Payment Verification ({pendingOrders.length})
                  </CardTitle>
                  <CardDescription className="text-xs text-neutral-600">
                    These customers placed an order and were shown your UPI QR code. Verify receipt in your bank/UPI app and click Confirm.
                  </CardDescription>
                </div>
              </div>

              <Badge variant="outline" className="border-amber-300 bg-amber-100/70 text-amber-800 self-start sm:self-auto text-xs">
                Action Required
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/80 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-neutral-900">
                        {order.orderNumber}
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono border-amber-300 bg-amber-50 text-amber-800">
                        Pending UPI
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-700">
                      <span className="font-semibold text-neutral-900">
                        {order.customerFirstName} {order.customerLastName}
                      </span>
                      <span className="text-neutral-500">{order.customerPhone}</span>
                      <span className="text-neutral-500">{order.city}, {order.state}</span>
                      <span className="text-neutral-500">
                        {order.items?.length || 1} item(s)
                      </span>
                    </div>

                    {order.notes && (
                      <p className="text-xs text-neutral-600 bg-neutral-100/80 rounded px-2 py-1 max-w-xl truncate">
                        <strong>Note:</strong> {order.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">
                        Order Total
                      </span>
                      <span className="text-base font-bold text-neutral-900">
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setSelectedOrderForVerify(order)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-9 px-3.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verify & Confirm
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── 4. All Payment Transactions & Audit Ledger ─── */}
      <Card>
        <CardHeader className="p-4 sm:p-5 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold">
                Payment Transactions & Verification Ledger
              </CardTitle>
              <CardDescription className="text-xs">
                History of all received payments, UPI verifications, and gateway records
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="text-xs gap-1.5 h-8"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search order, customer, phone, UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { key: "all", label: `All (${orders.length})` },
                { key: "pending", label: `Pending (${pendingOrders.length})` },
                { key: "paid", label: `Verified (${paidOrders.length})` },
                { key: "upi", label: "UPI Direct" },
              ].map((f) => (
                <Button
                  key={f.key}
                  variant={statusFilter === f.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(f.key)}
                  className={`text-xs h-8 px-2.5 whitespace-nowrap ${
                    statusFilter === f.key
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-50/60">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Order / Date</TableHead>
                  <TableHead className="text-xs font-semibold">Customer</TableHead>
                  <TableHead className="text-xs font-semibold">Method</TableHead>
                  <TableHead className="text-xs font-semibold">Amount</TableHead>
                  <TableHead className="text-xs font-semibold">Payment Status</TableHead>
                  <TableHead className="text-xs font-semibold">Reference / UTR / Note</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-xs">
                      No payment records matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const isPaid = order.paymentStatus === "paid";
                    return (
                      <TableRow key={order.id} className="hover:bg-neutral-50/50">
                        <TableCell>
                          <div className="font-mono text-xs font-semibold text-neutral-900">
                            {order.orderNumber}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="text-xs font-medium text-neutral-900">
                            {order.customerFirstName} {order.customerLastName}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {order.customerPhone}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            {order.paymentMethod || "upi"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <span className="font-semibold text-xs text-neutral-900">
                            ₹{order.total.toLocaleString("en-IN")}
                          </span>
                        </TableCell>

                        <TableCell>
                          {isPaid ? (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300 gap-1 text-[11px]">
                              <CheckCircle2 className="w-3 h-3" />
                              Paid / Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300 gap-1 text-[11px]">
                              <Clock className="w-3 h-3" />
                              Pending Verification
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="max-w-xs">
                          <p className="text-xs text-neutral-600 truncate font-mono">
                            {order.notes || "—"}
                          </p>
                        </TableCell>

                        <TableCell className="text-right">
                          {!isPaid ? (
                            <Button
                              size="sm"
                              onClick={() => setSelectedOrderForVerify(order)}
                              className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5"
                            >
                              Verify
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrderForVerify(order)}
                              className="text-[11px] h-7 text-neutral-600 hover:text-neutral-900 px-2"
                            >
                              Edit Note
                            </Button>
                          )}
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

      {/* Payment Verify Dialog */}
      <PaymentVerifyDialog
        order={selectedOrderForVerify}
        isOpen={!!selectedOrderForVerify}
        onClose={() => setSelectedOrderForVerify(null)}
        onVerify={onVerifyPayment}
      />

      {/* QR Code Dialog */}
      <UpiQrDialog
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        vpa={storeUpi.vpa}
        payeeName={storeUpi.payeeName}
        phone={storeUpi.phone}
      />
    </div>
  );
}
