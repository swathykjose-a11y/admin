"use client";

import { useState } from "react";
import { Search, Mail, Phone, Calendar } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

const sampleCustomers = [
  {
    id: "cust_1",
    name: "Sarah Jenkins",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    ordersCount: 4,
    totalSpent: "$542.00",
    spentNum: 542,
    joinedDate: "Aug 14, 2026",
    city: "Springfield, OR",
  },
  {
    id: "cust_2",
    name: "Alex Rivera",
    email: "alex@example.com",
    phone: "+1 (555) 876-5432",
    ordersCount: 2,
    totalSpent: "$189.50",
    spentNum: 189.5,
    joinedDate: "Sep 02, 2026",
    city: "Bikini Bottom, CA",
  },
  {
    id: "cust_3",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    ordersCount: 1,
    totalSpent: "$240.00",
    spentNum: 240,
    joinedDate: "Oct 28, 2026",
    city: "London, UK",
  },
  {
    id: "cust_4",
    name: "Marcus Vance",
    email: "marcus@example.com",
    phone: "+1 (555) 345-6789",
    ordersCount: 5,
    totalSpent: "$694.00",
    spentNum: 694,
    joinedDate: "Jul 19, 2026",
    city: "Quahog, RI",
  },
];

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredCustomers = sampleCustomers.filter((c) => {
    let matchesTab = true;
    if (activeTab === "repeat") matchesTab = c.ordersCount > 1;
    if (activeTab === "high") matchesTab = c.spentNum >= 500;

    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A211D]">Customer Management</h1>
        <p className="text-xs text-[#737F76] mt-0.5">
          View customer accounts, lifetime spend, order histories, and addresses.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All ({sampleCustomers.length})</TabsTrigger>
            <TabsTrigger value="repeat">Repeat Buyers ({sampleCustomers.filter(c => c.ordersCount > 1).length})</TabsTrigger>
            <TabsTrigger value="high">High Value ($500+) ({sampleCustomers.filter(c => c.spentNum >= 500).length})</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#737F76] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, city..."
              className="pl-9 bg-white border-[#D5DDD6]"
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((cust) => (
                    <TableRow key={cust.id}>
                      <TableCell>
                        <div className="font-bold text-xs text-[#1A211D]">{cust.name}</div>
                        <div className="flex items-center gap-3 text-[11px] text-[#737F76] mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {cust.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {cust.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-[#58635D]">{cust.city}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-semibold text-xs">
                          {cust.ordersCount} orders
                        </Badge>
                      </TableCell>
                      <TableCell className="font-extrabold text-[#1A211D]">{cust.totalSpent}</TableCell>
                      <TableCell className="text-xs text-[#737F76]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {cust.joinedDate}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-xs text-[#194F36] hover:bg-[#EAF3EE]">
                          View Orders
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-xs text-[#737F76]">
                        No customers match this filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
