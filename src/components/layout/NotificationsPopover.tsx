"use client";

import React, { useState, useEffect, useRef } from "react";
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
  X,
  ChevronRight,
  ExternalLink,
  Flame
} from "lucide-react";
import { notificationsStore, AppNotification } from "@/lib/notifications";

export function NotificationsPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = notificationsStore.subscribe((list) => {
      setNotifications(list);
    });
    return () => unsubscribe();
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

  const handleNotificationClick = (item: AppNotification) => {
    notificationsStore.markAsRead(item.id);
    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const getTimeAgo = (createdAt: number) => {
    const elapsedMinutes = Math.floor((Date.now() - createdAt) / (60 * 1000));
    if (elapsedMinutes < 1) return "À l'instant";
    if (elapsedMinutes === 1) return "Il y a 1 min";
    return `Il y a ${elapsedMinutes} min`;
  };

  const getRemainingTime = (createdAt: number) => {
    const remainingMin = Math.max(0, 60 - Math.floor((Date.now() - createdAt) / (60 * 1000)));
    return `Expire dans ${remainingMin} min`;
  };

  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "order_created":
        return <ShoppingBag className="h-4 w-4 text-[#FF6B00]" />;
      case "order_confirmed":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case "order_delivered":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "order_cancelled":
        return <XCircle className="h-4 w-4 text-rose-500" />;
      case "stock_alert":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Flame className="h-4 w-4 text-orange-500" />;
    }
  };

  const getIconBg = (type: AppNotification["type"]) => {
    switch (type) {
      case "order_created":
        return "bg-orange-50";
      case "order_confirmed":
        return "bg-blue-50";
      case "order_delivered":
        return "bg-emerald-50";
      case "order_cancelled":
        return "bg-rose-50";
      case "stock_alert":
        return "bg-amber-50";
      default:
        return "bg-slate-50";
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Button avec Compteur Non-Lu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Centre de notifications éphémères"
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
              <h3 className="font-bold text-slate-900 text-sm">Activités Récentes</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-semibold flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" /> 1h max
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6B00] text-[11px] font-bold">
                  {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => notificationsStore.markAllAsRead()}
                  title="Tout marquer comme lu"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => notificationsStore.clearAll()}
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

          {/* Banner Éphémère */}
          <div className="px-4 py-1.5 bg-orange-50/50 border-b border-orange-100/50 flex items-center justify-between text-[11px] text-orange-800">
            <span className="flex items-center gap-1 font-medium">
              <Flame className="h-3 w-3 text-[#FF6B00]" /> Notifications éphémères (auto-nettoyage 1h)
            </span>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 px-4">
                <Bell className="h-8 w-8 mx-auto mb-2 text-slate-200" />
                <p className="text-sm font-medium">Aucune nouvelle action récente</p>
                <p className="text-xs text-slate-400 mt-0.5">Les alertes de moins d'1h s'afficheront ici</p>
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
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{getTimeAgo(item.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-orange-600/80 font-medium">
                        {getRemainingTime(item.createdAt)}
                      </span>
                    </div>
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

          {/* Footer - Redirection vers la page complète de gestion des notifications */}
          <div className="pt-2.5 pb-1 px-4 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/notifications");
              }}
              className="text-xs font-bold text-[#FF6B00] hover:text-[#e05e00] transition flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg hover:bg-orange-50/60"
            >
              Voir toutes les activités des commandes →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
