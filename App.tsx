
import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Order, WatchProduct, Category, 
  CartItem, OrderStatus, Offer, ChatMessage 
} from './types.ts';
import { ADMIN_CREDENTIALS, INITIAL_PRODUCTS, ICONS } from './constants.tsx';
import AuthPage from './components/AuthPage.tsx';
import Storefront from './components/Storefront.tsx';
import AdminPanel from './components/AdminPanel.tsx';

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aurax_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('aurax_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<WatchProduct[]>(() => {
    const saved = localStorage.getItem('aurax_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aurax_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('aurax_offers');
    return saved ? JSON.parse(saved) : [
      { id: 'off1', title: 'Grand Launch Sale', description: 'Get 20% off on all Luxury items.', imageUrl: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1200', type: 'offer' },
      { id: 'off2', title: 'Eid Collection', description: 'Special formal watches for special moments.', imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=1200', type: 'offer' },
      { id: 'pro1', title: 'Flash 50% Off', description: 'Exclusive discount on Royal Oak series for the next 24 hours.', imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400', type: 'promo' },
      { id: 'pro2', title: 'Member Special', description: 'Verified members get free premium delivery on all orders above ৳10,000.', imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=400', type: 'promo' },
      { id: 'act1', title: 'Your Free Gift Is Waiting 🎁', description: 'Treasure Chest is live. Play now & win today! 😍', imageUrl: 'https://images.unsplash.com/photo-1600003014755-ba31aa5588f7?auto=format&fit=crop&q=80&w=600', type: 'activity', timestamp: Date.now() }
    ];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aurax_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [bkashNumber, setBkashNumber] = useState(localStorage.getItem('aurax_bkash') || '01712345678');
  const [nagadNumber, setNagadNumber] = useState(localStorage.getItem('aurax_nagad') || '01912345678');

  // Persistence
  useEffect(() => {
    localStorage.setItem('aurax_current_user', JSON.stringify(currentUser));
    localStorage.setItem('aurax_users', JSON.stringify(users));
    localStorage.setItem('aurax_products', JSON.stringify(products));
    localStorage.setItem('aurax_orders', JSON.stringify(orders));
    localStorage.setItem('aurax_offers', JSON.stringify(offers));
    localStorage.setItem('aurax_chats', JSON.stringify(messages));
    localStorage.setItem('aurax_bkash', bkashNumber);
    localStorage.setItem('aurax_nagad', nagadNumber);
  }, [currentUser, users, products, orders, offers, messages, bkashNumber, nagadNumber]);

  // Auth Handlers
  const handleLogin = (email: string, pass: string) => {
    if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
      const admin: User = { id: 'admin', email, name: 'Admin', role: 'admin', phone: '', address: '' };
      setCurrentUser(admin);
      return true;
    }
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleSignup = (userData: Partial<User>) => {
    if (users.find(u => u.email === userData.email)) return false;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email!,
      password: userData.password!,
      name: userData.name!,
      phone: userData.phone!,
      address: userData.address!,
      role: 'user',
      wishlist: [],
      recentlyViewed: []
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const handleUpdateUser = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(users.map(u => u.id === updated.id ? updated : u));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (currentUser.role === 'admin') {
    return (
      <AdminPanel 
        admin={currentUser}
        users={users}
        products={products}
        orders={orders}
        offers={offers}
        messages={messages}
        bkash={bkashNumber}
        nagad={nagadNumber}
        setProducts={setProducts}
        setOrders={setOrders}
        setOffers={setOffers}
        setMessages={setMessages}
        setBkash={setBkashNumber}
        setNagad={setNagadNumber}
        onLogout={logout}
      />
    );
  }

  return (
    <Storefront 
      user={currentUser}
      products={products}
      orders={orders}
      offers={offers}
      messages={messages}
      bkash={bkashNumber}
      nagad={nagadNumber}
      setOrders={setOrders}
      setMessages={setMessages}
      onLogout={logout}
      updateUser={handleUpdateUser}
    />
  );
};

export default App;
