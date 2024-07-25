import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants/urls';

interface CartItem {
  productId: string;
  quantity: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface Cart {
  _id: string;
  items: CartItem[];
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get<Cart>(`${BASE_URL}/api/cart/cart`);
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('No items in cart. Please add something.');
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<Product[]>(`${BASE_URL}/api/products/products`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchCart(), fetchProducts()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/cart/${productId}`);
      setCart(cart => cart && { ...cart, items: cart.items.filter(item => item.productId !== productId) });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Failed to remove item. Please try again later.');
    }
  };

  const getProductById = (productId: string) => {
    return products.find(product => product._id === productId);
  };

  const handleOrder = () => {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      alert('You must be logged in to place an order.');
      navigate('/login');
      return;
    }
    navigate('/order', { state: { cartId: cart?._id } });
  };

  const handleAddToCart = async (productId: string, quantity: number) => {
    
    if (quantity <= 0) {
      alert('Quantity must be greater than zero.');
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/cart/cart`, { productId, quantity });
      setCart(cart => cart && { ...cart, items: [...cart.items, { productId, quantity }] });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError('Failed to add item to cart. Please try again later.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Shopping Cart</h1>
        {error && (
          <div className="bg-red-200 text-black p-4 rounded mb-6">
            {error}
          </div>
        )}
        <div className="space-y-6">
          {cart?.items.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">Your cart is empty.</p>
          ) : (
            <>
              {cart?.items.map(item => {
                const product = getProductById(item.productId);
                if (!product) return null;

                return (
                  <div key={item.productId} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover mr-4" />
                      <div>
                        <h2 className="text-lg font-semibold">{product.name}</h2>
                        <p className="text-gray-600">${product.price.toFixed(2)}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
              <div className="flex justify-end">
                <button 
                  onClick={handleOrder}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
