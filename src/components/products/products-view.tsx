"use client";

import { useState } from "react";
import type { AdminProduct } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Tag, Search, Sparkles, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { adminApi } from "@/lib/api";

interface ProductsViewProps {
  products: AdminProduct[];
  onAddProduct: (product: Partial<AdminProduct>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onRefresh?: () => void;
}

export function ProductsView({
  products,
  onAddProduct,
  onDeleteProduct,
}: ProductsViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Product Form State
  const [title, setTitle] = useState("");
  const [handle, setHandle] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("earrings, gold, new");
  const [stock, setStock] = useState("20");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Image file must be under 8MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const uploadRes = await adminApi.uploadImage(base64);
          setImageUrl(uploadRes.url);
        } catch (err: any) {
          alert(`Image upload failed: ${err?.message || "Unknown error"}`);
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingImage(false);
      alert("Failed to read image file");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.handle.toLowerCase().includes(search.toLowerCase()),
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setHandle(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !minPrice) return;

    setIsSubmitting(true);
    try {
      const priceNum = parseFloat(minPrice) || 999;
      const compareNum = compareAtPrice ? parseFloat(compareAtPrice) : undefined;
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await onAddProduct({
        title,
        handle: handle || `item-${Date.now()}`,
        descriptionHtml: `<p>${description}</p>`,
        minPrice: priceNum,
        compareAtPrice: compareNum,
        totalInventory: parseInt(stock, 10) || 10,
        availableForSale: true,
        tags: parsedTags,
        images: imageUrl ? [{ url: imageUrl, altText: title }] : [],
        variants: [
          {
            title: "Standard",
            price: priceNum,
            compareAtPrice: compareNum,
            availableForSale: true,
            quantityAvailable: parseInt(stock, 10) || 10,
          },
        ],
      });

      setIsAddOpen(false);
      // Reset form
      setTitle("");
      setHandle("");
      setMinPrice("");
      setCompareAtPrice("");
      setDescription("");
      setImageUrl("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search products by title or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9"
          />
        </div>

        <Button
          id="admin-add-product-btn"
          onClick={() => setIsAddOpen(true)}
          className="gap-1.5 text-xs h-9 bg-neutral-900 text-white"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px] text-xs">Image</TableHead>
              <TableHead className="text-xs">Product Details</TableHead>
              <TableHead className="text-xs">Price (INR)</TableHead>
              <TableHead className="text-xs">Inventory</TableHead>
              <TableHead className="text-xs">Tags</TableHead>
              <TableHead className="text-right text-xs">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground text-xs"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((prod) => (
                <TableRow key={prod.id} className="text-xs">
                  <TableCell>
                    {prod.images?.[0]?.url ? (
                      <img
                        src={prod.images[0].url}
                        alt={prod.title}
                        className="w-12 h-14 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-12 h-14 bg-muted rounded border flex items-center justify-center text-[10px] text-muted-foreground">
                        No img
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="font-medium text-neutral-900">
                      {prod.title}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      /products/{prod.handle}
                    </div>
                  </TableCell>

                  <TableCell className="font-mono">
                    <span className="font-semibold">
                      ₹{Number(prod.minPrice).toFixed(0)}
                    </span>
                    {prod.compareAtPrice && (
                      <span className="text-muted-foreground line-through ml-1.5 text-[11px]">
                        ₹{Number(prod.compareAtPrice).toFixed(0)}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {prod.totalInventory} in stock
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {prod.tags?.map((t) => (
                        <span
                          key={t}
                          className="bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded text-[10px] font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-500 hover:text-red-600"
                      onClick={() => onDeleteProduct(prod.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Add New Product
            </DialogTitle>
            <DialogDescription>
              Create a new item in your jewelry store catalog.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Product Title *
              </label>
              <Input
                placeholder="e.g. Celestial Freshwater Pearl Choker"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                URL Handle / Slug
              </label>
              <Input
                placeholder="e.g. celestial-freshwater-pearl-choker"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="text-xs font-mono h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Selling Price (₹ INR) *
                </label>
                <Input
                  type="number"
                  placeholder="999"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  required
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  Compare At / Strikethrough Price (₹ INR)
                </label>
                <Input
                  type="number"
                  placeholder="1499"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700 block">
                Product Image (Cloudinary or Direct URL)
              </label>

              {/* Upload to Cloudinary trigger */}
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <div className="border border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50/60 hover:bg-neutral-50 rounded-md px-3 py-2 flex items-center justify-center gap-2 text-xs text-neutral-600 transition-colors">
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Upload Image File (Cloudinary)</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingImage}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* Direct URL input fallback */}
              <Input
                placeholder="Or paste image URL (https://res.cloudinary.com/...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="text-xs h-9 font-mono text-[11px]"
              />

              {/* Image Preview thumbnail if available */}
              {imageUrl && (
                <div className="flex items-center gap-2.5 p-2 bg-neutral-50 rounded border">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded bg-neutral-200 border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-neutral-700 truncate">
                      {imageUrl.includes("cloudinary") ? "Cloudinary CDN Image" : "External Image"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate font-mono">
                      {imageUrl}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImageUrl("")}
                    className="text-xs text-red-500 hover:text-red-700 h-6 px-2"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Tags (Comma separated)
              </label>
              <Input
                placeholder="earrings, gold, new, bestseller"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Description
              </label>
              <Textarea
                placeholder="Crafted with intention. Minimalist 18k gold vermeil..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
