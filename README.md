# Dainty Admin Dashboard

High-performance, edge-first e-commerce admin dashboard built with **Bun**, **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

## 🚀 Capabilities

- **Overview Telemetry**: Real-time sales, order streams, active products, and customer counts.
- **Product Management**: Direct media upload to **Cloudflare R2** with $0 egress fees via presigned URLs.
- **Order & Fulfillment**: Multi-status workflow (Pending, Processing, Shipped, Delivered) with carrier and tracking number inputs.
- **Payment Verification**: Native visibility into **Stripe** & **Razorpay** webhook transactions.
- **Cloud Infrastructure Monitor**: Live tracking of Free Tier usage across Cloudflare, Neon, Upstash, and Resend.

---

## 🛠️ Quick Start with Bun

### 1. Install Dependencies
```bash
bun install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```
Set `NEXT_PUBLIC_API_URL=http://localhost:8787` to point to the Hono backend.

### 3. Run Development Server
```bash
bun run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Build for Production
```bash
bun run build
bun run start
```

