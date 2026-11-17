# Dainty Dazzle - Admin & Dropship Hub

Admin dashboard application built with **Next.js App Router (`src/app/`)**, **TypeScript**, **Tailwind CSS**, **shadcn UI components**, and managed with **Bun**.

---

## ⚡ Features

1. **Dropship Order Fulfillment**:
   - Filter orders by status: `Needs Ordering` (⚠️ Action required), `Ordered at Supplier`, `Shipped`, `Delivered`.
   - **1-Click Address Copy**: Formats the customer's full address and phone number for immediate copy-pasting into AliExpress, Meesho, or supplier checkout pages.
   - **Real-Time Profit & Margin Calculator**: Automatically computes profit (Selling Price − Supplier Cost) and margin percentage.
   - **Courier Tracking Integration**: Assign courier tracking numbers and direct carrier links to keep customers informed.

2. **Catalog & Product Management**:
   - Create, edit, and deactivate jewelry items with titles, slugs, prices (₹ INR), compare-at prices, stock inventory, tags, and variants.
   - Supports image hosting via Cloudflare R2 / Unsplash.

3. **Homepage CMS & Banners**:
   - Live visual editor for Hero Banner, Featured Section, Editorial Banner, and Brand Story.
   - Automatically synchronizes with the Hono backend server and triggers Next.js cache revalidation.

4. **shadcn UI Components**:
   - Clean, accessible components installed using the shadcn MCP server:
     `Button`, `Card`, `Badge`, `Table`, `Dialog`, `Input`, `Textarea`, `Tabs`, `Separator`, `DropdownMenu`.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Bun](https://bun.sh/) (v1.2+)

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Settings:
- `NEXT_PUBLIC_SERVER_URL`: URL of the Hono backend server (defaults to `http://localhost:8787`).
- `NEXT_PUBLIC_ADMIN_KEY`: Shared secret key matching `ADMIN_API_KEY` on the server.

### 3. Install & Run
```bash
# Install dependencies
bun install

# Run development server
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser (or port assigned by Next.js).
