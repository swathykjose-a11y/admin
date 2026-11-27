"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Upload,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  X,
  Layers,
  Sparkle,
} from "lucide-react";
import { adminApi } from "@/lib/api";

export type CmsSectionKey = "hero" | "featured" | "editorial" | "story" | "bottom-banner";

interface CmsViewProps {
  onSaveCms: (
    section: CmsSectionKey,
    data: any,
  ) => Promise<boolean>;
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

  // Generic Cloudinary image upload handler for any section
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
    } catch (err: any) {
      console.error(`Failed to upload ${sectionKey} image to Cloudinary:`, err);
      setUploadErrors((prev) => ({
        ...prev,
        [sectionKey]: err?.message || "Cloudinary upload failed",
      }));
    } finally {
      setUploadingSection(null);
    }
  };

  const notifySave = (sec: string) => {
    setSavedSection(sec);
    setTimeout(() => setSavedSection(null), 3000);
  };

  // 1. Save Hero
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

  // 2. Save Featured
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

  // 3. Save Editorial
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

  // 4. Save Story
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

  // 5. Save Bottom Banner
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

  // Reusable Image Uploader Component
  const renderImageUploader = (
    sectionId: string,
    currentUrl: string,
    setUrl: (url: string) => void,
    label: string = "Section Photography",
  ) => {
    const isUploading = uploadingSection === sectionId;
    const error = uploadErrors[sectionId];

    return (
      <div className="space-y-2.5 p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-neutral-500" />
            {label}
          </label>
          <span className="text-[10px] text-neutral-400 font-mono">Cloudinary CDN</span>
        </div>

        {/* Upload dropzone / button */}
        <label className="block cursor-pointer">
          <div
            className={`border border-dashed rounded-lg p-3 text-center transition-all ${
              isUploading
                ? "border-neutral-400 bg-neutral-100"
                : "border-neutral-300 hover:border-neutral-500 bg-white hover:bg-neutral-50/80"
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2 py-1">
                <Loader2 className="w-4 h-4 animate-spin text-neutral-800" />
                <span className="text-xs font-medium text-neutral-700">
                  Uploading to Cloudinary...
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-1">
                <Upload className="w-4 h-4 text-neutral-600" />
                <span className="text-xs font-medium text-neutral-800">
                  Upload new image to Cloudinary
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                  (PNG, JPG, WebP)
                </span>
              </div>
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

        {error && (
          <div className="p-2 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
            <X className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* URL Input & Live Thumbnail */}
        <div className="space-y-1.5 pt-1">
          <div className="relative">
            <LinkIcon className="w-3 h-3 absolute left-2.5 top-2.5 text-neutral-400" />
            <Input
              value={currentUrl}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="text-[11px] h-8 pl-7.5 font-mono bg-white"
            />
          </div>

          {currentUrl && (
            <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-neutral-200 mt-2">
              <img
                src={currentUrl}
                alt="Preview"
                className="w-12 h-12 object-cover rounded bg-neutral-100 border shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.2">
                  {currentUrl.includes("cloudinary") ? "Cloudinary CDN Active" : "Custom Asset"}
                </span>
                <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">
                  {currentUrl}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setUrl("")}
                className="text-[10px] text-neutral-400 hover:text-red-600 h-6 px-2"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Badge variant="outline" className="text-[10px] uppercase font-semibold text-neutral-600">
              Storefront CMS
            </Badge>
            <span className="text-neutral-300">•</span>
            <span className="text-xs text-neutral-500 font-medium">Cloudinary Integrated</span>
          </div>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
            Homepage Content & Media Management
          </h2>
          <p className="text-xs text-muted-foreground">
            Update copy, call-to-actions, and upload high-resolution photography directly to Cloudinary for instant CDN distribution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ─── 1. Hero Section ─── */}
        <Card className="shadow-xs border-neutral-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-neutral-900">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-mono">
                  1
                </span>
                Hero Section Banner
              </CardTitle>
              {savedSection === "hero" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved & Live
                </span>
              )}
            </div>
            <CardDescription className="text-xs">
              The full-viewport editorial hero banner at the top of the homepage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Headline (Brand Title)
              </label>
              <Input
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="text-xs h-9 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Subtitle Statement
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
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  CTA Text
                </label>
                <Input
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  CTA Link
                </label>
                <Input
                  value={heroCtaLink}
                  onChange={(e) => setHeroCtaLink(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            {/* Cloudinary Image Uploader */}
            {renderImageUploader("hero", heroImage, setHeroImage, "Hero Background Photography")}

            <Button
              size="sm"
              disabled={isSaving === "hero"}
              onClick={handleSaveHero}
              className="w-full text-xs h-9 bg-neutral-900 text-white hover:bg-neutral-800 gap-1.5"
            >
              {isSaving === "hero" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Save Hero Banner
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ─── 2. Featured Collections Intro ─── */}
        <Card className="shadow-xs border-neutral-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-neutral-900">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-mono">
                  2
                </span>
                Featured Collections Intro Text
              </CardTitle>
              {savedSection === "featured" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved & Live
                </span>
              )}
            </div>
            <CardDescription className="text-xs">
              Editorial typography displayed beside top collections on the homepage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Eyebrow Label
              </label>
              <Input
                value={featuredEyebrow}
                onChange={(e) => setFeaturedEyebrow(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Serif Headline (Use Enter/newline for styling line breaks)
              </label>
              <Textarea
                value={featuredHeadline}
                onChange={(e) => setFeaturedHeadline(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Description Paragraph
              </label>
              <Textarea
                value={featuredDesc}
                onChange={(e) => setFeaturedDesc(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>

            <Button
              size="sm"
              disabled={isSaving === "featured"}
              onClick={handleSaveFeatured}
              className="w-full text-xs h-9 bg-neutral-900 text-white hover:bg-neutral-800 gap-1.5"
            >
              {isSaving === "featured" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Save Featured Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ─── 3. Mid-Page Editorial Banner ─── */}
        <Card className="shadow-xs border-neutral-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-neutral-900">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-mono">
                  3
                </span>
                Mid-Page Editorial Banner
              </CardTitle>
              {savedSection === "editorial" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved & Live
                </span>
              )}
            </div>
            <CardDescription className="text-xs">
              Wide cinematic editorial photo with left-aligned statement (&quot;Elegance in every detail&quot;).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Headline
              </label>
              <Input
                value={editorialHeadline}
                onChange={(e) => setEditorialHeadline(e.target.value)}
                className="text-xs h-9 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Subtitle
              </label>
              <Input
                value={editorialSubtitle}
                onChange={(e) => setEditorialSubtitle(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            {/* Cloudinary Image Uploader */}
            {renderImageUploader("editorial", editorialImage, setEditorialImage, "Editorial Photography")}

            <Button
              size="sm"
              disabled={isSaving === "editorial"}
              onClick={handleSaveEditorial}
              className="w-full text-xs h-9 bg-neutral-900 text-white hover:bg-neutral-800 gap-1.5"
            >
              {isSaving === "editorial" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Save Editorial Banner
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ─── 4. Brand Story Section ─── */}
        <Card className="shadow-xs border-neutral-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-neutral-900">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-mono">
                  4
                </span>
                Brand Craftsmanship Story
              </CardTitle>
              {savedSection === "story" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved & Live
                </span>
              )}
            </div>
            <CardDescription className="text-xs">
              The split narrative section detailing studio intention, craftsmanship, and materials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Story Eyebrow
                </label>
                <Input
                  value={storyEyebrow}
                  onChange={(e) => setStoryEyebrow(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
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
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Paragraph 1 (Studio Process)
              </label>
              <Textarea
                value={storyP1}
                onChange={(e) => setStoryP1(e.target.value)}
                rows={2}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Paragraph 2 (Philosophy)
              </label>
              <Textarea
                value={storyP2}
                onChange={(e) => setStoryP2(e.target.value)}
                rows={2}
                className="text-xs"
              />
            </div>

            {/* Cloudinary Image Uploader */}
            {renderImageUploader("story", storyImage, setStoryImage, "Craft Story Photography")}

            <Button
              size="sm"
              disabled={isSaving === "story"}
              onClick={handleSaveStory}
              className="w-full text-xs h-9 bg-neutral-900 text-white hover:bg-neutral-800 gap-1.5"
            >
              {isSaving === "story" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Save Story Section
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ─── 5. Bottom Editorial Banner ─── */}
        <Card className="shadow-xs border-neutral-200 lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-neutral-900">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-mono">
                  5
                </span>
                Bottom Editorial Banner
              </CardTitle>
              {savedSection === "bottom-banner" && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved & Live
                </span>
              )}
            </div>
            <CardDescription className="text-xs">
              Wide cinematic closing banner (&quot;Emotion embraces technique&quot;) right above the footer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Headline
                </label>
                <Input
                  value={bottomHeadline}
                  onChange={(e) => setBottomHeadline(e.target.value)}
                  className="text-xs h-9 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Subtitle
                </label>
                <Input
                  value={bottomSubtitle}
                  onChange={(e) => setBottomSubtitle(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            {/* Cloudinary Image Uploader */}
            {renderImageUploader("bottom-banner", bottomImage, setBottomImage, "Bottom Banner Photography")}

            <Button
              size="sm"
              disabled={isSaving === "bottom-banner"}
              onClick={handleSaveBottom}
              className="w-full text-xs h-9 bg-neutral-900 text-white hover:bg-neutral-800 gap-1.5"
            >
              {isSaving === "bottom-banner" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Save Bottom Banner
                </>
              )}
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
