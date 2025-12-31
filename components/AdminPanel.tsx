
import React, { useState, useMemo } from 'react';
import { User, Order, WatchProduct, Category, OrderStatus, Offer, ChatMessage } from '../types';
import { ICONS } from '../constants';
import AdminOrders from './AdminOrders';
import ChatBox from './ChatBox';

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

  const stats = useMemo(() => {
    const totalSales = orders.filter(o => o.status === OrderStatus.Delivered).reduce((acc, o) => acc + (o.grandTotal || 0), 0);
    const activeOrders = orders.filter(o => o.status !== OrderStatus.Delivered && o.status !== OrderStatus.Cancelled).length;
    const growth = users.length;
    return { totalSales, activeOrders, growth };
  }, [orders, users]);

  // Notifications count
  const notifications = orders.filter(o => o.status === OrderStatus.AwaitingAdminCost || o.status === OrderStatus.PaymentConfirmPending).length;

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-3 text-amber-500 font-black text-xl mb-8">
            {ICONS.Watch} AURAX ADMIN
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveMenu('stats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'stats' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              {ICONS.Stats} Dashboard
            </button>
            <button 
              onClick={() => setActiveMenu('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeMenu === 'orders' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <div className="flex items-center gap-3">
                {ICONS.Package} Orders
              </div>
              {notifications > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{notifications}</span>}
            </button>
            <button 
              onClick={() => setActiveMenu('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'products' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              {ICONS.Plus} Products
            </button>
            <button 
              onClick={() => setActiveMenu('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'users' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              {ICONS.Users} Customers
            </button>
            <button 
              onClick={() => setActiveMenu('offers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'offers' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              {ICONS.Gift} Offers
            </button>
            <button 
              onClick={() => setActiveMenu('chats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'chats' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              {ICONS.Chat} Support Chats
            </button>
            <button 
              onClick={() => setActiveMenu('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'settings' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              {ICONS.Settings} Settings
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-950/30 text-red-500 transition">
            {ICONS.LogOut} Logout
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
        
        {activeMenu === 'stats' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black mb-8">Business Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Total Economy</p>
                <p className="text-4xl font-black text-emerald-400">৳{stats.totalSales.toLocaleString()}</p>
                <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[65%]"></div>
                </div>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Active Growth</p>
                <p className="text-4xl font-black text-amber-500">{stats.growth}</p>
                <p className="mt-2 text-xs text-slate-500">Registered customers</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Live Orders</p>
                <p className="text-4xl font-black text-sky-400">{stats.activeOrders}</p>
                <p className="mt-2 text-xs text-slate-500">Pending delivery</p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
              <h3 className="text-xl font-bold mb-6">Recent Sales Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-700">
                      <th className="pb-4 px-2">Order</th>
                      <th className="pb-4 px-2">Customer</th>
                      <th className="pb-4 px-2">Amount</th>
                      <th className="pb-4 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(-5).reverse().map(o => (
                      <tr key={o.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                        <td className="py-4 px-2 font-mono text-amber-500">{o.id}</td>
                        <td className="py-4 px-2">{o.userName}</td>
                        <td className="py-4 px-2 font-bold">৳{o.grandTotal?.toLocaleString() || '---'}</td>
                        <td className="py-4 px-2">
                           <span className="bg-slate-700 text-[10px] px-2 py-1 rounded-full uppercase font-black">{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'orders' && (
          <AdminOrders orders={orders} setOrders={setOrders} products={products} />
        )}

        {activeMenu === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black">Product Management</h2>
              <button 
                onClick={() => {
                  const name = prompt('Watch Name?');
                  if (name) {
                    const newProd: WatchProduct = {
                      id: 'p' + Math.random().toString(36).substr(2, 5),
                      name,
                      brand: prompt('Brand?') || 'Unknown',
                      category: (prompt('Category? Formal, Luxury, Smart, Sports, Kids, Stylish') as any) || Category.Formal,
                      description: prompt('Details?') || '',
                      price: Number(prompt('Price?')) || 0,
                      stock: Number(prompt('Stock?')) || 0,
                      colors: prompt('Colors? (comma separated)')?.split(',').map(s => s.trim()) || ['Default'],
                      ageGroup: prompt('Age Group?') || 'Adult',
                      imageUrl: prompt('Image URL?') || 'https://picsum.photos/400/400'
                    };
                    setProducts([...products, newProd]);
                  }
                }}
                className="bg-amber-600 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-amber-700 shadow-xl shadow-amber-950"
              >
                {ICONS.Plus} ADD NEW PRODUCT
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-4 flex gap-4 group">
                  <img src={p.imageUrl} className="w-24 h-24 object-cover rounded-xl" alt={p.name} />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-200">{p.name}</h4>
                    <p className="text-xs text-slate-500">{p.category} • {p.brand}</p>
                    <p className="text-amber-500 font-black mt-2">৳{p.price.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Stock: {p.stock}</p>
                  </div>
                  <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="text-red-500 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-950/30 rounded-lg">
                    {ICONS.Cancel}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'users' && (
          <div className="space-y-6">
             <h2 className="text-3xl font-black">Customer Directory</h2>
             <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900/50 text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-700">
                      <th className="p-6">Name</th>
                      <th className="p-6">Contact</th>
                      <th className="p-6">Address</th>
                      <th className="p-6">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                        <td className="p-6">
                          <p className="font-bold text-slate-200">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.id}</p>
                        </td>
                        <td className="p-6">
                           <p className="text-sm">{u.email}</p>
                           <p className="text-xs text-slate-500">{u.phone}</p>
                        </td>
                        <td className="p-6 text-sm max-w-xs">{u.address}</td>
                        <td className="p-6">
                          <span className="bg-slate-700 px-3 py-1 rounded-full font-bold text-amber-500 text-xs">
                            {orders.filter(o => o.userId === u.id).length} Orders
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeMenu === 'offers' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black">Flash Sale & Offers</h2>
              <button 
                onClick={() => {
                   const title = prompt('Offer Title?');
                   if (title) {
                     const newOffer: Offer = {
                        id: 'off' + Date.now(),
                        title,
                        description: prompt('Description?') || '',
                        imageUrl: prompt('Image Poster URL?') || 'https://picsum.photos/1200/400'
                     };
                     setOffers([...offers, newOffer]);
                   }
                }}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-emerald-700 shadow-xl shadow-emerald-950"
              >
                {ICONS.Plus} CREATE NEW POSTER
              </button>
            </div>
            <div className="space-y-4">
               {offers.map(off => (
                  <div key={off.id} className="relative group bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden h-48">
                    <img src={off.imageUrl} className="w-full h-full object-cover opacity-50 transition group-hover:opacity-70" alt={off.title} />
                    <div className="absolute inset-0 p-8 flex flex-col justify-center">
                       <h4 className="text-2xl font-black text-white">{off.title}</h4>
                       <p className="text-slate-300 max-w-md mt-2">{off.description}</p>
                    </div>
                    <button 
                      onClick={() => setOffers(offers.filter(x => x.id !== off.id))}
                      className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      {ICONS.Cancel}
                    </button>
                  </div>
               ))}
            </div>
          </div>
        )}

        {activeMenu === 'chats' && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 h-[600px] overflow-hidden flex shadow-2xl">
             <div className="w-64 border-r border-slate-700 flex flex-col bg-slate-900/30">
                <div className="p-4 border-b border-slate-700 font-bold text-slate-500 uppercase tracking-widest text-xs">Conversations</div>
                <div className="flex-1 overflow-y-auto">
                   {users.map(u => (
                      <button key={u.id} className="w-full text-left p-4 hover:bg-slate-700/50 border-b border-slate-700/50 transition">
                         <p className="font-bold text-slate-200">{u.name}</p>
                         <p className="text-xs text-slate-500 truncate">Tap to respond</p>
                      </button>
                   ))}
                </div>
             </div>
             <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-700 font-bold">Main Support Hub</div>
                <ChatBox 
                  senderId="admin" 
                  receiverId="any" // Simple implementation: show all for now
                  messages={messages} 
                  setMessages={setMessages} 
                />
             </div>
          </div>
        )}

        {activeMenu === 'settings' && (
          <div className="max-w-2xl space-y-8">
            <h2 className="text-3xl font-black">System Configuration</h2>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 space-y-6">
               <div>
                  <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Merchant Bkash Number</label>
                  <input 
                    type="text" value={bkash} 
                    onChange={(e) => setBkash(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-amber-500 font-black text-xl"
                  />
               </div>
               <div>
                  <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Merchant Nagad Number</label>
                  <input 
                    type="text" value={nagad} 
                    onChange={(e) => setNagad(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-amber-500 font-black text-xl"
                  />
               </div>
               <p className="text-xs text-slate-500">* These numbers are shown to customers choosing mobile payment channels.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;
