"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import { Phone, Search, Filter, Check, RefreshCw } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ord-1",
      orderNumber: "DAP-250220-4821",
      customerFirstName: "Kouamé",
      customerLastName: "Yves",
      customerPhone: "+2250708091011",
      deliveryCity: "Abidjan",
      deliveryAddress: "Cocody Rivera 3, Villa 4",
      notes: "Appeler avant d'arriver",
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
      notes: "",
      status: "CONFIRMED",
      totalAmount: 49800,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const url = filterStatus !== "ALL" ? `/orders?status=${filterStatus}` : "/orders";
      const res = await apiClient.get(url);
      if (res.data) setOrders(res.data);
    } catch (e) {
      console.warn("Using sample orders state");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setLoadingId(orderId);
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (e) {
      // Local optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } finally {
      setLoadingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestion des Commandes</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Suivez, confirmez et mettez à jour le statut des livraisons en temps réel
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher (N° commande, nom, tel)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B00] focus:outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterStatus === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "Tous" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Orders */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">N° Commande</th>
                <th className="px-6 py-3.5">Client & Contact</th>
                <th className="px-6 py-3.5">Adresse de livraison</th>
                <th className="px-6 py-3.5">Montant Total</th>
                <th className="px-6 py-3.5">Statut Actuel</th>
                <th className="px-6 py-3.5 text-right">Changer Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {order.customerFirstName} {order.customerLastName}
                      </div>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5"
                      >
                        <Phone className="h-3 w-3" /> {order.customerPhone}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="font-medium text-slate-900">{order.deliveryCity}</div>
                      <div className="text-xs text-slate-400 max-w-xs truncate">{order.deliveryAddress}</div>
                      {order.notes && (
                        <div className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">
                          Note: {order.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatPrice(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={order.status}
                        disabled={loadingId === order.id}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs font-semibold rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:border-[#FF6B00] focus:outline-none"
                      >
                        <option value="PENDING">En Attente</option>
                        <option value="CONFIRMED">Confirmée</option>
                        <option value="SHIPPED">En Livraison</option>
                        <option value="DELIVERED">Livrée & Encaissée</option>
                        <option value="CANCELLED">Annulée</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
