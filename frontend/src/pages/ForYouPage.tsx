import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '../types/types';
import { BASE_URL } from '../constants/urls';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ForYouPage: React.FC = () => {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Log the token

      try {
        const { data } = await axios.get<Product[]>(`${BASE_URL}/api/recommendations/recommendations`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is fetched from local storage or state
          },
        });
        console.log('Recommendations:', data);
        setRecommendedProducts(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error); // Log error
        setError('Error fetching recommendations');
      }
    };

    if (token) {
      fetchRecommendations();
    } else {
      setError('Login to see recommendations');
    }
  }, [token]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
        {recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.0 }}
            className="text-center text-xl mt-10"
          >
            Nothing to see here
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ForYouPage;
