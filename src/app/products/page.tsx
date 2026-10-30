"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { Badge } from "../../components/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const sampleProducts = [
  {
    id: "prod_1",
    title: "Minimalist Ceramic Matcha Bowl",
    slug: "minimalist-ceramic-matcha-bowl",
    price: "$48.00",
    status: "published",
    category: "Tableware",
    inventory: 34,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "prod_2",
    title: "Organic Linen Bedding Set (Queen)",
    slug: "organic-linen-bedding-set",
    price: "$185.00",
    status: "published",
    category: "Home",
    inventory: 12,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "prod_3",
    title: "Hand-Poured Soy Wax Candle (Sage & Cedar)",
    slug: "soy-wax-candle-sage-cedar",
    price: "$28.00",
    status: "published",
    category: "Fragrance",
    inventory: 56,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "prod_4",
    title: "Brushed Brass Coffee Dripper",
    slug: "brushed-brass-coffee-dripper",
    price: "$62.00",
    status: "draft",
    category: "Kitchen",
    inventory: 0,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80",
  },
];

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredProducts = sampleProducts.filter((p) => {
    const matchesTab = activeTab === "all" || p.status === activeTab;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A211D]">Product Catalog</h1>
          <p className="text-xs text-[#737F76] mt-0.5">
            Cloudflare R2 images and Neon Postgres listings with shadcn UI.
          </p>
        </div>
        <Button asChild className="bg-[#194F36] hover:bg-[#133D2A] text-white">
          <Link href="/products/new">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All ({sampleProducts.length})</TabsTrigger>
            <TabsTrigger value="published">Published ({sampleProducts.filter(p => p.status === "published").length})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({sampleProducts.filter(p => p.status === "draft").length})</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#737F76] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title or category..."
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
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover border border-[#D5DDD6]"
                          />
                          <div>
                            <p className="font-bold text-xs text-[#1A211D]">{p.title}</p>
                            <p className="text-[11px] text-[#737F76] font-mono">{p.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-[#58635D]">{p.category}</TableCell>
                      <TableCell>
                        <Badge status={p.status} />
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-semibold ${
                            p.inventory > 0 ? "text-[#1A211D]" : "text-rose-600"
                          }`}
                        >
                          {p.inventory > 0 ? `${p.inventory} in stock` : "Out of stock"}
                        </span>
                      </TableCell>
                      <TableCell className="font-extrabold text-[#1A211D]">{p.price}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-xs text-[#194F36] hover:bg-[#EAF3EE]">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-xs text-[#737F76]">
                        No products found matching &ldquo;{search}&rdquo;.
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
