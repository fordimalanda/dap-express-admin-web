import React from "react";
import { DashboardMetrics } from "@/types";
import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingBag, Clock, CheckCircle2, PackageCheck, AlertCircle } from "lucide-react";

interface StatCardsProps {
  metrics: DashboardMetrics;
}

export function StatCards({ metrics }: StatCardsProps) {
  const cards = [
    {
      title: "Chiffre d'Affaires",
      value: formatPrice(metrics.totalRevenue),
      desc: "Commandes confirmées & livrées",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Total Commandes",
      value: metrics.totalOrders.toString(),
      desc: "Depuis le lancement",
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "À Confirmer (Pending)",
      value: metrics.pendingOrders.toString(),
      desc: "Appels clients à passer",
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Livrées & Encaissées",
      value: metrics.deliveredOrders.toString(),
      desc: `Taux succès : ${metrics.deliverySuccessRate}%`,
      icon: PackageCheck,
      color: "text-[#FF6B00] bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{card.title}</span>
              <div className={`p-2.5 rounded-xl ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-slate-900">{card.value}</div>
            <p className="mt-1 text-xs text-slate-500">{card.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
