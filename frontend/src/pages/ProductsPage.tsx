import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../constants/urls';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<Product[]>(`${BASE_URL}/api/products/products`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Products</h1>
        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton height={192} />
                <div className="p-4">
                  <Skeleton height={24} width="80%" />
                  <Skeleton height={24} width="40%" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <NoResultsMessage>No products found.</NoResultsMessage>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <motion.div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h2 className="text-gray-800 text-lg font-semibold">{product.name}</h2>
                        <p className="text-gray-600">${product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
`;

const NoResultsMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #6c757d;
  margin-top: 20px;
`;
