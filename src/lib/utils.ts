export { cn } from "cn";

/**
 * Rewrites Cloudinary upload URLs to serve modern AVIF/WebP (`f_auto`),
 * adaptive compression (`q_auto`), and bounded pixel dimensions (`w_<width>,c_limit`).
 */
export function optimizeCloudinaryUrl(url: string, width = 400): string {
  if (!url) return "";
  if (url.includes("res.cloudinary.com")) {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex !== -1) {
      const prefix = url.slice(0, uploadIndex + 8);
      let rest = url.slice(uploadIndex + 8);
      rest = rest.replace(/^(f_auto,q_auto[^/]*\/)+/i, "");
      rest = rest.replace(/^([a-z]_[^/]+\/)+/i, (match) => {
        if (match.includes("w_") || match.includes("q_") || match.includes("f_")) {
          return "";
        }
        return match;
      });
      return `${prefix}f_auto,q_auto,w_${width},c_limit/${rest}`;
    }
  }
  return url;
}
