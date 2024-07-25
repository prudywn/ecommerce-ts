// src/components/ProductCard.tsx

import React from 'react';
import { Product } from '../types/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover mb-4" />
      <h3 className="text-lg font-bold">{product.name}</h3>
      <p className="text-gray-700">${product.price.toFixed(2)}</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
