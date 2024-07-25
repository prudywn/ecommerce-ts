// src/components/AdminDashboard.tsx
import React from 'react';
import { Route, Routes, NavLink } from 'react-router-dom';
import ManageProducts from './ManageProducts';
import ManageOrders from './ManageOrders';
import ManageUsers from './ManageUsers';

const AdminDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 p-4">
                <ul className="flex space-x-4 text-white">
                    <li>
                        <NavLink to="/admin/products" className="hover:text-gray-300">Manage Products</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/orders" className="hover:text-gray-300">Manage Orders</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/users" className="hover:text-gray-300">Manage Users</NavLink>
                    </li>
                </ul>
            </nav>
            <div className="p-4">
                <Routes>
                    <Route path="/products" element={<ManageProducts />} />
                    <Route path="/orders" element={<ManageOrders />} />
                    <Route path="/users" element={<ManageUsers />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
