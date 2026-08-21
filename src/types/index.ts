export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'MANAGER' | 'SUPPORT';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  features?: string[];
  isAvailable: boolean;
  adTrackingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  notes?: string;
  status: OrderStatus;
  totalAmount: number;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  deliverySuccessRate: number;
}

export interface WeeklySaleData {
  day: string;
  sales: number;
  revenue: number;
}
