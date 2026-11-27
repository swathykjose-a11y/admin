"use client";

import { useEffect, useState } from "react";
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
import {
  Plus,
  Trash2,
  Tag,
  Search,
  Sparkles,
  Upload,
  Loader2,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  IndianRupee,
  Link as LinkIcon,
  FolderPlus,
  Eye,
  ShoppingBag,
} from "lucide-react";
import { adminApi } from "@/lib/api";

const DEFAULT_CATEGORIES = [
  "Earrings",
  "Necklaces",
  "Rings",
  "Bracelets",
  "Anklets",
  "Jewelry Sets",
];

const SUGGESTED_TAGS = [
  "gold",
  "silver",
  "18k",
  "minimalist",
  "pearl",
  "bestseller",
  "new",
  "handcrafted",
];

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

  // Categories list (defaults + any custom created by admin)
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Add Product Form State
  const [title, setTitle] = useState("");
  const [handle, setHandle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Earrings");
  const [minPrice, setMinPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [tags, setTags] = useState("gold, new");
  const [stock, setStock] = useState("25");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch collections from server on mount to seed categories
  useEffect(() => {
    adminApi.getCategories().then((serverCats) => {
      if (serverCats && serverCats.length > 0) {
        const serverTitles = serverCats.map((c) => c.title);
        setCategories((prev) => Array.from(new Set([...DEFAULT_CATEGORIES, ...serverTitles])));
      }
    });
  }, []);

  const handleAddNewCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    // Capitalize nicely
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (!categories.includes(formatted)) {
      setCategories((prev) => [...prev, formatted]);
    }
    setSelectedCategory(formatted);
    setNewCategoryName("");
    setIsAddingCategory(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image file must be under 8MB");
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
          setUploadError(null);
        } catch (err: any) {
          setUploadError(err?.message || "Cloudinary upload failed");
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.onerror = () => {
        setIsUploadingImage(false);
        setUploadError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploadingImage(false);
      setUploadError(err?.message || "Failed to process image");
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setHandle(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
    );
  };

  const handleAddTag = (t: string) => {
    const current = tags
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (!current.includes(t)) {
      setTags([...current, t].join(", "));
    }
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

      // Add selected category to tags if not already present
      const categoryTag = selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (!parsedTags.includes(categoryTag)) {
        parsedTags.push(categoryTag);
      }

      await onAddProduct({
        title,
        handle: handle || `item-${Date.now()}`,
        category: selectedCategory,
        descriptionHtml: `<p>${description || title}</p>`,
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
      setSelectedCategory("Earrings");
      setMinPrice("");
      setCompareAtPrice("");
      setDescription("");
      setImageUrl("");
      setTags("gold, new");
      setUploadError(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine product category from tags or product properties
  const getProductCategory = (prod: AdminProduct): string => {
    if (prod.category) return prod.category;
    const tagList = prod.tags || [];
    for (const cat of categories) {
      const slug = cat.toLowerCase();
      const singular = slug.endsWith("s") ? slug.slice(0, -1) : slug;
      if (
        tagList.some((t) => t.toLowerCase() === slug || t.toLowerCase() === singular) ||
        prod.title.toLowerCase().includes(singular)
      ) {
        return cat;
      }
    }
    return "Jewelry";
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.handle.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  // Discount calculation preview
  const parsedMin = parseFloat(minPrice);
  const parsedCompare = parseFloat(compareAtPrice);
  const discountPercent =
    parsedMin > 0 && parsedCompare > parsedMin
      ? Math.round(((parsedCompare - parsedMin) / parsedCompare) * 100)
      : null;

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search products by title, slug, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-white"
          />
        </div>

        <Button
          id="admin-add-product-btn"
          onClick={() => setIsAddOpen(true)}
          className="gap-1.5 text-xs h-9 bg-neutral-900 hover:bg-neutral-800 text-white shadow-2xs font-medium cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-neutral-50/70 border-b">
            <TableRow>
              <TableHead className="w-[72px] text-xs font-semibold text-neutral-600">Image</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-600">Product Details</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-600">Category</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-600">Price (INR)</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-600">Inventory</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-600">Tags</TableHead>
              <TableHead className="text-right text-xs font-semibold text-neutral-600">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-16 text-muted-foreground text-xs"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-neutral-300" />
                    <p className="font-medium text-neutral-600">No products found</p>
                    <p className="text-[11px] text-neutral-400">Click &quot;Add Product&quot; to populate your store catalog.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((prod) => {
                const category = getProductCategory(prod);
                return (
                  <TableRow key={prod.id} className="text-xs hover:bg-neutral-50/40 transition-colors">
                    <TableCell>
                      {prod.images?.[0]?.url ? (
                        <img
                          src={prod.images[0].url}
                          alt={prod.title}
                          className="w-12 h-14 object-cover rounded-md border border-neutral-200/80 bg-neutral-100"
                        />
                      ) : (
                        <div className="w-12 h-14 bg-neutral-100 rounded-md border flex items-center justify-center text-[10px] text-neutral-400 font-mono">
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

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-neutral-100 text-neutral-800 font-medium text-[10px] px-2 py-0.5 border border-neutral-200/60"
                      >
                        {category}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-mono">
                      <span className="font-semibold text-neutral-900">
                        ₹
                        {Number(
                          (prod as any).priceRange?.minVariantPrice?.amount ??
                            prod.minPrice ??
                            (prod.variants?.[0]?.price as any)?.amount ??
                            prod.variants?.[0]?.price ??
                            0,
                        ).toFixed(0)}
                      </span>
                      {((prod as any).compareAtPriceRange?.minVariantPrice?.amount ||
                        prod.compareAtPrice) && (
                        <span className="text-muted-foreground line-through ml-1.5 text-[11px]">
                          ₹
                          {Number(
                            (prod as any).compareAtPriceRange?.minVariantPrice
                              ?.amount ?? prod.compareAtPrice,
                          ).toFixed(0)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[10px] bg-white">
                        {prod.totalInventory} in stock
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {prod.tags?.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded text-[10px] font-mono"
                          >
                            {t}
                          </span>
                        ))}
                        {prod.tags && prod.tags.length > 3 && (
                          <span className="text-[10px] text-neutral-400 font-mono self-center">
                            +{prod.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete "${prod.title}"? It will be removed immediately from both the catalog and the live storefront.`,
                            )
                          ) {
                            onDeleteProduct(prod.id);
                          }
                        }}
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ─── Impeccable Craft: Add Product Studio Modal ─── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="w-[95vw] sm:max-w-4xl lg:max-w-5xl max-h-[90vh] p-0 gap-0 rounded-2xl border bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-7 py-4.5 border-b bg-neutral-50/60 shrink-0 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold text-neutral-600 border-neutral-300">
                  Jewelry Catalog
                </Badge>
                <span className="text-neutral-300">•</span>
                <span className="text-xs text-neutral-500 font-medium">Product Studio</span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900">
                Add New Product
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Publish handcrafted pieces with instant category routing and Cloudinary CDN optimization.
              </DialogDescription>
            </div>
          </div>

          <form onSubmit={handleCreate} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Scrollable Form Body with 2-Column Studio Grid */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-7">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                
                {/* ─── LEFT COLUMN (col-span-7): Core Information & Pricing ─── */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Section 1: General Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      1. General Information
                    </h4>

                    <div className="space-y-3.5">
                      <div>
                        <label className="text-xs font-semibold text-neutral-800 block mb-1">
                          Product Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="e.g. Celestial Freshwater Pearl Choker"
                          value={title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          required
                          className="text-xs h-10 rounded-lg border-neutral-200 focus-visible:ring-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-800 block mb-1">
                          URL Slug / Handle
                        </label>
                        <div className="flex rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50/60 focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900">
                          <span className="text-[11px] text-neutral-500 px-3 py-2 border-r bg-neutral-100/70 font-mono flex items-center">
                            /products/
                          </span>
                          <input
                            type="text"
                            placeholder="celestial-freshwater-pearl-choker"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs font-mono bg-transparent outline-none text-neutral-900"
                          />
                        </div>
                      </div>

                      {/* Category Selection */}
                      <div className="pt-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-neutral-800">
                            Store Category <span className="text-red-500">*</span>
                          </label>
                          {!isAddingCategory && (
                            <button
                              type="button"
                              onClick={() => setIsAddingCategory(true)}
                              className="text-[11px] text-neutral-600 hover:text-neutral-950 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <FolderPlus className="w-3.5 h-3.5" />
                              + New Category
                            </button>
                          )}
                        </div>

                        {/* Category Chips */}
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isSelected
                                    ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs"
                                    : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                              }`}
                              >
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                {cat}
                              </button>
                            );
                          })}
                        </div>

                        {/* Inline New Category Creator */}
                        {isAddingCategory && (
                          <div className="mt-2.5 p-3 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-2">
                            <p className="text-[11px] font-semibold text-neutral-700">Add Custom Category</p>
                            <div className="flex gap-2">
                              <Input
                                placeholder="e.g. Chokers, Pendants, Bangles..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddNewCategory();
                                  }
                                }}
                                className="text-xs h-8.5 bg-white flex-1"
                                autoFocus
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleAddNewCategory()}
                                className="h-8.5 px-3 text-xs bg-neutral-900 text-white"
                              >
                                Add
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setIsAddingCategory(false);
                                  setNewCategoryName("");
                                }}
                                className="h-8.5 px-2 text-xs text-neutral-500"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              Products will automatically link to this category's collection page.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Pricing & Inventory */}
                  <div className="space-y-4 pt-3 border-t">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5" />
                      2. Pricing & Inventory
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="text-xs font-semibold text-neutral-800 block mb-1">
                          Selling Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-xs text-neutral-500 font-semibold">₹</span>
                          <Input
                            type="number"
                            placeholder="999"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            required
                            className="text-xs h-9.5 pl-6.5 font-mono font-medium rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-neutral-800">
                            Compare At (₹)
                          </label>
                          {discountPercent && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-xs text-neutral-400 font-semibold">₹</span>
                          <Input
                            type="number"
                            placeholder="1499"
                            value={compareAtPrice}
                            onChange={(e) => setCompareAtPrice(e.target.value)}
                            className="text-xs h-9.5 pl-6.5 font-mono rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-800 block mb-1">
                          Stock Quantity
                        </label>
                        <Input
                          type="number"
                          placeholder="25"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="text-xs h-9.5 font-mono rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Story & Metadata */}
                  <div className="space-y-4 pt-3 border-t">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      3. Story & Metadata
                    </h4>

                    <div className="space-y-3.5">
                      <div>
                        <label className="text-xs font-semibold text-neutral-800 block mb-1">
                          Tags (Comma separated)
                        </label>
                        <Input
                          placeholder="gold, 18k, minimalist, bestseller"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          className="text-xs h-9.5 rounded-lg"
                        />
                        {/* Quick tag suggestions */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[10px] text-neutral-400">Quick add:</span>
                          {SUGGESTED_TAGS.map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleAddTag(st)}
                              className="text-[10px] font-mono bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                            >
                              +{st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-800 block mb-1">
                          Description & Craft Notes
                        </label>
                        <Textarea
                          placeholder="Handcrafted with precision. Minimalist 18k gold vermeil designed for everyday elegance..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="text-xs rounded-lg resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── RIGHT COLUMN (col-span-5): Media Upload & Live Storefront Preview ─── */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Media Upload Card */}
                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        Product Media
                      </h4>

                      <div className="flex rounded-md border border-neutral-200 p-0.5 bg-neutral-100 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setImageTab("upload")}
                          className={`px-2.5 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                            imageTab === "upload" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-600 hover:text-neutral-900"
                          }`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageTab("url")}
                          className={`px-2.5 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                            imageTab === "url" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-600 hover:text-neutral-900"
                          }`}
                        >
                          Paste URL
                        </button>
                      </div>
                    </div>

                    {imageTab === "upload" ? (
                      <div>
                        <label className="block cursor-pointer">
                          <div
                            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                              isUploadingImage
                                ? "border-neutral-400 bg-neutral-50"
                                : "border-neutral-200 hover:border-neutral-400 hover:bg-white bg-white/70"
                            }`}
                          >
                            {isUploadingImage ? (
                              <div className="flex flex-col items-center justify-center gap-2 py-3">
                                <Loader2 className="w-6 h-6 animate-spin text-neutral-800" />
                                <p className="text-xs font-semibold text-neutral-800">
                                  Uploading to Cloudinary CDN...
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  Auto AVIF/WebP optimization
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-1 py-2">
                                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 mb-0.5">
                                  <Upload className="w-4 h-4" />
                                </div>
                                <p className="text-xs font-semibold text-neutral-800">
                                  Click to upload image or drag and drop
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  PNG, JPG, WebP up to 8MB • Cloudinary CDN
                                </p>
                              </div>
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

                        {uploadError && (
                          <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                            <X className="w-3.5 h-3.5 shrink-0" />
                            <span>{uploadError}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="relative">
                          <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                          <Input
                            placeholder="Paste image URL (https://res.cloudinary.com/...)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="text-xs h-9.5 pl-8.5 font-mono text-[11px] rounded-lg bg-white"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Accepts Cloudinary or HTTPS image links.
                        </p>
                      </div>
                    )}

                    {/* Image Confirmation Pill */}
                    {imageUrl && (
                      <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-neutral-200">
                        <img
                          src={imageUrl}
                          alt="Thumbnail"
                          className="w-10 h-10 object-cover rounded bg-neutral-100 border shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.2">
                            {imageUrl.includes("cloudinary") ? "Cloudinary CDN Active" : "External Asset"}
                          </span>
                          <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">
                            {imageUrl}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setImageUrl("")}
                          className="text-[11px] text-neutral-500 hover:text-red-600 hover:bg-red-50 h-7 px-2"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Live Storefront Preview Card */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-neutral-500" />
                        Live Storefront Preview
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        daintydazzle.store
                      </span>
                    </div>

                    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-xs transition-all">
                      {/* Product Image Preview */}
                      <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={title || "Preview"}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-neutral-400 p-4 text-center">
                            <ShoppingBag className="w-8 h-8 stroke-1 mb-1.5 text-neutral-300" />
                            <p className="text-[11px] font-medium text-neutral-500">Image will appear here</p>
                            <p className="text-[10px] text-neutral-400">Upload an image to see live storefront preview</p>
                          </div>
                        )}
                        {/* Floating Category Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-neutral-900 px-2 py-0.5 rounded shadow-2xs">
                            {selectedCategory}
                          </span>
                        </div>
                      </div>

                      {/* Product Card Details */}
                      <div className="p-3.5 space-y-2">
                        <div>
                          <p className="text-xs font-medium text-neutral-900 line-clamp-1">
                            {title || "Celestial Freshwater Pearl Choker"}
                          </p>
                          <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                            /products/{handle || "celestial-freshwater-pearl-choker"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-neutral-900">
                              ₹{minPrice || "999"}
                            </span>
                            {compareAtPrice && parseFloat(compareAtPrice) > (parseFloat(minPrice) || 0) && (
                              <span className="text-[11px] text-neutral-400 line-through">
                                ₹{compareAtPrice}
                              </span>
                            )}
                            {discountPercent && (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                                -{discountPercent}%
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {parseInt(stock, 10) > 0 ? `${stock || 25} in stock` : "Out of stock"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Pinned Dialog Footer */}
            <div className="px-7 py-3.5 border-t bg-neutral-50/80 shrink-0 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                Products sync immediately across collections and search.
              </span>
              <div className="flex items-center gap-2.5 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                  className="text-xs h-9 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="text-xs h-9 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg px-4 gap-1.5 shadow-2xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Publish Product</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
