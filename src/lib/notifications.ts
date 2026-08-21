export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "order_created" | "order_confirmed" | "order_delivered" | "order_cancelled" | "stock_alert";
  createdAt: number; // Timestamp en millisecondes
  read: boolean;
  link?: string;
  metadata?: {
    orderNumber?: string;
    amount?: number;
    productName?: string;
    customerCity?: string;
  };
}

const STORAGE_KEY = "dap_admin_notifications_v1";
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 heure = 3 600 000 ms

// Notifications de démonstration récentes (dans la fenêtre de 1 heure)
const getInitialSeedNotifications = (): AppNotification[] => {
  const now = Date.now();
  return [
    {
      id: "flash-notif-1",
      title: "Nouvelle commande reçue",
      message: "Commande #DAP-7492 enregistrée pour 38 000 FCFA (Brazzaville)",
      type: "order_created",
      createdAt: now - 3 * 60 * 1000, // Il y a 3 min
      read: false,
      link: "/orders",
      metadata: { orderNumber: "#DAP-7492", amount: 38000, customerCity: "Brazzaville" },
    },
    {
      id: "flash-notif-2",
      title: "Livraison confirmée",
      message: "Commande #DAP-7480 livrée avec succès au client (Pointe-Noire)",
      type: "order_delivered",
      createdAt: now - 18 * 60 * 1000, // Il y a 18 min
      read: false,
      link: "/orders",
      metadata: { orderNumber: "#DAP-7480", customerCity: "Pointe-Noire" },
    },
    {
      id: "flash-notif-3",
      title: "Alerte Stock Critique",
      message: "Stock faible pour 'Écouteurs Sans Fil Pro' : seulement 3 unités restantes !",
      type: "stock_alert",
      createdAt: now - 34 * 60 * 1000, // Il y a 34 min
      read: false,
      link: "/products",
      metadata: { productName: "Écouteurs Sans Fil Pro" },
    },
    {
      id: "flash-notif-4",
      title: "Commande en attente d'expédition",
      message: "Commande #DAP-7475 confirmée par le client, prête pour livraison",
      type: "order_confirmed",
      createdAt: now - 48 * 60 * 1000, // Il y a 48 min
      read: true,
      link: "/orders",
      metadata: { orderNumber: "#DAP-7475" },
    },
  ];
};

type Listener = (notifications: AppNotification[]) => void;

class NotificationsManager {
  private listeners: Set<Listener> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      // Nettoyage périodique toutes les 30 secondes pour purger les notifications > 1h
      setInterval(() => {
        this.purgeExpired();
      }, 30000);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Appel immédiat avec l'état actuel
    listener(this.getAll());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const list = this.getAll();
    this.listeners.forEach((l) => l(list));
  }

  // Récupère uniquement les notifications valides (moins d'une heure)
  public getAll(): AppNotification[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      let list: AppNotification[] = raw ? JSON.parse(raw) : [];

      if (!raw || list.length === 0) {
        list = getInitialSeedNotifications();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      // Filtrer strictement les notifications éphémères de moins de 1 heure
      const valid = list.filter((item) => now - item.createdAt < ONE_HOUR_MS);

      if (valid.length !== list.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
      }

      // Tri chronologique décroissant (plus récentes en premier)
      return valid.sort((a, b) => b.createdAt - a.createdAt);
    } catch {
      return [];
    }
  }

  public getUnreadCount(): number {
    return this.getAll().filter((n) => !n.read).length;
  }

  public markAsRead(id: string) {
    const list = this.getAll().map((n) => (n.id === id ? { ...n, read: true } : n));
    this.save(list);
  }

  public markAllAsRead() {
    const list = this.getAll().map((n) => ({ ...n, read: true }));
    this.save(list);
  }

  public delete(id: string) {
    const list = this.getAll().filter((n) => n.id !== id);
    this.save(list);
  }

  public clearAll() {
    this.save([]);
  }

  public addNotification(notif: Omit<AppNotification, "id" | "createdAt">) {
    const current = this.getAll();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: Date.now(),
    };
    this.save([newNotif, ...current]);
  }

  public purgeExpired() {
    const valid = this.getAll();
    this.notify();
  }

  private save(list: AppNotification[]) {
    if (typeof window === "undefined") return;
    const now = Date.now();
    const valid = list.filter((item) => now - item.createdAt < ONE_HOUR_MS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    this.notify();
  }
}

export const notificationsStore = new NotificationsManager();
