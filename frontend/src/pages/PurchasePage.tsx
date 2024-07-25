import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrderById, deleteOrder } from './OrderService';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

const PurchasePage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const orderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        if (token && orderId) {
          const data = await getOrderById(orderId, token);
          setOrder(data);
        } else {
          setError('Invalid order ID or missing authentication token.');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to fetch order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  const handleConfirmPurchase = async () => {
    setActionLoading(true);
    try {
      alert('Purchase confirmed!');
      // Handle additional confirmation logic here
    } catch (error) {
      console.error('Error confirming purchase:', error);
      setError('Failed to confirm purchase. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setActionLoading(true);
    try {
      if (token && orderId) {
        await deleteOrder(orderId, token);
        alert('Order cancelled successfully.');
        navigate('/order'); // Redirect to orders page after cancellation
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    return order?.items.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0).toFixed(2);
  };

  if (!orderId) {
    return <p>No order selected. Please go back and select an order to confirm.</p>;
  }

  return (
    <PurchasePageContainer>
      <h1 className='flex items-center justify-center font-semibold text-4xl'>Purchase</h1>
      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
      {loading ? (
        <p>Loading order details...</p>
      ) : order ? (
        <OrderDetails>
          <h2 className='font-semibold text-2xl mb-4'>Order ID: {order._id}</h2>
          <p>Order Created At: {new Date(order.createdAt).toLocaleString()}</p>
          <p>Last Updated At: {new Date(order.updatedAt).toLocaleString()}</p>
          <div>
            {order.items.map((item, index) => (
              <ProductContainer key={index}>
                {item.productId ? (
                  <>
                    <ProductImage src={item.productId.imageUrl} alt={item.productId.name} />
                    <ProductDetails>
                      <p>Product: {item.productId.name}</p>
                      <p>Price: ${item.productId.price ? item.productId.price.toFixed(2) : 'N/A'}</p>
                      <p>Quantity: {item.quantity}</p>
                    </ProductDetails>
                  </>
                ) : (
                  <p>Product information unavailable</p>
                )}
              </ProductContainer>
            ))}
          </div>
          <p>Total Price: ${calculateTotalPrice()}</p>
          <p>Status: {order.status}</p>
          <ActionButton
            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mt-4'
            onClick={handleConfirmPurchase}
            disabled={actionLoading}
          >
            {actionLoading ? 'Processing...' : 'Confirm Purchase'}
          </ActionButton>
          <ActionButton
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 mt-4'
            onClick={handleCancelOrder}
            disabled={actionLoading}
          >
            {actionLoading ? 'Processing...' : 'Cancel Order'}
          </ActionButton>
        </OrderDetails>
      ) : (
        <p>Loading order details...</p>
      )}
    </PurchasePageContainer>
  );
};

export default PurchasePage;

const PurchasePageContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const OrderDetails = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
`;

const ProductContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 5px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
`;

const ActionButton = styled.button`
  margin-right: 10px;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
