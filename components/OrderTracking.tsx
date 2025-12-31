
import React from 'react';
import { Order, OrderStatus } from '../types';
import { ICONS } from '../constants';

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
    
    if (newStatus === OrderStatus.Shipped) {
      setAnimation(true);
      setTimeout(() => setAnimation(false), 5000);
    }
  };

  const isPaidViaChannel = order.paymentMethod === 'Bkash' || order.paymentMethod === 'Nagad';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Order ID</span>
          <h3 className="text-lg font-bold text-gray-800">{order.id}</h3>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide flex items-center gap-2 ${
          order.status === OrderStatus.Delivered ? 'bg-green-100 text-green-700' :
          order.status === OrderStatus.Cancelled ? 'bg-red-100 text-red-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {order.status === OrderStatus.AwaitingAdminCost && ICONS.Pending}
          {order.status === OrderStatus.Delivered && ICONS.Check}
          {order.status.replace(/([A-Z])/g, ' $1').trim()}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4 mb-6">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt={item.productName} />
              <div className="flex-1">
                <p className="font-bold text-gray-800">{item.productName}</p>
                <p className="text-xs text-gray-500">{item.color} x {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">৳{(item.unitPrice * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Phase 1: Wait for Admin Cost */}
        {order.status === OrderStatus.AwaitingAdminCost && (
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-center">
            <p className="text-amber-800 font-bold mb-1">Processing Order Details</p>
            <p className="text-sm text-amber-600">Admin is currently reviewing your order to calculate VAT and delivery charges. Please wait.</p>
          </div>
        )}

        {/* Phase 2: User Approval of Costs */}
        {order.status === OrderStatus.AwaitingUserApproval && (
          <div className="bg-white p-6 rounded-xl border-2 border-amber-500 shadow-xl shadow-amber-50 animate-pulse-once">
            <h4 className="font-black text-lg mb-4 text-amber-800">Review Final Cost</h4>
            <div className="space-y-2 mb-6 border-b pb-4">
              <div className="flex justify-between text-sm"><span>Subtotal:</span><span className="font-bold">৳{order.baseTotal?.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span>VAT (included):</span><span className="font-bold">৳{order.vat?.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span>Delivery ({order.deliveryMethod}):</span><span className="font-bold">৳{order.deliveryCharge?.toLocaleString()}</span></div>
              <div className="flex justify-between text-xl font-black text-amber-600 pt-2 border-t"><span>GRAND TOTAL:</span><span>৳{order.grandTotal?.toLocaleString()}</span></div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => updateStatus(isPaidViaChannel ? OrderStatus.AwaitingPayment : OrderStatus.ReadyToShip)}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
              >
                Approve & Proceed
              </button>
              <button 
                onClick={() => updateStatus(OrderStatus.Cancelled)}
                className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Cancel Order
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: Payment via Channel */}
        {order.status === OrderStatus.AwaitingPayment && (
          <div className="bg-white p-6 rounded-xl border-2 border-blue-500">
            <h4 className="font-black text-lg mb-4 text-blue-800">Secure Payment Required</h4>
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-blue-800 mb-2">Please send <strong>৳{order.grandTotal?.toLocaleString()}</strong> to the following number:</p>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                <span className="font-black text-xl text-blue-600">{order.paymentMethod === 'Bkash' ? bkash : nagad}</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-bold uppercase">{order.paymentMethod}</span>
              </div>
            </div>
            <button 
              onClick={() => updateStatus(OrderStatus.PaymentConfirmPending, { paymentProof: true })}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              I have sent the money
            </button>
          </div>
        )}

        {/* Final Phases */}
        {order.status === OrderStatus.PaymentConfirmPending && (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4 text-amber-500 animate-spin">{ICONS.Pending}</div>
            <p className="font-bold text-gray-800">Verifying Payment</p>
            <p className="text-sm text-gray-500">Admin is checking the transaction. Once confirmed, your order will be shipped.</p>
          </div>
        )}

        {order.status === OrderStatus.ReadyToShip && (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4 text-green-500">{ICONS.Check}</div>
            <p className="font-bold text-gray-800">Confirmed & Ready</p>
            <p className="text-sm text-gray-500">Your order is ready for dispatch. We will ship it shortly.</p>
          </div>
        )}

        {order.status === OrderStatus.Shipped && (
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-center">
            <div className="flex justify-center mb-4 text-amber-600 scale-[2]">{ICONS.Delivery}</div>
            <p className="font-black text-lg text-amber-800 mb-4">Your watch has been shipped!</p>
            <button 
              onClick={() => updateStatus(OrderStatus.Delivered)}
              className="w-full bg-amber-600 text-white font-black py-4 rounded-xl hover:bg-amber-700 transition shadow-lg shadow-amber-100"
            >
              Confirm Received
            </button>
          </div>
        )}

        {order.status === OrderStatus.Delivered && (
          <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
            <div className="flex justify-center mb-2 text-green-600">{ICONS.Check}</div>
            <p className="font-black text-green-800 text-lg">Delivered & Received</p>
            <p className="text-sm text-green-600">Thank you for choosing Aurax Watch Shop!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
