"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { DashboardMetrics, Order, WeeklySaleData } from "@/types";
import { StatCards } from "@/components/dashboard/StatCards";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 3740000,
    totalOrders: 148,
    pendingOrders: 12,
    confirmedOrders: 36,
    deliveredOrders: 92,
    cancelledOrders: 8,
    totalProducts: 5,
    deliverySuccessRate: 92,
  });

  const [weeklySales, setWeeklySales] = useState<WeeklySaleData[]>([
    { day: "Lun", sales: 12, revenue: 298800 },
    { day: "Mar", sales: 19, revenue: 473100 },
    { day: "Mer", sales: 15, revenue: 373500 },
    { day: "Jeu", sales: 25, revenue: 622500 },
    { day: "Ven", sales: 32, revenue: 796800 },
    { day: "Sam", sales: 40, revenue: 996000 },
    { day: "Dim", sales: 28, revenue: 697200 },
  ]);

  const [recentOrders, setRecentOrders] = useState<Order[]>([
    {
      id: "ord-1",
      orderNumber: "DAP-250220-4821",
      customerFirstName: "Kouamé",
      customerLastName: "Yves",
      customerPhone: "+2250708091011",
      deliveryCity: "Abidjan",
      deliveryAddress: "Cocody Rivera 3",
      status: "PENDING",
      totalAmount: 24900,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "ord-2",
      orderNumber: "DAP-250220-3190",
      customerFirstName: "Amadou",
      customerLastName: "Diallo",
      customerPhone: "+221776543210",
      deliveryCity: "Dakar",
      deliveryAddress: "Plateau, Rue Carnot",
      status: "CONFIRMED",
      totalAmount: 49800,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "ord-3",
      orderNumber: "DAP-250219-9024",
      customerFirstName: "Fatou",
      customerLastName: "Kone",
      customerPhone: "+2250504030201",
      deliveryCity: "Bouaké",
      deliveryAddress: "Quartier Commerce",
      status: "DELIVERED",
      totalAmount: 24900,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        apiClient.get("/analytics/dashboard"),
        apiClient.get("/orders"),
      ]);
      if (analyticsRes.data) {
        setMetrics(analyticsRes.data.metrics);
        setWeeklySales(analyticsRes.data.weeklySales);
      }
      if (ordersRes.data) {
        setRecentOrders(ordersRes.data.slice(0, 5));
      }
    } catch (e) {
      console.warn("Utilisation des données initiales de démonstration");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tableau de Bord des Ventes</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Suivi des performances et commandes en temps réel
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-[#FF6B00]" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      <StatCards metrics={metrics} />

      {/* Chart Section */}
      <SalesChart data={weeklySales} />

      {/* Recent Orders Section */}
      <RecentOrders orders={recentOrders} />
    </div>
  );
}
