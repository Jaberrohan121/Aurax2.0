
import React, { useState, useMemo } from 'react';
import { User, Order, WatchProduct, Category, OrderStatus, Offer, ChatMessage } from '../types.ts';
import { ICONS } from '../constants.tsx';
import AdminOrders from './AdminOrders.tsx';
import ChatBox from './ChatBox.tsx';

interface AdminPanelProps {
  admin: User;
  users: User[];
  products: WatchProduct[];
  orders: Order[];
  offers: Offer[];
  messages: ChatMessage[];
  bkash: string;
  nagad: string;
  setProducts: React.Dispatch<React.SetStateAction<WatchProduct[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setBkash: (val: string) => void;
  setNagad: (val: string) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  admin, users, products, orders, offers, messages, bkash, nagad,
  setProducts, setOrders, setOffers, setMessages, setBkash, setNagad, onLogout
}) => {
  const [activeMenu, setActiveMenu] = useState<'stats' | 'products' | 'orders' | 'users' | 'offers' | 'chats' | 'settings'>('stats');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingOffer, setIsAddingOffer] = useState(false);

  const [newProduct, setNewProduct] = useState<Partial<WatchProduct>>({
    name: '', brand: '', category: Category.Formal, description: '', 
    price: 0, stock: 0, colors: [], ageGroup: 'Adult', imageUrl: ''
  });

  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '', description: '', imageUrl: '', type: 'offer'
  });

  const stats = useMemo(() => {
    const totalSales = orders.filter(o => o.status === OrderStatus.Delivered).reduce((acc, o) => acc + (o.grandTotal || 0), 0);
    const activeOrders = orders.filter(o => o.status !== OrderStatus.Delivered && o.status !== OrderStatus.Cancelled).length;
    const growth = users.length;
    return { totalSales, activeOrders, growth };
  }, [orders, users]);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: WatchProduct = { ...newProduct as WatchProduct, id: 'p' + Math.random().toString(36).substr(2, 5) };
    setProducts([...products, product]);
    setIsAddingProduct(false);
    setNewProduct({ name: '', brand: '', category: Category.Formal, description: '', price: 0, stock: 0, colors: [], ageGroup: 'Adult', imageUrl: '' });
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const offer: Offer = { ...newOffer as Offer, id: 'off' + Date.now(), timestamp: Date.now() };
    setOffers([...offers, offer]);
    setIsAddingOffer(false);
    setNewOffer({ title: '', description: '', imageUrl: '', type: 'offer' });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100">
      <aside className="w-64 bg-slate-950 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-3 text-amber-500 font-black text-xl mb-8">
            {ICONS.Watch} AURAX ADMIN
          </div>
          <nav className="space-y-1">
            <button onClick={() => setActiveMenu('stats')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'stats' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>{ICONS.Stats} Dashboard</button>
            <button onClick={() => setActiveMenu('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'orders' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>{ICONS.Package} Orders</button>
            <button onClick={() => setActiveMenu('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'products' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>{ICONS.Plus} Products</button>
            <button onClick={() => setActiveMenu('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'users' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>{ICONS.Users} Customers</button>
            <button onClick={() => setActiveMenu('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'settings' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>{ICONS.Settings} Settings</button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-950/30 text-red-500 transition">{ICONS.LogOut} Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
        {activeMenu === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Total Sales</p>
              <p className="text-4xl font-black text-emerald-400">৳{stats.totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Users</p>
              <p className="text-4xl font-black text-amber-500">{stats.growth}</p>
            </div>
          </div>
        )}
        {activeMenu === 'orders' && <AdminOrders orders={orders} setOrders={setOrders} products={products} />}
        {activeMenu === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-3xl font-black">Products</h2><button onClick={() => setIsAddingProduct(true)} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-black">{ICONS.Plus} ADD</button></div>
            {isAddingProduct && (
              <form onSubmit={handleSaveProduct} className="bg-slate-800 p-6 rounded-2xl border border-amber-600/50 space-y-4">
                <input type="text" placeholder="Name" required className="bg-slate-900 p-3 rounded-lg w-full" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <button type="submit" className="bg-emerald-600 px-6 py-2 rounded-lg font-bold">Save Product</button>
              </form>
            )}
          </div>
        )}
        {activeMenu === 'settings' && <div className="max-w-md space-y-4"><input type="text" value={bkash} onChange={e => setBkash(e.target.value)} className="w-full bg-slate-900 p-4 rounded-xl text-amber-500 font-bold" /></div>}
      </main>
    </div>
  );
};

export default AdminPanel;
