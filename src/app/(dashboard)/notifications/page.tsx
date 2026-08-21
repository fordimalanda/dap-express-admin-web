"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  ShoppingBag, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  CheckCheck, 
  PlusCircle, 
  ExternalLink,
  Flame,
  Filter,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { notificationsStore, AppNotification } from "@/lib/notifications";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "orders" | "alerts">("all");

  useEffect(() => {
    const unsubscribe = notificationsStore.subscribe((list) => {
      setNotifications(list);
    });
    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "orders") return n.type.startsWith("order");
    if (filter === "alerts") return n.type === "stock_alert" || n.type === "order_cancelled";
    return true;
  });

  const getTimeAgo = (createdAt: number) => {
    const elapsedMinutes = Math.floor((Date.now() - createdAt) / (60 * 1000));
    if (elapsedMinutes < 1) return "À l'instant";
    if (elapsedMinutes === 1) return "Il y a 1 min";
    return `Il y a ${elapsedMinutes} min`;
  };

  const getRemainingMinutes = (createdAt: number) => {
    return Math.max(0, 60 - Math.floor((Date.now() - createdAt) / (60 * 1000)));
  };

  const handleSimulateNewOrder = () => {
    const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
    const amounts = [25000, 45000, 78000, 120000];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    const cities = ["Brazzaville", "Pointe-Noire", "Dolisie"];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    notificationsStore.addNotification({
      title: "Nouvelle commande reçue !",
      message: `Commande #DAP-${randomOrderNum} effectuée pour ${randomAmount.toLocaleString()} FCFA (${randomCity})`,
      type: "order_created",
      read: false,
      link: "/orders",
      metadata: { orderNumber: `#DAP-${randomOrderNum}`, amount: randomAmount, customerCity: randomCity },
    });
  };

  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "order_created":
        return <ShoppingBag className="h-5 w-5 text-[#FF6B00]" />;
      case "order_confirmed":
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case "order_delivered":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "order_cancelled":
        return <XCircle className="h-5 w-5 text-rose-500" />;
      case "stock_alert":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Flame className="h-5 w-5 text-orange-500" />;
    }
  };

  const getBadgeStyle = (type: AppNotification["type"]) => {
    switch (type) {
      case "order_created":
        return "bg-orange-100 text-[#FF6B00] border-orange-200";
      case "order_confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "order_delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "order_cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "stock_alert":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getTypeLabel = (type: AppNotification["type"]) => {
    switch (type) {
      case "order_created":
        return "Nouvelle Commande";
      case "order_confirmed":
        return "Commande Confirmée";
      case "order_delivered":
        return "Livraison Réussie";
      case "order_cancelled":
        return "Commande Annulée";
      case "stock_alert":
        return "Alerte Stock";
      default:
        return "Action";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                Centre des Notifications & Activités
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00] text-white text-xs font-bold">
                    {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Clock className="h-3.5 w-3.5 text-orange-500" /> 
                Les alertes sont <span className="font-semibold text-slate-700">éphémères</span> : elles s'effacent automatiquement après <span className="font-bold text-[#FF6B00]">1 heure</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateNewOrder}
            className="flex items-center gap-1.5 text-xs font-bold border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <PlusCircle className="h-4 w-4 text-[#FF6B00]" />
            Simuler une commande test
          </Button>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => notificationsStore.markAllAsRead()}
              className="flex items-center gap-1.5 text-xs font-bold"
            >
              <CheckCheck className="h-4 w-4 text-emerald-600" />
              Tout marquer comme lu
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => notificationsStore.clearAll()}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
              Tout effacer
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            filter === "all"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Toutes les notifications ({notifications.length})
        </button>

        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            filter === "unread"
              ? "bg-[#FF6B00] text-white shadow-md shadow-orange-500/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Non lues ({unreadCount})
        </button>

        <button
          onClick={() => setFilter("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            filter === "orders"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Commandes ({notifications.filter((n) => n.type.startsWith("order")).length})
        </button>

        <button
          onClick={() => setFilter("alerts")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            filter === "alerts"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Alertes & Stocks ({notifications.filter((n) => n.type === "stock_alert" || n.type === "order_cancelled").length})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="h-16 w-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400 mb-4">
            <Bell className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Aucune notification dans cette vue</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Les notifications d'actions (commandes, livraisons, stock) de moins de 60 minutes s'afficheront ici automatiquement.
          </p>
          <div className="mt-6">
            <Button
              onClick={handleSimulateNewOrder}
              className="font-bold text-xs"
            >
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Générer une notification test
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => {
            const remainingMin = getRemainingMinutes(item.createdAt);
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
                  !item.read
                    ? "bg-white border-orange-200 ring-1 ring-orange-200"
                    : "bg-white/80 border-slate-200 opacity-85 hover:opacity-100"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getBadgeStyle(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                      <h4 className={`text-sm font-bold ${!item.read ? "text-slate-900" : "text-slate-700"}`}>
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="h-2 w-2 rounded-full bg-[#FF6B00]" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-xs text-slate-400 font-medium">
                      <span>{getTimeAgo(item.createdAt)}</span>
                      <span>•</span>
                      <span className="text-orange-600 flex items-center gap-1 font-semibold">
                        <Clock className="h-3 w-3" /> Expire dans {remainingMin} min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  {!item.read && (
                    <button
                      onClick={() => notificationsStore.markAsRead(item.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                    >
                      Marquer lu
                    </button>
                  )}
                  {item.link && (
                    <Button
                      size="sm"
                      onClick={() => {
                        notificationsStore.markAsRead(item.id);
                        router.push(item.link!);
                      }}
                      className="text-xs font-bold flex items-center gap-1"
                    >
                      Consulter
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <button
                    onClick={() => notificationsStore.delete(item.id)}
                    title="Supprimer la notification"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
