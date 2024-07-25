import React, { useEffect, useState } from 'react';
import { getOrders, createOrder, deleteOrder } from './OrderService';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string; // Added imageUrl property
  } | null;  // Allow productId to be null
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // State for errors
  const location = useLocation();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (token) {
          const data = await getOrders(token);
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      }
    };

    fetchOrders();

    if (location.state && location.state.cartId) {
      setCartId(location.state.cartId);
      handlePlaceOrder(location.state.cartId);
    }
  }, [location.state, token]);

  const handlePlaceOrder = async (cartId: string) => {
    try {
      if (token) {
        await createOrder(cartId, token);
        const data = await getOrders(token);
        setOrders(data);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again later.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      if (token) {
        await deleteOrder(orderId, token);
        const data = await getOrders(token);
        setOrders(data);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Failed to delete order. Please try again later.');
    }
  };

  const handleConfirmOrder = (orderId: string) => {
    navigate('/purchase', { state: { orderId } });
  };

  return (
    <OrderPageContainer>
      <h1 className='flex items-center justify-center font-semibold text-4xl'>Orders</h1>
      {cartId && <p className='text-center mt-4'>Order placed for cart: {cartId}</p>}
      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
      {orders.length === 0 && !error ? (
        <NoOrdersMessage>You have no orders yet.</NoOrdersMessage>
      ) : (
        <OrderTable>
          <thead>
            <tr>
              <th>ID</th>
              <th>Items</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.items.map(item => (
                    <div key={item.productId?._id} className='order-item'>
                      {item.productId ? (
                        <>
                          <ProductImage src={item.productId.imageUrl} alt={item.productId.name} />
                          <div>
                            <p>Product: {item.productId.name}</p>
                            <p>Price: ${item.productId.price.toFixed(2)}</p>
                            <p>Quantity: {item.quantity}</p>
                          </div>
                        </>
                      ) : (
                        <p>Product information unavailable</p>
                      )}
                    </div>
                  ))}
                </td>
                <td>{order.status}</td>
                <td>
                  <div className='flex space-x-4'>
                    <button
                      className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300'
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      Delete
                    </button>
                    {order.status === 'Shipped' && (
                      <button
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300'
                        onClick={() => handleConfirmOrder(order._id)}
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </OrderTable>
      )}
    </OrderPageContainer>
  );
};

export default OrderPage;

const OrderPageContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }

  .order-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    img {
      margin-right: 10px;
      max-width: 50px;
      height: auto;
      border-radius: 5px;
    }
  }
`;

const ProductImage = styled.img`
  margin-right: 10px;
  max-width: 50px;
  height: auto;
  border-radius: 5px;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
`;

const NoOrdersMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #6c757d;
  margin-top: 20px;
`;
