"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  ShoppingBag, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Trash2, 
  CheckCheck, 
  X,
  ChevronRight
} from "lucide-react";
import { apiClient } from "@/lib/api";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "order" | "stock" | "delivery" | "info";
  time: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Nouvelle commande reçue",
    message: "Commande #DAP-4921 pour 45 000 FCFA (Brazzaville)",
    type: "order",
    time: "Il y a 3 min",
    read: false,
    link: "/orders",
  },
  {
    id: "notif-2",
    title: "Alerte Stock Faible",
    message: "Le produit 'Montre Connectée Sport' a moins de 5 unités en stock.",
    type: "stock",
    time: "Il y a 25 min",
    read: false,
    link: "/products",
  },
  {
    id: "notif-3",
    title: "Livraison Confirmée",
    message: "La commande #DAP-4890 a été marquée comme livrée.",
    type: "delivery",
    time: "Il y a 2 heures",
    read: true,
    link: "/orders",
  },
];

export function NotificationsPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Synchronisation avec les commandes réelles si disponibles
  useEffect(() => {
    const fetchLatestOrdersForNotif = async () => {
      try {
        const res = await apiClient.get("/orders");
        if (Array.isArray(res.data) && res.data.length > 0) {
          const recent = res.data.slice(0, 3).map((ord: any, idx: number) => ({
            id: `api-ord-${ord.id || idx}`,
            title: ord.status === "PENDING" ? "Nouvelle commande en attente" : `Commande ${ord.status.toLowerCase()}`,
            message: `Commande ${ord.orderNumber} par ${ord.customerFirstName} ${ord.customerLastName} (${ord.totalAmount?.toLocaleString()} FCFA)`,
            type: (ord.status === "DELIVERED" ? "delivery" : "order") as "delivery" | "order",
            time: "Récemment",
            read: false,
            link: "/orders",
          }));

          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const newNotifs = recent.filter((n: any) => !existingIds.has(n.id));
            return [...newNotifs, ...prev];
          });
        }
      } catch (err) {
        // En cas d'erreur de requête silencieuse, conserver les notifications par défaut
      }
    };

    fetchLatestOrdersForNotif();
  }, []);

  // Fermer quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-4 w-4 text-[#FF6B00]" />;
      case "stock":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "delivery":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getIconBg = (type: NotificationItem["type"]) => {
    switch (type) {
      case "order":
        return "bg-orange-50";
      case "stock":
        return "bg-amber-50";
      case "delivery":
        return "bg-emerald-50";
      default:
        return "bg-blue-50";
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Centre de notifications"
        className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#FF6B00] text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6B00] text-[11px] font-bold">
                  {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  title="Tout marquer comme lu"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Effacer tout"
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 px-4">
                <Bell className="h-8 w-8 mx-auto mb-2 text-slate-200" />
                <p className="text-sm font-medium">Aucune notification</p>
                <p className="text-xs text-slate-400 mt-0.5">Vous êtes parfaitement à jour !</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 relative group ${
                    !item.read ? "bg-orange-50/30" : ""
                  }`}
                >
                  <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${getIconBg(item.type)}`}>
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs truncate ${!item.read ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  <div className="flex items-center self-center pl-1">
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-[#FF6B00] mr-1 flex-shrink-0" />
                    )}
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="pt-2 px-4 border-t border-slate-100 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/orders");
                }}
                className="text-xs font-bold text-[#FF6B00] hover:text-[#e05e00] transition"
              >
                Voir toutes les activités des commandes →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
