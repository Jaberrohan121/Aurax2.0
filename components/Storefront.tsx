
import React, { useState, useMemo } from 'react';
import { User, WatchProduct, Category, Order, OrderStatus, CartItem, Offer, ChatMessage } from '../types';
import { ICONS } from '../constants';
import ProductDetail from './ProductDetail';
import OrderTracking from './OrderTracking';
import ChatBox from './ChatBox';

interface StorefrontProps {
  user: User;
  products: WatchProduct[];
  orders: Order[];
  offers: Offer[];
  messages: ChatMessage[];
  bkash: string;
  nagad: string;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onLogout: () => void;
}

const Storefront: React.FC<StorefrontProps> = ({ 
  user, products, orders, offers, messages, bkash, nagad, setOrders, setMessages, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'orders' | 'help'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedProduct, setSelectedProduct] = useState<WatchProduct | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingAnimation, setShippingAnimation] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const addToCart = (productId: string, color: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId && i.color === color);
      if (existing) {
        return prev.map(i => i.productId === productId && i.color === color ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { productId, color, quantity }];
    });
    setSelectedProduct(null);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handlePlaceOrder = (payment: string, delivery: string) => {
    const orderItems = cart.map(ci => {
      const p = products.find(x => x.id === ci.productId)!;
      return {
        ...ci,
        productName: p.name,
        unitPrice: p.price,
        imageUrl: p.imageUrl
      };
    });

    const newOrder: Order = {
      id: 'ORD' + Math.floor(1000 + Math.random() * 9000),
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      userAddress: user.address,
      items: orderItems,
      status: OrderStatus.AwaitingAdminCost,
      paymentMethod: payment as any,
      deliveryMethod: delivery as any,
      placedAt: Date.now()
    };

    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-2xl">
            {ICONS.Watch}
            <span className="hidden sm:inline">AURAX</span>
          </div>
          
          <div className="flex-1 max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Search in Aurax Watch Shop..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              {ICONS.Search}
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <button onClick={() => setActiveTab('cart')} className="relative p-2 hover:bg-gray-100 rounded-full">
              {ICONS.Cart}
              {cart.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
            </button>
            <button onClick={() => setActiveTab('orders')} className="p-2 hover:bg-gray-100 rounded-full">
              {ICONS.Package}
            </button>
            <button onClick={onLogout} className="p-2 hover:bg-gray-100 rounded-full text-red-500">
              {ICONS.LogOut}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 space-y-4 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4 overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Categories</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === 'All' ? 'bg-amber-100 text-amber-700 font-bold' : 'hover:bg-gray-50'}`}
              >
                All Collections
              </button>
              {Object.values(Category).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === cat ? 'bg-amber-100 text-amber-700 font-bold' : 'hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Account</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                {ICONS.User}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('help')}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl shadow-sm font-bold transition ${activeTab === 'help' ? 'bg-amber-600 text-white' : 'bg-white text-gray-700'}`}
          >
            {ICONS.Chat} Support Chat
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-6">
          {activeTab === 'home' && (
            <>
              {/* Offers Banner */}
              <div className="overflow-x-auto hide-scrollbar flex gap-4 pb-2">
                {offers.map(offer => (
                  <div key={offer.id} className="min-w-[300px] md:min-w-[600px] h-48 md:h-64 rounded-2xl overflow-hidden relative shadow-lg group">
                    <img src={offer.imageUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt={offer.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                      <h4 className="text-xl md:text-2xl font-black mb-1">{offer.title}</h4>
                      <p className="text-sm md:text-base opacity-90">{offer.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <div 
                    key={p.id} 
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-amber-200 overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedProduct(p)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img src={p.imageUrl} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt={p.name} />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-amber-700 shadow-sm uppercase tracking-wide">
                        {p.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm font-medium text-gray-400 mb-1">{p.brand}</p>
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{p.name}</h3>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-black text-amber-600">৳{p.price.toLocaleString()}</span>
                        <div className="text-amber-500">
                          {ICONS.ArrowRight}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
                  <div className="flex justify-center mb-4 opacity-50">{ICONS.Watch}</div>
                  <p className="text-lg">No products found matching your search.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'cart' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                {ICONS.Cart} Shopping Cart
              </h2>
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg mb-6">Your cart is empty.</p>
                  <button onClick={() => setActiveTab('home')} className="bg-amber-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-700 transition shadow-lg shadow-amber-200">
                    Go Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="divide-y">
                    {cart.map((item, idx) => {
                      const p = products.find(x => x.id === item.productId)!;
                      return (
                        <div key={idx} className="py-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                          <img src={p.imageUrl} className="w-24 h-24 rounded-xl object-cover shadow-sm" alt={p.name} />
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{p.name}</h4>
                            <p className="text-gray-500 text-sm">Color: {item.color} | Qty: {item.quantity}</p>
                            <p className="text-amber-600 font-bold mt-1">৳{(p.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                            {ICONS.Cancel}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-200">
                    <h3 className="font-bold text-xl mb-6">Checkout Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
                          <select id="paymentMethod" className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none">
                            <option value="Cash on Delivery">Cash on Delivery</option>
                            <option value="Bkash">Bkash</option>
                            <option value="Nagad">Nagad</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Method</label>
                          <select id="deliveryMethod" className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none">
                            <option value="Standard">Standard Delivery</option>
                            <option value="Premium">Premium Express</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end">
                        <p className="text-sm text-gray-500 mb-4">* Initial price only. Admin will calculate final total including VAT and Delivery.</p>
                        <button 
                          onClick={() => {
                            const pay = (document.getElementById('paymentMethod') as HTMLSelectElement).value;
                            const del = (document.getElementById('deliveryMethod') as HTMLSelectElement).value;
                            handlePlaceOrder(pay, del);
                          }}
                          className="w-full bg-amber-600 text-white py-4 rounded-xl font-black text-lg hover:bg-amber-700 transition shadow-xl shadow-amber-200"
                        >
                          Place Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                {ICONS.Package} My Orders
              </h2>
              {orders.filter(o => o.userId === user.id).length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm">
                  No orders yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.filter(o => o.userId === user.id).reverse().map(order => (
                    <OrderTracking 
                      key={order.id} 
                      order={order} 
                      bkash={bkash} 
                      nagad={nagad} 
                      setOrders={setOrders} 
                      setAnimation={setShippingAnimation} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'help' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-[600px] flex flex-col">
              <div className="bg-amber-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    {ICONS.Chat}
                  </div>
                  <div>
                    <h3 className="font-bold">Aurax Support</h3>
                    <p className="text-xs opacity-80">We're here to help you</p>
                  </div>
                </div>
                <div className="text-sm font-medium">Call: 01XXX-XXXXXX</div>
              </div>
              <ChatBox 
                senderId={user.id} 
                receiverId="admin" 
                messages={messages} 
                setMessages={setMessages} 
              />
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart} 
        />
      )}

      {/* Shipping Animation Overlay */}
      {shippingAnimation && (
        <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="relative">
            <div className="text-amber-600 animate-bounce duration-700 mb-8 scale-[3]">
              {ICONS.Delivery}
            </div>
          </div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tighter mb-2">SHIPPING YOUR LUXURY</h2>
          <p className="text-gray-500 font-medium animate-pulse">Your watch is on its way to your destination...</p>
        </div>
      )}
    </div>
  );
};

export default Storefront;
