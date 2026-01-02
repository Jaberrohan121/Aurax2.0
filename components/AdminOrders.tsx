
import React, { useState } from 'react';
import { Order, OrderStatus, WatchProduct } from '../types.ts';
import { ICONS } from '../constants.tsx';

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
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.AwaitingUserApproval, grandTotal, deliveryCharge: costForm.delivery } : o));
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="space-y-6">
      {orders.map(order => (
        <div key={order.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-bold text-amber-500">#{order.id}</h3>
            <span className="text-xs font-bold uppercase bg-slate-700 px-3 py-1 rounded">{order.status}</span>
          </div>
          {order.status === OrderStatus.AwaitingAdminCost && (
             <button onClick={() => handleSendCost(order.id)} className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold">Process Cost</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
