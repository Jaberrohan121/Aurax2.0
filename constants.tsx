
import React from 'react';
import { 
  Watch, ShoppingCart, User, LogOut, Search, 
  Settings, Package, Users, BarChart3, 
  MessageSquare, Bell, CreditCard, Truck, 
  CheckCircle2, Clock, XCircle, Plus, 
  Star, ChevronRight, Menu, Image as ImageIcon,
  ShieldCheck, Smartphone, Zap, Gift
} from 'lucide-react';

export const ICONS = {
  Watch: <Watch size={20} />,
  Cart: <ShoppingCart size={20} />,
  User: <User size={20} />,
  LogOut: <LogOut size={20} />,
  Search: <Search size={20} />,
  Settings: <Settings size={20} />,
  Package: <Package size={20} />,
  Users: <Users size={20} />,
  Stats: <BarChart3 size={20} />,
  Chat: <MessageSquare size={20} />,
  Bell: <Bell size={20} />,
  Payment: <CreditCard size={20} />,
  Delivery: <Truck size={20} />,
  Check: <CheckCircle2 size={20} />,
  Pending: <Clock size={20} />,
  Cancel: <XCircle size={20} />,
  Plus: <Plus size={20} />,
  Star: <Star size={20} />,
  ArrowRight: <ChevronRight size={20} />,
  Menu: <Menu size={20} />,
  ImageIcon: <ImageIcon size={20} />,
  Shield: <ShieldCheck size={20} />,
  Smart: <Smartphone size={20} />,
  Flash: <Zap size={20} />,
  Gift: <Gift size={20} />
};

export const ADMIN_CREDENTIALS = {
  email: 'admin3262@gmail.com',
  password: 'beautiful54321'
};

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Royal Oak Skeleton',
    brand: 'Audemars Piguet',
    category: 'Luxury',
    description: 'A masterpiece of Swiss horology with skeletonized dial and self-winding mechanism.',
    price: 45000,
    stock: 5,
    colors: ['Silver', 'Gold'],
    ageGroup: 'Adult',
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p2',
    name: 'G-Shock Mudmaster',
    brand: 'Casio',
    category: 'Sports',
    description: 'Engineered for extreme environments with dirt resistance and triple sensor technology.',
    price: 12000,
    stock: 20,
    colors: ['Black', 'Olive', 'Sand'],
    ageGroup: 'All Ages',
    imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p3',
    name: 'Classic Heritage',
    brand: 'Tissot',
    category: 'Formal',
    description: 'Minimalist design with leather strap for professional elegance.',
    price: 8500,
    stock: 12,
    colors: ['Brown', 'Black'],
    ageGroup: 'Adult',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800'
  }
];
