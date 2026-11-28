"use client";

import { useState, useMemo } from "react";
import type { AdminOrder, AdminProduct } from "@/types/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IndianRupee,
  TrendingUp,
  Percent,
  ShoppingBag,
  ArrowUpRight,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface RevenueViewProps {
  orders: AdminOrder[];
  products?: AdminProduct[];
}

export function RevenueView({ orders, products = [] }: RevenueViewProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

  // Filter orders by time range
  const filteredOrders = useMemo(() => {
    if (timeRange === "all") return orders;
    const now = new Date();
    const days = timeRange === "7d" ? 7 : 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return orders.filter((o) => new Date(o.createdAt) >= cutoff);
  }, [orders, timeRange]);

  // Aggregate Metrics
  const grossRevenue = useMemo(
    () => filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    [filteredOrders],
  );

  const paidOrders = useMemo(
    () => filteredOrders.filter((o) => o.paymentStatus === "paid"),
    [filteredOrders],
  );
  const verifiedRevenue = useMemo(
    () => paidOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    [paidOrders],
  );
  const aov = filteredOrders.length > 0 ? grossRevenue / filteredOrders.length : 0;
  const paidOrdersCount = paidOrders.length;
  const paymentSuccessRate =
    filteredOrders.length > 0 ? (paidOrdersCount / filteredOrders.length) * 100 : 100;

  // Chart Data: Timeline Trend (Revenue & Verified Paid over time)
  const timelineData = useMemo(() => {
    const daysMap: Record<string, { date: string; revenue: number; profit: number; orders: number }> = {};

    // Default last 7 or 14 days if orders are few
    const dayCount = timeRange === "7d" ? 7 : 14;
    for (let i = dayCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      daysMap[key] = { date: key, revenue: 0, profit: 0, orders: 0 };
    }

    filteredOrders.forEach((o) => {
      const dateKey = new Date(o.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      if (!daysMap[dateKey]) {
        daysMap[dateKey] = { date: dateKey, revenue: 0, profit: 0, orders: 0 };
      }
      const rev = o.total || 0;
      daysMap[dateKey].revenue += rev;
      if (o.paymentStatus === "paid") {
        daysMap[dateKey].profit += rev;
      }
      daysMap[dateKey].orders += 1;
    });

    return Object.values(daysMap);
  }, [filteredOrders, timeRange]);

  // Chart Data: Category Breakdown
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {
      Earrings: 0,
      Necklaces: 0,
      Pendants: 0,
      Rings: 0,
    };

    filteredOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const title = item.productTitle.toLowerCase();
        const itemRevenue = item.price * item.quantity;
        if (title.includes("earring") || title.includes("hoop") || title.includes("stud")) {
          categories.Earrings += itemRevenue;
        } else if (title.includes("necklace") || title.includes("chain")) {
          categories.Necklaces += itemRevenue;
        } else if (title.includes("pendant")) {
          categories.Pendants += itemRevenue;
        } else {
          categories.Rings += itemRevenue;
        }
      });
    });

    const colors = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6"];
    return Object.entries(categories)
      .filter(([_, value]) => value > 0)
      .map(([name, value], idx) => ({
        name,
        value,
        color: colors[idx % colors.length],
      }));
  }, [filteredOrders]);

  // Product Sales Breakdown
  const productSales = useMemo(() => {
    return products.map((p) => {
      const sellingPrice = p.minPrice;
      const unitsSold = orders.reduce((sum, o) => {
        const item = (o.items || []).find((i) => i.productId === p.id || i.productHandle === p.handle);
        return sum + (item ? item.quantity : 0);
      }, 0);
      const totalGenerated = unitsSold * sellingPrice;

      return {
        id: p.id,
        title: p.title,
        handle: p.handle,
        sellingPrice,
        unitsSold,
        totalGenerated,
      };
    });
  }, [products, orders]);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-neutral-700" />
            Revenue &amp; Sales Analytics
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Financial analytics, verified UPI collections, and product performance
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg border">
          <Calendar className="w-3.5 h-3.5 text-neutral-500 ml-2 mr-1" />
          <Button
            variant={timeRange === "7d" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("7d")}
            className="h-7 text-xs px-2.5"
          >
            Last 7 Days
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("30d")}
            className="h-7 text-xs px-2.5"
          >
            Last 30 Days
          </Button>
          <Button
            variant={timeRange === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("all")}
            className="h-7 text-xs px-2.5"
          >
            All Time
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Gross Revenue
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-neutral-900">
              ₹{grossRevenue.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>{filteredOrders.length} customer orders</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Verified UPI Revenue
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-blue-900">
              ₹{verifiedRevenue.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {paidOrdersCount} verified paid orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Verification Rate
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-neutral-900">
              {paymentSuccessRate.toFixed(1)}%
            </div>
            <p className="text-[11px] text-purple-600 font-medium mt-1">
              Target margin: &gt; 60.0%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Average Order Value (AOV)
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-neutral-900">
              ₹{Math.round(aov).toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {paymentSuccessRate.toFixed(0)}% payment capture rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Area Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-900">
              Revenue & Profit Timeline
            </CardTitle>
            <CardDescription className="text-xs">
              Daily gross sales compared against verified UPI collections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderRadius: "6px",
                      border: "none",
                      color: "#F9FAFB",
                      fontSize: "12px",
                    }}
                    formatter={(value: any, name: any) => [
                      `₹${Number(value).toLocaleString("en-IN")}`,
                      name === "revenue" ? "Gross Sales" : "Net Profit",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                    name="revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#profitGrad)"
                    name="profit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown (1 col) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-900 flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-neutral-500" />
              Category Sales
            </CardTitle>
            <CardDescription className="text-xs">
              Revenue distribution by jewelry collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="h-72 w-full flex flex-col justify-center items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => `₹${Number(val).toLocaleString("en-IN")}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  {categoryData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-neutral-600">{item.name}</span>
                      <span className="font-semibold text-neutral-900">
                        ₹{item.value.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-xs text-muted-foreground">
                No categorical sales data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Sales Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium text-neutral-900">
                Product Sales Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                Per-product selling price, units sold, and total revenue
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[11px] font-mono">
              {productSales.length} Products
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="text-[11px] uppercase tracking-wider bg-neutral-50/70">
                <TableHead>Product Title</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productSales.map((item) => (
                <TableRow key={item.id} className="text-xs">
                  <TableCell className="font-medium text-neutral-900">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ₹{item.sellingPrice.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right font-mono text-neutral-600">
                    {item.unitsSold}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-neutral-900">
                    ₹{item.totalGenerated.toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
