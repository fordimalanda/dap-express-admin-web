"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  ExternalLink,
  LogOut,
  TrendingUp,
  Settings
} from "lucide-react";
import { authStorage } from "@/lib/auth";

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Commandes", href: "/orders", icon: ShoppingBag },
    { name: "Produits", href: "/products", icon: Package },
  ];

  const handleLogout = () => {
    authStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen border-r border-slate-800">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-black">
            D
          </span>
          Dap<span className="text-[#FF6B00]">Express</span>
          <span className="text-[10px] bg-slate-800 text-orange-400 px-1.5 py-0.5 rounded ml-1 font-bold">
            ADMIN
          </span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? "bg-[#FF6B00] text-white shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-6 pb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Liens Directs
        </div>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <span className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Boutique Client
          </span>
          <ExternalLink className="h-4 w-4 text-slate-500" />
        </a>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/30 transition"
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
