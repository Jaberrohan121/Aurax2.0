
export enum Category {
  Formal = 'Formal',
  Luxury = 'Luxury',
  Smart = 'Smart',
  Sports = 'Sports',
  Kids = 'Kids',
  Stylish = 'Stylish'
}

export enum OrderStatus {
  AwaitingAdminCost = 'AwaitingAdminCost', // Initial state after user places order
  AwaitingUserApproval = 'AwaitingUserApproval', // Admin sent cost, user must approve
  AwaitingPayment = 'AwaitingPayment', // User approved cost, waiting for Bkash/Nagad confirmation
  PaymentConfirmPending = 'PaymentConfirmPending', // User clicked "Payment Confirmed" for Bkash/Nagad
  ReadyToShip = 'ReadyToShip', // COD approved or Payment verified
  Shipped = 'Shipped', // Admin clicked ship
  Delivered = 'Delivered', // User clicked received
  Cancelled = 'Cancelled'
}

export type PaymentMethod = 'Bkash' | 'Nagad' | 'Cash on Delivery';
export type DeliveryMethod = 'Standard' | 'Premium';

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
  
  // Admin fields
  baseTotal?: number;
  vat?: number;
  deliveryCharge?: number;
  grandTotal?: number;
  adminNote?: string;
  paymentProof?: boolean; // If user clicked "Payment Confirmed"
}

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
}

export interface Offer {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}
