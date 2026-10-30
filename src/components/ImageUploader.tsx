"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2, X } from "lucide-react";
import { api } from "../lib/api";

interface ImageUploaderProps {
  onImageUploaded: (image: { url: string; key: string }) => void;
}

export function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Request presigned upload URL from server
      const { uploadUrl, publicUrl, key } = await api.getUploadUrl(file.name, file.type);

      // 2. Upload file directly to Cloudflare R2 bucket
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image directly to Cloudflare R2");
      }

      setPreview(publicUrl);
      onImageUploaded({ url: publicUrl, key });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#111815]">Product Media (Cloudflare R2)</label>

      {preview ? (
        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-[#E2E8E4] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Uploaded to R2
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#D5DDD6] hover:border-[#194F36] rounded-xl cursor-pointer bg-[#F8FAF9] hover:bg-[#F2F5EF] transition-colors p-4">
          <div className="flex flex-col items-center justify-center">
            {isUploading ? (
              <>
                <Loader2 className="w-7 h-7 text-[#194F36] animate-spin mb-2" />
                <p className="text-xs font-medium text-[#111815]">Uploading to Cloudflare R2...</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-[#737F76] mb-2" />
                <p className="text-sm font-medium text-[#111815]">Click to upload or drag & drop</p>
                <p className="text-xs text-[#737F76] mt-1">PNG, JPG, WebP up to 10MB ($0 egress on R2)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            disabled={isUploading}
            onChange={handleFileChange}
          />
        </label>
      )}

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

