export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: "bestseller" | "popular" | "new";
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  deliveryTime: string;
  notes: string;
}

export interface OrderPayload {
  customer: CustomerDetails;
  items: CartItem[];
  totalPrice: number;
}

export interface ApiResponse {
  success: boolean;
  orderId?: string;
  message: string;
  error?: string;
}
