"use client";

import { CheckCircle2, Shield, Cloud, Database, HardDrive, Mail, CreditCard, Activity, Key } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const cloudServices = [
  {
    name: "Cloudflare Workers",
    role: "Hono Backend Runtime",
    icon: Cloud,
    status: "Operational",
    tier: "Free Tier",
    usage: "4,200 / 100,000 req/day",
    percentage: 4.2,
    details: "Global edge deployment across 330+ locations with 0ms cold starts.",
  },
  {
    name: "Cloudflare R2",
    role: "Product Image Storage",
    icon: HardDrive,
    status: "Operational",
    tier: "Free Tier",
    usage: "1.2 GB / 10.0 GB",
    percentage: 12.0,
    details: "$0 bandwidth egress fees. Presigned browser upload URLs enabled.",
  },
  {
    name: "Neon PostgreSQL",
    role: "Serverless Database",
    icon: Database,
    status: "Operational",
    tier: "Free Tier",
    usage: "45 MB / 512 MB",
    percentage: 8.8,
    details: "Connection pooling enabled via @neondatabase/serverless over HTTP/WebSockets.",
  },
  {
    name: "Upstash Redis",
    role: "Cart & Rate Limiting",
    icon: Activity,
    status: "Operational",
    tier: "Free Tier",
    usage: "850 / 10,000 cmds/day",
    percentage: 8.5,
    details: "Sliding-window DDoS and payment card-testing protection active.",
  },
  {
    name: "Resend",
    role: "Transactional Email",
    icon: Mail,
    status: "Operational",
    tier: "Free Tier",
    usage: "184 / 3,000 emails/mo",
    percentage: 6.1,
    details: "Automated order confirmation templates and tracking updates.",
  },
  {
    name: "Stripe & Razorpay",
    role: "Global & Domestic Payments",
    icon: CreditCard,
    status: "Connected",
    tier: "Pay-As-You-Go",
    usage: "0 Fixed Monthly Cost",
    percentage: 100,
    details: "Cryptographic HMAC webhook verification active on both gateways.",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A211D]">
          Settings & Infrastructure
        </h1>
        <p className="text-xs text-[#737F76] mt-0.5">
          Real-time quotas, free tier limits, and API configurations for your serverless stack.
        </p>
      </div>

      <Tabs defaultValue="quotas" className="w-full">
        <TabsList className="grid w-full sm:w-[450px] grid-cols-3">
          <TabsTrigger value="quotas">Cloud Quotas</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="store">Store Config</TabsTrigger>
        </TabsList>

        {/* Tab 1: Cloud Quotas */}
        <TabsContent value="quotas" className="mt-4 space-y-6">
          <Card className="bg-[#EAF3EE] border-[#D5DDD6]">
            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#194F36]" />
                  <h2 className="text-base font-bold text-[#1A211D]">Shopify Alternative Architecture</h2>
                </div>
                <p className="text-xs text-[#58635D]">
                  Running 100% on generous free tiers. Saves $39 – $399/month in SaaS platform fees.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-3xl font-extrabold text-[#194F36]">$0.00</span>
                <span className="text-[11px] text-[#737F76] block">Fixed Monthly Cloud Cost</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cloudServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <Card key={svc.name} className="hover:border-[#194F36]/50 transition-colors">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#EAF3EE] flex items-center justify-center text-[#194F36]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">{svc.name}</CardTitle>
                        <CardDescription className="text-[11px]">{svc.role}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="success" className="text-[10px] gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {svc.status}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-[#58635D]">{svc.tier}</span>
                        <span className="font-bold text-[#1A211D]">{svc.usage}</span>
                      </div>
                      <div className="w-full bg-[#E8EFEA] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#194F36] h-full rounded-full transition-all"
                          style={{ width: `${Math.min(svc.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-[#737F76]">{svc.details}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: API Keys */}
        <TabsContent value="keys" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#194F36]" /> Connected Service Endpoints
              </CardTitle>
              <CardDescription>
                Credentials configured in server .dev.vars and Cloudflare Workers secrets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                  Hono Backend API URL
                </label>
                <Input defaultValue="http://localhost:8787" readOnly className="font-mono text-xs bg-[#F2F5EF]/60" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                  Stripe Webhook Endpoint
                </label>
                <Input defaultValue="https://server.yourstore.workers.dev/webhooks/stripe" readOnly className="font-mono text-xs bg-[#F2F5EF]/60" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                  Razorpay Webhook Endpoint
                </label>
                <Input defaultValue="https://server.yourstore.workers.dev/webhooks/razorpay/verify" readOnly className="font-mono text-xs bg-[#F2F5EF]/60" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Store Config */}
        <TabsContent value="store" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Storefront Configuration</CardTitle>
              <CardDescription>Currency, tax, and regional defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                    Default Currency
                  </label>
                  <Input defaultValue="USD ($)" className="text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                    Store Brand Name
                  </label>
                  <Input defaultValue="Dainty Dazzle" className="text-xs" />
                </div>
              </div>
              <Button className="bg-[#194F36] hover:bg-[#133D2A] text-white">
                Save Store Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
