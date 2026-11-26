"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  IndianRupee,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

interface UpiQrDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vpa: string;
  payeeName: string;
  phone: string;
}

export function UpiQrDialog({
  isOpen,
  onClose,
  vpa,
  payeeName,
  phone,
}: UpiQrDialogProps) {
  const [testAmount, setTestAmount] = useState<number>(1299);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);

  const queryParams = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: testAmount.toFixed(2),
    cu: "INR",
    tn: "Dainty Dazzle Preview Order",
  });
  const upiUri = `upi://pay?${queryParams.toString()}`;

  // QR Code URL using standard qr service for instant preview
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    upiUri,
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiUri);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
            <QrCode className="w-5 h-5" />
          </div>
          <DialogTitle className="text-base font-semibold">
            Storefront UPI Receiving QR Code
          </DialogTitle>
          <DialogDescription className="text-xs">
            Direct customer payment destination configured on server
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* QR Code Container */}
          <div className="bg-white border rounded-xl p-4 shadow-xs inline-block mx-auto">
            <img
              src={qrUrl}
              alt="Store UPI QR Code"
              className="w-48 h-48 mx-auto rounded-lg object-contain"
            />
            <div className="mt-2 text-xs font-semibold text-neutral-800 flex items-center justify-center gap-1">
              <span>Pay ₹{testAmount.toLocaleString("en-IN")} to</span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {payeeName}
              </Badge>
            </div>
          </div>

          {/* Account Details Box */}
          <div className="bg-neutral-50 border rounded-lg p-3 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">UPI ID (VPA):</span>
              <div className="flex items-center gap-1.5 font-mono font-medium text-neutral-900">
                <span>{vpa}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyVpa}
                  className="h-6 w-6 p-0"
                >
                  {copiedVpa ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-neutral-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payee Name:</span>
              <span className="font-medium text-neutral-900">{payeeName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Linked Phone:</span>
              <span className="font-medium text-neutral-900">+91 {phone}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t">
              <span className="text-muted-foreground">Test Amount (₹):</span>
              <Input
                type="number"
                value={testAmount}
                onChange={(e) => setTestAmount(Number(e.target.value) || 0)}
                className="w-24 h-7 text-xs text-right font-medium"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs gap-1.5"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedLink ? "Link Copied" : "Copy UPI Link"}
            </Button>
            <a href={upiUri} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="text-xs gap-1.5 bg-neutral-900 text-white">
                <ExternalLink className="w-3.5 h-3.5" />
                Test on Device
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
