"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Sparkles } from "lucide-react";

interface CmsViewProps {
  onSaveCms: (
    section: "hero" | "featured" | "editorial" | "story",
    data: any,
  ) => Promise<boolean>;
}

export function CmsView({ onSaveCms }: CmsViewProps) {
  const [savedSection, setSavedSection] = useState<string | null>(null);

  // Hero state
  const [heroHeadline, setHeroHeadline] = useState("Dainty Dazzle");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "True beauty shines from within, and our jewelry merely reflects it.",
  );
  const [heroCtaText, setHeroCtaText] = useState("SHOP NOW ↗");
  const [heroCtaLink, setHeroCtaLink] = useState("/products");
  const [heroImage, setHeroImage] = useState(
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&q=85&auto=format&fit=crop",
  );

  // Featured state
  const [featuredEyebrow, setFeaturedEyebrow] = useState("Our Collection");
  const [featuredHeadline, setFeaturedHeadline] = useState(
    "Creating,\nCrafting\n& Wearing.",
  );
  const [featuredDesc, setFeaturedDesc] = useState(
    "Each piece is designed with care and crafted to celebrate everyday elegance.",
  );

  // Story state
  const [storyEyebrow, setStoryEyebrow] = useState("Our Story");
  const [storyHeadline, setStoryHeadline] = useState(
    "We believe\nin our process.",
  );
  const [storyP1, setStoryP1] = useState(
    "Every piece of Dainty Dazzle jewelry is crafted with intention. From selecting materials to the final polish, we pour care into every step.",
  );
  const [storyP2, setStoryP2] = useState(
    "We started with a simple belief: that beautiful jewelry shouldn't cost a fortune.",
  );

  const handleSaveHero = async () => {
    const ok = await onSaveCms("hero", {
      headline: heroHeadline,
      subtitle: heroSubtitle,
      ctaText: heroCtaText,
      ctaLink: heroCtaLink,
      imageUrl: heroImage,
    });
    if (ok) {
      setSavedSection("hero");
      setTimeout(() => setSavedSection(null), 2500);
    }
  };

  const handleSaveFeatured = async () => {
    const ok = await onSaveCms("featured", {
      eyebrow: featuredEyebrow,
      headline: featuredHeadline,
      description: featuredDesc,
      ctaText: "EXPLORE ALL ↗",
      ctaLink: "/products",
    });
    if (ok) {
      setSavedSection("featured");
      setTimeout(() => setSavedSection(null), 2500);
    }
  };

  const handleSaveStory = async () => {
    const ok = await onSaveCms("story", {
      eyebrow: storyEyebrow,
      headline: storyHeadline,
      paragraph1: storyP1,
      paragraph2: storyP2,
      ctaText: "EXPLORE CATEGORIES ↗",
      ctaLink: "/products",
    });
    if (ok) {
      setSavedSection("story");
      setTimeout(() => setSavedSection(null), 2500);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Hero Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              1. Hero Section Banner
            </CardTitle>
            {savedSection === "hero" && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
          <CardDescription className="text-xs">
            The prominent above-the-fold full viewport hero on the customer homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              Headline
            </label>
            <Input
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              Subtitle
            </label>
            <Textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={2}
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                CTA Text
              </label>
              <Input
                value={heroCtaText}
                onChange={(e) => setHeroCtaText(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                CTA Link
              </label>
              <Input
                value={heroCtaLink}
                onChange={(e) => setHeroCtaLink(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              Background Photography URL
            </label>
            <Input
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <Button
            size="sm"
            onClick={handleSaveHero}
            className="w-full text-xs h-8"
          >
            Save Hero Banner
          </Button>
        </CardContent>
      </Card>

      {/* 2. Featured Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              2. Featured Section Text
            </CardTitle>
            {savedSection === "featured" && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
          <CardDescription className="text-xs">
            Editorial text beside the top 2 featured products on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              Eyebrow Label
            </label>
            <Input
              value={featuredEyebrow}
              onChange={(e) => setFeaturedEyebrow(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              Serif Headline (Use newlines for breaks)
            </label>
            <Textarea
              value={featuredHeadline}
              onChange={(e) => setFeaturedHeadline(e.target.value)}
              rows={3}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              Description
            </label>
            <Textarea
              value={featuredDesc}
              onChange={(e) => setFeaturedDesc(e.target.value)}
              rows={2}
              className="text-xs"
            />
          </div>

          <Button
            size="sm"
            onClick={handleSaveFeatured}
            className="w-full text-xs h-8"
          >
            Save Featured Content
          </Button>
        </CardContent>
      </Card>

      {/* 3. Story Section */}
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              3. Brand Craftsmanship Story
            </CardTitle>
            {savedSection === "story" && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
          <CardDescription className="text-xs">
            The split craftsmanship story layout showcasing jewelry intention and materials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                Story Eyebrow
              </label>
              <Input
                value={storyEyebrow}
                onChange={(e) => setStoryEyebrow(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
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
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              Paragraph 1
            </label>
            <Textarea
              value={storyP1}
              onChange={(e) => setStoryP1(e.target.value)}
              rows={2}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              Paragraph 2
            </label>
            <Textarea
              value={storyP2}
              onChange={(e) => setStoryP2(e.target.value)}
              rows={2}
              className="text-xs"
            />
          </div>

          <Button
            size="sm"
            onClick={handleSaveStory}
            className="w-full text-xs h-8"
          >
            Save Story Section
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
