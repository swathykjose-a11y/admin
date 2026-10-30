"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  ExternalLink,
  Store
} from "lucide-react";
import { Badge } from "./ui/badge";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Settings & Cloud", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-[#D5DDD6] flex flex-col min-h-screen">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-[#D5DDD6] gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#EAF3EE] flex items-center justify-center text-[#194F36]">
          <Store className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-[#1A211D]">Dainty Admin</span>
          <span className="text-[10px] text-[#737F76]">E-Commerce Engine</span>
        </div>
        <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
          Edge
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#194F36] text-white shadow-xs"
                  : "text-[#58635D] hover:bg-[#F2F5EF] hover:text-[#1A211D]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Storefront link */}
      <div className="p-4 border-t border-[#D5DDD6]">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#58635D] hover:text-[#194F36] bg-[#F2F5EF] hover:bg-[#EAF3EE] rounded-lg transition-colors border border-[#D5DDD6]"
        >
          <span>Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
}
