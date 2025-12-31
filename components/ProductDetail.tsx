
import React, { useState } from 'react';
import { WatchProduct } from '../types';
import { ICONS } from '../constants';

interface ProductDetailProps {
  product: WatchProduct;
  onClose: () => void;
  onAddToCart: (id: string, color: string, qty: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm"
        >
          {ICONS.Cancel}
        </button>

        <div className="md:w-1/2 h-80 md:h-auto relative overflow-hidden group">
          <img src={product.imageUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={product.name} />
          <div className="absolute bottom-4 left-4 flex gap-2">
            {product.colors.map(c => (
              <div key={c} className={`px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold border ${selectedColor === c ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500'}`}>
                {c}
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 p-8 overflow-y-auto hide-scrollbar flex flex-col">
          <div className="mb-2 flex items-center gap-2 text-amber-600 font-bold uppercase tracking-widest text-xs">
            <span className="bg-amber-100 px-2 py-0.5 rounded">{product.category}</span>
            <span>•</span>
            <span>{product.brand}</span>
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">{product.name}</h2>
          <p className="text-2xl font-bold text-amber-600 mb-6">৳{product.price.toLocaleString()}</p>
          
          <div className="space-y-6 flex-1">
            <div>
              <h4 className="font-bold text-gray-700 mb-2">Description</h4>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">{product.description}</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-700 mb-3">Select Color</h4>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl border-2 font-bold transition ${selectedColor === color ? 'border-amber-600 bg-amber-50 text-amber-600' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-3">Quantity</h4>
                <div className="flex items-center border-2 border-gray-100 rounded-xl bg-gray-50">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-2 hover:bg-gray-200 transition text-gray-600"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-black text-lg min-w-[3rem] text-center">{qty}</span>
                  <button 
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-4 py-2 hover:bg-gray-200 transition text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="pt-8">
                <span className="text-xs font-bold text-gray-400 uppercase">Stock: {product.stock} units</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => onAddToCart(product.id, selectedColor, qty)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-amber-200 transition transform active:scale-95 flex items-center justify-center gap-3"
            >
              {ICONS.Plus} Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
