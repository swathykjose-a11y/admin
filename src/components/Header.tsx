"use client";

import { Bell, Search, ShieldCheck } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-[#D5DDD6] px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="relative w-80">
        <Search className="w-4 h-4 text-[#737F76] absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search products, orders, customers..."
          className="pl-9 bg-[#F2F5EF]/60 border-[#D5DDD6]"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-[#737F76] hover:text-[#1A211D]">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-[#194F36] rounded-full absolute top-2 right-2" />
        </Button>

        <div className="flex items-center gap-2 pl-3 border-l border-[#D5DDD6]">
          <div className="w-8 h-8 rounded-full bg-[#EAF3EE] flex items-center justify-center text-[#194F36] font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#1A211D]">Administrator</p>
            <p className="text-[10px] text-[#737F76]">Cloudflare Edge</p>
          </div>
        </div>
      </div>
    </header>
  );
}
