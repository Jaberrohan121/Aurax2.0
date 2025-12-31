
import React, { useState } from 'react';
import { Order, OrderStatus, WatchProduct } from '../types';
import { ICONS } from '../constants';

interface AdminOrdersProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: WatchProduct[];
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, setOrders, products }) => {
  const [costForm, setCostForm] = useState({ vat: 0, delivery: 0, note: '' });

  const handleSendCost = (orderId: string) => {
    const order = orders.find(o => o.id === orderId)!;
    const baseTotal = order.items.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
    const grandTotal = baseTotal + costForm.delivery;
    
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: OrderStatus.AwaitingUserApproval,
      baseTotal,
      vat: costForm.vat,
      deliveryCharge: costForm.delivery,
      grandTotal,
      adminNote: costForm.note
    } : o));
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black">Live Order Stream</h2>
      
      <div className="space-y-4">
        {orders.slice().reverse().map(order => {
          const isDelivered = order.status === OrderStatus.Delivered;
          
          if (isDelivered) {
            // Compact view for delivered orders
            return (
              <div key={order.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="bg-emerald-950/30 text-emerald-400 p-2 rounded-lg">{ICONS.Check}</span>
                  <div>
                    <h3 className="text-sm font-bold text-amber-500 leading-none">{order.id}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">{order.userName} • ৳{order.grandTotal?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-900/50 px-2 py-1 rounded">DELIVERED</div>
              </div>
            );
          }

          return (
            <div key={order.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
              <div className="p-6 bg-slate-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Order ID</span>
                  <h3 className="text-lg font-bold text-amber-500">{order.id}</h3>
                  <p className="text-xs text-slate-400">{new Date(order.placedAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      order.status === OrderStatus.Delivered ? 'bg-emerald-950/30 text-emerald-400' : 'bg-amber-950/30 text-amber-500'
                   }`}>
                      {order.status}
                   </span>
                   <span className="text-xs bg-slate-700 px-2 py-1 rounded font-bold text-slate-300">
                      {order.paymentMethod} • {order.deliveryMethod}
                   </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-slate-900/30 p-4 rounded-xl">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Line Items</h4>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1 border-b border-slate-700/50 last:border-0">
                        <span>{it.productName} ({it.color}) x {it.quantity}</span>
                        <span className="font-bold">৳{(it.unitPrice * it.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    {order.grandTotal && (
                      <div className="mt-3 pt-3 border-t border-slate-600 flex justify-between font-black text-amber-500">
                         <span>TOTAL PAYABLE</span>
                         <span>৳{order.grandTotal.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/30 p-4 rounded-xl">
                      <p className="text-sm font-bold">{order.userName}</p>
                      <p className="text-xs text-slate-400">{order.userPhone}</p>
                    </div>
                    <div className="bg-slate-900/30 p-4 rounded-xl">
                      <p className="text-xs text-slate-300 leading-tight">{order.userAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  {order.status === OrderStatus.AwaitingAdminCost && (
                    <div className="bg-slate-700/30 p-6 rounded-2xl border border-slate-600">
                      <h4 className="font-black mb-4 flex items-center gap-2">{ICONS.Plus} ASSIGN COSTS</h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-black uppercase mb-1">VAT Amount</label>
                          <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm" placeholder="0" onChange={e => setCostForm({...costForm, vat: Number(e.target.value)})} />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-black uppercase mb-1">Delivery Charge</label>
                          <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm" placeholder="Standard is ~100" onChange={e => setCostForm({...costForm, delivery: Number(e.target.value)})} />
                        </div>
                      </div>
                      <button onClick={() => handleSendCost(order.id)} className="w-full bg-amber-600 text-white font-black py-3 rounded-xl hover:bg-amber-700 transition">SEND COST TO CUSTOMER</button>
                    </div>
                  )}

                  {order.status === OrderStatus.PaymentConfirmPending && (
                    <div className="bg-blue-900/20 p-6 rounded-2xl border border-blue-800">
                      <div className="flex items-center gap-2 text-blue-400 font-black mb-2 animate-pulse">{ICONS.Payment} PAYMENT CLAIMED</div>
                      <button onClick={() => updateStatus(order.id, OrderStatus.ReadyToShip)} className="w-full bg-emerald-600 text-white font-black py-3 rounded-xl hover:bg-emerald-700 transition">PAYMENT RECEIVED - PREPARE SHIPMENT</button>
                    </div>
                  )}

                  {order.status === OrderStatus.ReadyToShip && (
                     <button onClick={() => updateStatus(order.id, OrderStatus.Shipped)} className="w-full bg-sky-600 text-white font-black py-6 rounded-2xl hover:bg-sky-700 transition flex flex-col items-center gap-2">
                      <span className="scale-[1.5]">{ICONS.Delivery}</span>
                      MARK AS SHIPPED
                    </button>
                  )}

                  {order.status === OrderStatus.Shipped && (
                    <div className="bg-slate-900/50 p-6 rounded-xl text-center">
                      <p className="text-slate-400 font-medium">In Transit...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;
