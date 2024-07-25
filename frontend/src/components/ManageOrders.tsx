// src/components/ManageOrders.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Order } from '../types/types';
import { BASE_URL } from '../constants/urls';
import { useAuth } from '../context/AuthContext';

const ManageOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const { token } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}/api/orders/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleUpdateOrderStatus = async (id: string, status: string) => {
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            console.log(`Updating order ${id} to status ${status}`);
            const response = await axios.put(`${BASE_URL}/api/orders/orders/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Order updated response:', response.data);
            setOrders(orders.map((order) => (order._id === id ? { ...order, status } : order)));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className=" p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
            <ul className="space-y-2">
                {orders.map((order) => (
                    <li key={order._id} className="p-4 border border-gray-300 rounded flex justify-between">
                        <span>
                            Order #{order._id} - {order.status} - ${order.totalAmount}
                        </span>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleUpdateOrderStatus(order._id, 'Processing')}
                                className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700"
                            >
                                Processing
                            </button>
                            <button
                                onClick={() => handleUpdateOrderStatus(order._id, 'Shipped')}
                                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                            >
                                Shipped
                            </button>
                            <button
                                onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                                className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                            >
                                Delivered
                            </button>
                            <button
                                onClick={() => handleUpdateOrderStatus(order._id, 'Cancelled')}
                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                            >
                                Cancelled
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageOrders;
