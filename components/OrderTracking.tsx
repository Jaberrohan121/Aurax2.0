
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types.ts';
import { ICONS } from '../constants.tsx';
import { Star } from 'lucide-react';

interface OrderTrackingProps {
  order: Order;
  bkash: string;
  nagad: string;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setAnimation: (show: boolean) => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order, bkash, nagad, setOrders, setAnimation }) => {
  const updateStatus = (newStatus: OrderStatus, extra: Partial<Order> = {}) => {
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus, ...extra } : o));
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Order #{order.id}</h3>
        <span className="text-xs font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{order.status}</span>
      </div>
      <div className="space-y-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 items-center">
            <img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1"><p className="font-bold text-sm">{item.productName}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
