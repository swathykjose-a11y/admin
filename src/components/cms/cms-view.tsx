"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Upload, Loader2, X } from "lucide-react";
import { adminApi } from "@/lib/api";

export type CmsSectionKey = "hero" | "featured" | "editorial" | "story" | "bottom-banner";

interface CmsViewProps {
  onSaveCms: (section: CmsSectionKey, data: any) => Promise<boolean>;
}

const CLOUDINARY_DEFAULTS = {
  hero: "https://res.cloudinary.com/io2tbyjp/image/upload/v1795766214/dainty-dazzle/dainty-dazzle/01-hero-banner.jpg",
  editorial: "https://res.cloudinary.com/io2tbyjp/image/upload/v1795766216/dainty-dazzle/dainty-dazzle/02-editorial-banner-elegance.jpg",
  story: "https://res.cloudinary.com/io2tbyjp/image/upload/v1795766219/dainty-dazzle/dainty-dazzle/03-story-section-craftsmanship.jpg",
  bottomBanner: "https://res.cloudinary.com/io2tbyjp/image/upload/v1795766221/dainty-dazzle/dainty-dazzle/04-editorial-banner-technique.jpg",
};

export function CmsView({ onSaveCms }: CmsViewProps) {
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  // 1. Hero state
  const [heroHeadline, setHeroHeadline] = useState("Dainty Dazzle");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "True beauty shines from within, and our jewelry merely reflects it.",
  );
  const [heroCtaText, setHeroCtaText] = useState("SHOP NOW ↗");
  const [heroCtaLink, setHeroCtaLink] = useState("/products");
  const [heroImage, setHeroImage] = useState(CLOUDINARY_DEFAULTS.hero);

  // 2. Featured state
  const [featuredEyebrow, setFeaturedEyebrow] = useState("Our Collection");
  const [featuredHeadline, setFeaturedHeadline] = useState(
    "Creating,\nCrafting\n& Wearing.",
  );
  const [featuredDesc, setFeaturedDesc] = useState(
    "Each piece is designed with care and crafted to celebrate everyday elegance.",
  );

  // 3. Editorial Banner state (Mid-page)
  const [editorialHeadline, setEditorialHeadline] = useState("Elegance in every detail.");
  const [editorialSubtitle, setEditorialSubtitle] = useState(
    "Handcrafted with love, designed to be worn every single day.",
  );
  const [editorialImage, setEditorialImage] = useState(CLOUDINARY_DEFAULTS.editorial);

  // 4. Story state
  const [storyEyebrow, setStoryEyebrow] = useState("Our Story");
  const [storyHeadline, setStoryHeadline] = useState("We believe\nin our process.");
  const [storyP1, setStoryP1] = useState(
    "Every piece of Dainty Dazzle jewelry is crafted with intention. From selecting materials to the final polish, we pour care into every step.",
  );
  const [storyP2, setStoryP2] = useState(
    "We started with a simple belief: that beautiful jewelry shouldn't cost a fortune.",
  );
  const [storyImage, setStoryImage] = useState(CLOUDINARY_DEFAULTS.story);

  // 5. Bottom Banner state
  const [bottomHeadline, setBottomHeadline] = useState("Emotion embraces technique.");
  const [bottomSubtitle, setBottomSubtitle] = useState(
    "Where craftsmanship meets quiet confidence.",
  );
  const [bottomImage, setBottomImage] = useState(CLOUDINARY_DEFAULTS.bottomBanner);

  // Load live CMS on mount
  useEffect(() => {
    let mounted = true;
    const fetchSections = async () => {
      try {
        const [heroRes, featRes, editRes, storyRes, bottomRes] = await Promise.allSettled([
          adminApi.getCMS("hero"),
          adminApi.getCMS("featured"),
          adminApi.getCMS("editorial"),
          adminApi.getCMS("story"),
          adminApi.getCMS("bottom-banner"),
        ]);

        if (!mounted) return;

        if (heroRes.status === "fulfilled" && heroRes.value.data) {
          const d = heroRes.value.data;
          if (d.headline) setHeroHeadline(d.headline);
          if (d.subtitle) setHeroSubtitle(d.subtitle);
          if (d.ctaText) setHeroCtaText(d.ctaText);
          if (d.ctaLink) setHeroCtaLink(d.ctaLink);
          if (d.imageUrl) setHeroImage(d.imageUrl);
        }

        if (featRes.status === "fulfilled" && featRes.value.data) {
          const d = featRes.value.data;
          if (d.eyebrow) setFeaturedEyebrow(d.eyebrow);
          if (d.headline) setFeaturedHeadline(d.headline);
          if (d.description) setFeaturedDesc(d.description);
        }

        if (editRes.status === "fulfilled" && editRes.value.data) {
          const d = editRes.value.data;
          if (d.headline) setEditorialHeadline(d.headline);
          if (d.subtitle) setEditorialSubtitle(d.subtitle);
          if (d.imageUrl) setEditorialImage(d.imageUrl);
        }

        if (storyRes.status === "fulfilled" && storyRes.value.data) {
          const d = storyRes.value.data;
          if (d.eyebrow) setStoryEyebrow(d.eyebrow);
          if (d.headline) setStoryHeadline(d.headline);
          if (d.paragraph1) setStoryP1(d.paragraph1);
          if (d.paragraph2) setStoryP2(d.paragraph2);
          if (d.imageUrl) setStoryImage(d.imageUrl);
        }

        if (bottomRes.status === "fulfilled" && bottomRes.value.data) {
          const d = bottomRes.value.data;
          if (d.headline) setBottomHeadline(d.headline);
          if (d.subtitle) setBottomSubtitle(d.subtitle);
          if (d.imageUrl) setBottomImage(d.imageUrl);
        }
      } catch (e) {
        console.warn("Failed to load CMS data:", e);
      }
    };

    fetchSections();
    return () => {
      mounted = false;
    };
  }, []);

  const handleImageUpload = async (
    sectionKey: string,
    file: File,
    setImageUrl: (url: string) => void,
  ) => {
    if (!file) return;
    setUploadingSection(sectionKey);
    setUploadErrors((prev) => ({ ...prev, [sectionKey]: "" }));

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read image file"));
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;
      const uploaded = await adminApi.uploadImage(base64Data, "dainty-dazzle");
      setImageUrl(uploaded.url);
      toast.success("Image uploaded");
    } catch (err: any) {
      const msg = err?.message || "Image upload failed";
      setUploadErrors((prev) => ({
        ...prev,
        [sectionKey]: msg,
      }));
      toast.error(msg);
    } finally {
      setUploadingSection(null);
    }
  };

  const notifySave = (sec: string) => {
    setSavedSection(sec);
    setTimeout(() => setSavedSection(null), 3000);
  };

  const handleSaveHero = async () => {
    setIsSaving("hero");
    try {
      const ok = await onSaveCms("hero", {
        headline: heroHeadline,
        subtitle: heroSubtitle,
        ctaText: heroCtaText,
        ctaLink: heroCtaLink,
        imageUrl: heroImage,
      });
      if (ok) notifySave("hero");
    } finally {
      setIsSaving(null);
    }
  };

  const handleSaveFeatured = async () => {
    setIsSaving("featured");
    try {
      const ok = await onSaveCms("featured", {
        eyebrow: featuredEyebrow,
        headline: featuredHeadline,
        description: featuredDesc,
        ctaText: "EXPLORE ALL ↗",
        ctaLink: "/products",
      });
      if (ok) notifySave("featured");
    } finally {
      setIsSaving(null);
    }
  };

  const handleSaveEditorial = async () => {
    setIsSaving("editorial");
    try {
      const ok = await onSaveCms("editorial", {
        headline: editorialHeadline,
        subtitle: editorialSubtitle,
        imageUrl: editorialImage,
      });
      if (ok) notifySave("editorial");
    } finally {
      setIsSaving(null);
    }
  };

  const handleSaveStory = async () => {
    setIsSaving("story");
    try {
      const ok = await onSaveCms("story", {
        eyebrow: storyEyebrow,
        headline: storyHeadline,
        paragraph1: storyP1,
        paragraph2: storyP2,
        imageUrl: storyImage,
        ctaText: "EXPLORE CATEGORIES ↗",
        ctaLink: "/products",
      });
      if (ok) notifySave("story");
    } finally {
      setIsSaving(null);
    }
  };

  const handleSaveBottom = async () => {
    setIsSaving("bottom-banner");
    try {
      const ok = await onSaveCms("bottom-banner", {
        headline: bottomHeadline,
        subtitle: bottomSubtitle,
        imageUrl: bottomImage,
      });
      if (ok) notifySave("bottom-banner");
    } finally {
      setIsSaving(null);
    }
  };

  const renderImagePanel = (
    sectionId: string,
    currentUrl: string,
    setUrl: (url: string) => void,
    altLabel: string,
  ) => {
    const isUploading = uploadingSection === sectionId;
    const error = uploadErrors[sectionId];

    return (
      <div className="space-y-3">
        {currentUrl ? (
          <div className="relative group rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 aspect-4/3">
            <img
              src={currentUrl}
              alt={altLabel}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <label className="cursor-pointer bg-white/95 hover:bg-white text-neutral-900 text-xs font-medium px-3.5 py-2 rounded-lg shadow-sm">
                {isUploading ? "Uploading..." : "Replace image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(sectionId, file, setUrl);
                  }}
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setUrl("")}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-red-600 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                <span className="text-xs font-medium text-neutral-800">Uploading...</span>
              </div>
            )}
          </div>
        ) : (
          <label className="block cursor-pointer">
            <div
              className={`border border-dashed rounded-lg aspect-4/3 flex flex-col items-center justify-center gap-2 transition-colors ${
                isUploading
                  ? "border-neutral-400 bg-neutral-100"
                  : "border-neutral-300 hover:border-neutral-500 bg-neutral-50/70 hover:bg-neutral-50"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-800" />
                  <span className="text-xs font-medium text-neutral-700">
                    Uploading...
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs font-medium text-neutral-800">
                    Upload image
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    PNG, JPG, WebP
                  </span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(sectionId, file, setUrl);
              }}
            />
          </label>
        )}

        {error && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
            <X className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Section */}
      <section className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  Hero Section Banner
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Full-viewport editorial banner at the top of the homepage.
                </p>
              </div>
              {savedSection === "hero" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Headline
                </label>
                <Input
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Subtitle
                </label>
                <Textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                    Button Label
                  </label>
                  <Input
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                    Button Destination
                  </label>
                  <Input
                    value={heroCtaLink}
                    onChange={(e) => setHeroCtaLink(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <Button
                size="sm"
                disabled={isSaving === "hero"}
                onClick={handleSaveHero}
                className="text-xs h-9 px-5 bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
              >
                {isSaving === "hero" ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Hero Banner"
                )}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            {renderImagePanel("hero", heroImage, setHeroImage, "Hero Banner")}
          </div>
        </div>
      </section>

      {/* 2. Featured Collections Intro */}
      <section className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  Featured Collections Intro
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Editorial typography displayed beside featured products.
                </p>
              </div>
              {savedSection === "featured" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Section Label
                </label>
                <Input
                  value={featuredEyebrow}
                  onChange={(e) => setFeaturedEyebrow(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Headline
                </label>
                <Textarea
                  value={featuredHeadline}
                  onChange={(e) => setFeaturedHeadline(e.target.value)}
                  rows={3}
                  className="text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Description
                </label>
                <Textarea
                  value={featuredDesc}
                  onChange={(e) => setFeaturedDesc(e.target.value)}
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>
            </div>

            <div className="pt-1">
              <Button
                size="sm"
                disabled={isSaving === "featured"}
                onClick={handleSaveFeatured}
                className="text-xs h-9 px-5 bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
              >
                {isSaving === "featured" ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Featured Content"
                )}
              </Button>
            </div>
          </div>

          {/* Live Typography Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-neutral-200/80 bg-[#f6f5f0] p-6 aspect-4/3 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-3">
                  {featuredEyebrow || "Our Collection"}
                </p>
                <p className="font-serif text-2xl text-neutral-900 leading-tight whitespace-pre-line">
                  {featuredHeadline || "Creating,\nCrafting\n& Wearing."}
                </p>
                <p className="text-xs text-neutral-600 mt-3 leading-relaxed line-clamp-3">
                  {featuredDesc}
                </p>
              </div>
              <span className="inline-block w-fit text-[10px] uppercase tracking-wider border border-neutral-400 px-3 py-1.5 text-neutral-800">
                Explore All ↗
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mid-Page Editorial Banner */}
      <section className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  Mid-Page Editorial Banner
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Wide editorial photo with left-aligned statement.
                </p>
              </div>
              {savedSection === "editorial" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Headline
                </label>
                <Input
                  value={editorialHeadline}
                  onChange={(e) => setEditorialHeadline(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Subtitle
                </label>
                <Textarea
                  value={editorialSubtitle}
                  onChange={(e) => setEditorialSubtitle(e.target.value)}
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>
            </div>

            <div className="pt-1">
              <Button
                size="sm"
                disabled={isSaving === "editorial"}
                onClick={handleSaveEditorial}
                className="text-xs h-9 px-5 bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
              >
                {isSaving === "editorial" ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Editorial Banner"
                )}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            {renderImagePanel("editorial", editorialImage, setEditorialImage, "Mid-Page Editorial Banner")}
          </div>
        </div>
      </section>

      {/* 4. Brand Craftsmanship Story */}
      <section className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  Brand Craftsmanship Story
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Split narrative section detailing studio intention and craftsmanship.
                </p>
              </div>
              {savedSection === "story" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                    Story Label
                  </label>
                  <Input
                    value={storyEyebrow}
                    onChange={(e) => setStoryEyebrow(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                    Story Headline
                  </label>
                  <Input
                    value={storyHeadline}
                    onChange={(e) => setStoryHeadline(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Studio Process
                </label>
                <Textarea
                  value={storyP1}
                  onChange={(e) => setStoryP1(e.target.value)}
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Philosophy
                </label>
                <Textarea
                  value={storyP2}
                  onChange={(e) => setStoryP2(e.target.value)}
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>
            </div>

            <div className="pt-1">
              <Button
                size="sm"
                disabled={isSaving === "story"}
                onClick={handleSaveStory}
                className="text-xs h-9 px-5 bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
              >
                {isSaving === "story" ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Story Section"
                )}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            {renderImagePanel("story", storyImage, setStoryImage, "Brand Craftsmanship Story")}
          </div>
        </div>
      </section>

      {/* 5. Bottom Editorial Banner */}
      <section className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  Bottom Editorial Banner
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Closing editorial banner displayed right above the footer.
                </p>
              </div>
              {savedSection === "bottom-banner" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Headline
                </label>
                <Input
                  value={bottomHeadline}
                  onChange={(e) => setBottomHeadline(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Subtitle
                </label>
                <Textarea
                  value={bottomSubtitle}
                  onChange={(e) => setBottomSubtitle(e.target.value)}
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>
            </div>

            <div className="pt-1">
              <Button
                size="sm"
                disabled={isSaving === "bottom-banner"}
                onClick={handleSaveBottom}
                className="text-xs h-9 px-5 bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
              >
                {isSaving === "bottom-banner" ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Bottom Banner"
                )}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            {renderImagePanel("bottom-banner", bottomImage, setBottomImage, "Bottom Editorial Banner")}
          </div>
        </div>
      </section>
    </div>
  );
}
