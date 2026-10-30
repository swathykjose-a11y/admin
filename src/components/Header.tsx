"use client";

import { Bell, Search, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-[#E2E8E4] px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="relative w-72">
        <Search className="w-4 h-4 text-[#737F76] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-[#737F76] hover:text-[#111815] hover:bg-[#F2F5EF] rounded-lg transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-[#194F36] rounded-full absolute top-1.5 right-1.5" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-[#E2E8E4]">
          <div className="w-8 h-8 rounded-full bg-[#EAF3EE] flex items-center justify-center text-[#194F36]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-[#111815]">Admin User</p>
            <p className="text-[10px] text-[#737F76]">Cloudflare Edge</p>
          </div>
        </div>
      </div>
    </header>
  );
}

