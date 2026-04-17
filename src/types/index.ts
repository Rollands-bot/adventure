// User roles
export type UserRole = "super_admin" | "staff" | "user";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price_per_day: number;
  category: string;
  stock: number;
  image_url: string;
  rating?: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  user?: UserProfile;
  total_amount: number;
  status: OrderStatus;
  rental_days: number;
  start_date: string;
  end_date: string;
  items: OrderItem[];
  payment_method?: string;
  payment_status: PaymentStatus;
  payment_proof_url?: string | null;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 
  | "pending"
  | "confirmed"
  | "renting"
  | "returned"
  | "cancelled"
  | "rejected";

export type PaymentStatus = 
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price_per_day: number;
  subtotal: number;
}

export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  total_users: number;
  pending_orders: number;
  active_rentals: number;
}
