

export enum Category {
  Formal = 'Formal',
  Luxury = 'Luxury',
  Smart = 'Smart',
  Sports = 'Sports',
  Kids = 'Kids',
  Stylish = 'Stylish'
}

export enum OrderStatus {
  AwaitingAdminCost = 'AwaitingAdminCost',
  AwaitingUserApproval = 'AwaitingUserApproval',
  AwaitingPayment = 'AwaitingPayment',
  PaymentConfirmPending = 'PaymentConfirmPending',
  ReadyToShip = 'ReadyToShip',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export type PaymentMethod = 'Bkash' | 'Nagad' | 'Cash on Delivery';
export type DeliveryMethod = 'Standard' | 'Premium';

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export interface WatchProduct {
  id: string;
  name: string;
  brand: string;
  category: Category;
  description: string;
  price: number;
  stock: number;
  colors: string[];
  ageGroup: string;
  imageUrl: string;
}

export interface CartItem {
  productId: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  items: (CartItem & { productName: string; unitPrice: number; imageUrl: string })[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  placedAt: number;
  baseTotal?: number;
  vat?: number;
  deliveryCharge?: number;
  grandTotal?: number;
  adminNote?: string;
  paymentProof?: boolean;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
  recentlyViewed?: string[];
  wishlist?: string[];
}

export interface Offer {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  type?: 'offer' | 'promo' | 'activity';
  timestamp?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}