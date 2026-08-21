import React from "react";
import Link from "next/link";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import { ArrowRight, Phone } from "lucide-react";

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Dernières Commandes Clients</h3>
          <p className="text-xs text-slate-500">Traitez rapidement les commandes en attente</p>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] hover:text-[#E05E00]"
        >
          Voir toutes les commandes
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3">N° Commande</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Ville & Quartier</th>
              <th className="px-6 py-3">Montant</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                  Aucune commande récente
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">
                      {order.customerFirstName} {order.customerLastName}
                    </div>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <Phone className="h-3 w-3" /> {order.customerPhone}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="font-medium text-slate-900">{order.deliveryCity}</div>
                    <div className="text-xs text-slate-400 truncate max-w-xs">{order.deliveryAddress}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/orders`}
                      className="text-xs font-bold text-[#FF6B00] hover:underline"
                    >
                      Gérer
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
