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
    <aside className="w-64 bg-white border-r border-[#E2E8E4] flex flex-col min-h-screen">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-[#E2E8E4] gap-2">
        <Store className="w-5 h-5 text-[#194F36]" />
        <span className="font-semibold text-lg tracking-tight text-[#111815]">Dainty Admin</span>
        <span className="text-xs bg-[#EAF3EE] text-[#194F36] px-2 py-0.5 rounded-full font-medium ml-auto">
          Edge
        </span>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#194F36] text-white"
                  : "text-[#58635D] hover:bg-[#F2F5EF] hover:text-[#111815]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Storefront link */}
      <div className="p-4 border-t border-[#E2E8E4]">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#58635D] hover:text-[#194F36] bg-[#F8FAF9] hover:bg-[#F2F5EF] rounded-lg transition-colors border border-[#E2E8E4]"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
}

