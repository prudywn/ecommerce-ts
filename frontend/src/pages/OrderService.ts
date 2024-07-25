import axios from 'axios';
import { BASE_URL } from '../constants/urls';

const getHeaders = (token: string | null) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getOrders = async (token: string | null) => {
  //console.log('Token in getOrders:', token); // Debug log
  const response = await axios.get(`${BASE_URL}/api/orders/orders`, getHeaders(token));
  return response.data;
};

export const createOrder = async (cartId: string, token: string | null) => {
  
  //console.log('Token in createOrder:', token); // Debug log
  const response = await axios.post(`${BASE_URL}/api/orders/orders`, { cartId }, getHeaders(token));
  return response.data;
};

export const deleteOrder = async (orderId: string, token: string | null) => {
  //console.log('Token in deleteOrder:', token); // Debug log
  const response = await axios.delete(`${BASE_URL}/api/orders/orders/${orderId}`, getHeaders(token));
  return response.data;
};

export const getOrderById = async (orderId: string, token: string | null) => {
  const response = await axios.get(`${BASE_URL}/api/orders/${orderId}`, getHeaders(token));
  return response.data;
};