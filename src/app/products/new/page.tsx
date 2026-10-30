"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ImageUploader } from "../../../components/ImageUploader";
import { api } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [featured, setFeatured] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; key: string }>>([]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      setError("Title and price are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.createProduct({
        title,
        slug,
        description,
        price,
        compareAtPrice: compareAtPrice || undefined,
        status,
        featured,
        images: uploadedImages,
      });

      router.push("/products");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create product";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild className="h-9 w-9">
            <Link href="/products">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A211D]">Add Product</h1>
            <p className="text-xs text-[#737F76]">Upload media to Cloudflare R2 and save in Neon Postgres</p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-[#194F36] hover:bg-[#133D2A] text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1.5" />
              Save Product
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Title, slug, and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1.5">
                  Title *
                </label>
                <Input
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Minimalist Ceramic Matcha Bowl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1.5">
                  Slug *
                </label>
                <Input
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Materials, origin, care instructions..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D5DDD6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media (Cloudflare R2)</CardTitle>
              <CardDescription>Direct S3 presigned upload with zero egress fees</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                onImageUploaded={(img) => setUploadedImages((prev) => [...prev, img])}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1.5">
                  Price ($) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="48.00"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1.5">
                  Compare at Price ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="60.00"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1.5">
                  Visibility
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                  className="w-full h-9 px-3 text-xs bg-white border border-[#D5DDD6] rounded-lg focus:ring-1 focus:ring-[#194F36]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#D5DDD6]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#194F36] rounded border-[#D5DDD6] focus:ring-[#194F36]"
                  />
                  <span className="text-xs font-bold text-[#1A211D]">Featured on Storefront</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
