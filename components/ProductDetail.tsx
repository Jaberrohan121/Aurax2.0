
import React, { useState } from 'react';
import { WatchProduct } from '../types.ts';
import { ICONS } from '../constants.tsx';

interface ProductDetailProps {
  product: WatchProduct;
  onClose: () => void;
  onAddToCart: (id: string, color: string, qty: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <div className="md:w-1/2 aspect-square bg-gray-100">
          <img src={product.imageUrl} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="md:w-1/2 p-10 flex flex-col">
          <button onClick={onClose} className="self-end mb-4">{ICONS.Cancel}</button>
          <h2 className="text-3xl font-black mb-2">{product.name}</h2>
          <p className="text-2xl font-black text-amber-600 mb-6">৳{product.price.toLocaleString()}</p>
          <p className="text-gray-500 mb-8">{product.description}</p>
          <button onClick={() => onAddToCart(product.id, selectedColor, qty)} className="mt-auto bg-amber-600 text-white font-black py-4 rounded-2xl">ADD TO BAG</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
