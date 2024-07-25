// src/components/ManageUsers.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types/types';
import { BASE_URL } from '../constants/urls';

const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<Omit<User, '_id'>>({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/users/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleCreateUser = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/users/users`, newUser);
            setUsers([...users, response.data]);
            setNewUser({
                name: '',
                email: '',
                password: '',
                role: 'user',
            });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await axios.delete(`${BASE_URL}/api/users/users/${id}`);
            setUsers(users.filter((user) => user._id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <div className="mb-4 space-y-2">
                <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={handleCreateUser}
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create User
                </button>
            </div>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user._id} className="p-4 border border-gray-300 rounded flex justify-between">
                        <span>{user.name} - {user.email}</span>
                        <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageUsers;
