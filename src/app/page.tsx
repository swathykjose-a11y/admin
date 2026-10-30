"use client";

import Link from "next/link";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  Cloud,
  Database,
  HardDrive,
  Activity,
  CheckCircle2
} from "lucide-react";
import { MetricsCard } from "../components/MetricsCard";
import { Badge } from "../components/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";

const recentOrders = [
  {
    id: "ord_1",
    orderNumber: "ORD-9281-402",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah@example.com",
    total: "$149.00",
    paymentStatus: "paid",
    status: "processing",
    date: "12 mins ago",
  },
  {
    id: "ord_2",
    orderNumber: "ORD-9280-119",
    customerName: "Alex Rivera",
    customerEmail: "alex@example.com",
    total: "$89.50",
    paymentStatus: "paid",
    status: "shipped",
    date: "1 hour ago",
  },
  {
    id: "ord_3",
    orderNumber: "ORD-9279-881",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    total: "$240.00",
    paymentStatus: "pending",
    status: "pending",
    date: "3 hours ago",
  },
  {
    id: "ord_4",
    orderNumber: "ORD-9278-301",
    customerName: "Marcus Vance",
    customerEmail: "marcus@example.com",
    total: "$64.00",
    paymentStatus: "paid",
    status: "delivered",
    date: "Yesterday",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A211D]">Store Overview</h1>
          <p className="text-xs text-[#737F76] mt-0.5">
            Cloudflare Workers & Neon Postgres telemetry with shadcn UI components.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="bg-[#194F36] hover:bg-[#133D2A] text-white">
            <Link href="/products/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Primary Tabs Navigation */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full sm:w-[420px] grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Live Orders</TabsTrigger>
          <TabsTrigger value="telemetry">Edge Status</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Total Revenue"
              value="$14,280.00"
              change="+18.4%"
              subtitle="vs last month"
              icon={DollarSign}
            />
            <MetricsCard
              title="Total Orders"
              value="184"
              change="+12.1%"
              subtitle="vs last month"
              icon={ShoppingCart}
            />
            <MetricsCard
              title="Active Products"
              value="42"
              subtitle="100% in R2 storage"
              icon={Package}
            />
            <MetricsCard
              title="Total Customers"
              value="260"
              change="+8.3%"
              subtitle="new accounts"
              icon={Users}
            />
          </div>

          {/* Architecture Card Banner */}
          <Card className="bg-[#EAF3EE] border-[#D5DDD6]">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <h4 className="text-sm font-bold text-[#1A211D]">
                    Edge Microservices Operating Normally
                  </h4>
                </div>
                <p className="text-xs text-[#58635D]">
                  Workers (0ms cold start) • Neon Serverless Postgres • Cloudflare R2 ($0 egress) • Upstash Redis Rate Limiting
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="border-[#D5DDD6] bg-white text-[#194F36] hover:bg-white/80">
                <Link href="/settings">
                  <span>View Quota Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Orders Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#D5DDD6] py-4">
              <div>
                <CardTitle className="text-base">Recent Stream</CardTitle>
                <CardDescription>Processed via Stripe & Razorpay webhooks</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs text-[#194F36]">
                <Link href="/orders">View all orders →</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((ord) => (
                    <TableRow key={ord.id}>
                      <TableCell className="font-mono text-xs font-semibold">{ord.orderNumber}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-xs text-[#1A211D]">{ord.customerName}</div>
                        <div className="text-[11px] text-[#737F76]">{ord.customerEmail}</div>
                      </TableCell>
                      <TableCell className="font-bold">{ord.total}</TableCell>
                      <TableCell><Badge status={ord.paymentStatus} /></TableCell>
                      <TableCell><Badge status={ord.status} /></TableCell>
                      <TableCell className="text-right text-xs text-[#737F76]">{ord.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Live Orders Stream */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="border-b border-[#D5DDD6]">
              <CardTitle>Real-Time Checkout Feed</CardTitle>
              <CardDescription>All incoming transactions and webhook state changes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((ord) => (
                    <TableRow key={ord.id}>
                      <TableCell className="font-mono text-xs">{ord.orderNumber}</TableCell>
                      <TableCell>{ord.customerName}</TableCell>
                      <TableCell><Badge status="Stripe" className="bg-[#EAF3EE] text-[#194F36] border-0" /></TableCell>
                      <TableCell className="font-bold">{ord.total}</TableCell>
                      <TableCell><Badge status={ord.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Edge Telemetry */}
        <TabsContent value="telemetry" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-[#194F36]" /> Cloudflare Workers
                </CardTitle>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Active</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-[#1A211D]">4.2% used</div>
                <p className="text-xs text-[#737F76] mt-1">4,200 / 100,000 free requests today</p>
                <div className="w-full bg-[#E8EFEA] h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#194F36] h-full rounded-full" style={{ width: "4.2%" }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#194F36]" /> Cloudflare R2
                </CardTitle>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Active</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-[#1A211D]">1.2 GB / 10 GB</div>
                <p className="text-xs text-[#737F76] mt-1">12% storage consumed • $0 bandwidth egress</p>
                <div className="w-full bg-[#E8EFEA] h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#194F36] h-full rounded-full" style={{ width: "12%" }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#194F36]" /> Neon PostgreSQL
                </CardTitle>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Healthy</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-[#1A211D]">45 MB / 512 MB</div>
                <p className="text-xs text-[#737F76] mt-1">8.8% storage consumed • Connection pooling warm</p>
                <div className="w-full bg-[#E8EFEA] h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#194F36] h-full rounded-full" style={{ width: "8.8%" }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#194F36]" /> Upstash Redis
                </CardTitle>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Guarded</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-[#1A211D]">850 / 10,000 cmds</div>
                <p className="text-xs text-[#737F76] mt-1">8.5% rate limit capacity utilized today</p>
                <div className="w-full bg-[#E8EFEA] h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#194F36] h-full rounded-full" style={{ width: "8.5%" }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
