import * as React from "react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types";

export interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    PENDING: { label: "En Attente", bg: "bg-amber-50 text-amber-700 border-amber-200" },
    CONFIRMED: { label: "Confirmée", bg: "bg-blue-50 text-blue-700 border-blue-200" },
    SHIPPED: { label: "En Livraison", bg: "bg-purple-50 text-purple-700 border-purple-200" },
    DELIVERED: { label: "Livrée & Payée", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    CANCELLED: { label: "Annulée", bg: "bg-rose-50 text-rose-700 border-rose-200" },
  };

  const item = config[status] || { label: status, bg: "bg-slate-100 text-slate-700 border-slate-200" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        item.bg
      )}
    >
      {item.label}
    </span>
  );
}
