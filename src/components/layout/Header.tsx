"use client";

import React, { useEffect, useState } from "react";
import { authStorage } from "@/lib/auth";
import { AdminUser } from "@/types";
import { User, Bell } from "lucide-react";

export function Header() {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setUser(authStorage.getUser() || {
      id: "admin-1",
      name: "Admin Principal",
      email: "admin@dap-express.com",
      role: "SUPER_ADMIN",
    });
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-slate-800">Espace Propriétaire</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FF6B00]" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-bold text-slate-800">{user?.name}</div>
            <div className="text-xs text-slate-500">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
