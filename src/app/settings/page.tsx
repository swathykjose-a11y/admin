import { CheckCircle2, Shield, Cloud, Database, HardDrive, Mail, CreditCard, Activity } from "lucide-react";

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
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111815]">
          Cloud Infrastructure & Quota Monitor
        </h1>
        <p className="text-sm text-[#737F76] mt-0.5">
          Real-time health, latency, and free tier utilization of your modern serverless backend stack.
        </p>
      </div>

      {/* Free Tier Capacity Card */}
      <div className="bg-white border border-[#E2E8E4] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8E4]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#194F36]" />
              <h2 className="text-lg font-bold text-[#111815]">Shopify Alternative Architecture</h2>
            </div>
            <p className="text-xs text-[#737F76]">
              Running 100% on generous free tiers. Eliminates Shopify&apos;s $39/mo - $399/mo subscription fees.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-[#194F36]">$0.00</span>
            <span className="text-xs text-[#737F76] block">Monthly Fixed Cloud Bill</span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cloudServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.name}
                className="p-4 rounded-xl border border-[#E2E8E4] bg-[#F8FAF9] flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8E4] flex items-center justify-center text-[#194F36]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111815]">{svc.name}</h4>
                      <p className="text-xs text-[#737F76]">{svc.role}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    {svc.status}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#58635D]">{svc.tier}</span>
                    <span className="font-semibold text-[#111815]">{svc.usage}</span>
                  </div>
                  <div className="w-full bg-[#E2E8E4] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#194F36] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(svc.percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#737F76]">{svc.details}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

