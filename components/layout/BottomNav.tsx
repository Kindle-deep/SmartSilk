"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Tv, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "首页", icon: Home, href: "/" },
  { label: "路线", icon: Map, href: "/route" },
  { label: "漫游", icon: Tv, href: "/virtual" },
  { label: "商城", icon: ShoppingBag, href: "/shop" },
  { label: "我的", icon: User, href: "/user" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive ? "text-[#667eea]" : "text-slate-400" // 使用 app.json 定义的主色调 
              )}
            >
              <item.icon className={cn("w-5 h-5 mb-1", isActive && "fill-current")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;