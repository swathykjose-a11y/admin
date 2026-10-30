"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ImageUploader } from "../../../components/ImageUploader";
import { api } from "../../../lib/api";

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
    // Auto-generate slug
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-2 text-[#737F76] hover:text-[#111815] bg-white border border-[#E2E8E4] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111815]">Add New Product</h1>
            <p className="text-xs text-[#737F76]">Create item in Neon Postgres and host assets on Cloudflare R2</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#194F36] hover:bg-[#133D2A] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Product
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Core Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E2E8E4] space-y-4">
            <h3 className="text-base font-semibold text-[#111815]">General Information</h3>

            <div>
              <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Ceramic Teapot"
                className="w-full px-3.5 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ceramic-teapot"
                className="w-full px-3.5 py-2 text-sm font-mono bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product materials, dimensions, and story..."
                className="w-full px-3.5 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
              />
            </div>
          </div>

          {/* Cloudflare R2 Upload Component */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E8E4]">
            <ImageUploader
              onImageUploaded={(img) => setUploadedImages((prev) => [...prev, img])}
            />
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E8E4] space-y-4">
            <h3 className="text-base font-semibold text-[#111815]">Pricing & Value</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                  Selling Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="48.00"
                  className="w-full px-3.5 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                  Compare at Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="60.00"
                  className="w-full px-3.5 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Placement */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E2E8E4] space-y-4">
            <h3 className="text-base font-semibold text-[#111815]">Status</h3>

            <div>
              <label className="block text-xs font-semibold text-[#737F76] uppercase tracking-wider mb-1">
                Visibility
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="w-full px-3.5 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
              >
                <option value="published">Published (Visible in store)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-[#E2E8E4]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#194F36] rounded border-[#E2E8E4] focus:ring-[#194F36]"
                />
                <span className="text-sm font-medium text-[#111815]">Feature on Homepage</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

