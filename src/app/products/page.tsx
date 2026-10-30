import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { Badge } from "../../components/Badge";

const sampleProducts = [
  {
    id: "prod_1",
    title: "Minimalist Ceramic Matcha Bowl",
    slug: "minimalist-ceramic-matcha-bowl",
    price: "$48.00",
    status: "published",
    category: "Tableware",
    inventory: 34,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "prod_2",
    title: "Organic Linen Bedding Set (Queen)",
    slug: "organic-linen-bedding-set",
    price: "$185.00",
    status: "published",
    category: "Home",
    inventory: 12,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "prod_3",
    title: "Hand-Poured Soy Wax Candle (Sage & Cedar)",
    slug: "soy-wax-candle-sage-cedar",
    price: "$28.00",
    status: "published",
    category: "Fragrance",
    inventory: 56,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "prod_4",
    title: "Brushed Brass Coffee Dripper",
    slug: "brushed-brass-coffee-dripper",
    price: "$62.00",
    status: "draft",
    category: "Kitchen",
    inventory: 0,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80",
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111815]">Product Catalog</h1>
          <p className="text-sm text-[#737F76] mt-0.5">
            Manage product listings, variants, pricing, and images on Cloudflare R2.
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 bg-[#194F36] hover:bg-[#133D2A] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8E4] flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#737F76] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, SKU, or tag..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#58635D] bg-[#F8FAF9] hover:bg-[#F2F5EF] border border-[#E2E8E4] rounded-lg transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Category: All
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#58635D] bg-[#F8FAF9] hover:bg-[#F2F5EF] border border-[#E2E8E4] rounded-lg transition-colors">
            Status: All
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E2E8E4] rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8FAF9] text-xs font-semibold text-[#737F76] uppercase tracking-wider border-b border-[#E2E8E4]">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Inventory</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8E4]">
            {sampleProducts.map((p) => (
              <tr key={p.id} className="hover:bg-[#F2F5EF]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-11 h-11 rounded-lg object-cover border border-[#E2E8E4]"
                    />
                    <div>
                      <p className="font-medium text-[#111815]">{p.title}</p>
                      <p className="text-xs text-[#737F76] font-mono">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#58635D]">{p.category}</td>
                <td className="px-6 py-4">
                  <Badge status={p.status} />
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`font-medium ${
                      p.inventory > 0 ? "text-[#111815]" : "text-rose-600 font-semibold"
                    }`}
                  >
                    {p.inventory > 0 ? `${p.inventory} in stock` : "Out of stock"}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-[#111815]">{p.price}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-medium text-[#194F36] hover:underline mr-3">
                    Edit
                  </button>
                  <button className="text-xs font-medium text-rose-600 hover:underline">
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

