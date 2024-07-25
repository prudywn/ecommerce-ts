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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    const validateForm = () => {
        let newErrors: { [key: string]: string } = {};

        if (!newUser.name) newErrors.name = 'Name is required';
        if (!newUser.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
            newErrors.email = 'Email format is invalid';
        } else if (users.some((user) => user.email === newUser.email)) {
            newErrors.email = 'Email already exists';
        }
        if (!newUser.password) newErrors.password = 'Password is required';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleCreateUser = async () => {
        if (!validateForm()) return;

        try {
            const response = await axios.post(`${BASE_URL}/api/users/users`, newUser);
            setUsers([...users, response.data]);
            setNewUser({
                name: '',
                email: '',
                password: '',
                role: 'user',
            });
            setErrors({});
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
        <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <div className="mb-4 space-y-2">
                <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full p-2 text-black border border-gray-300 rounded"
                />
                {errors.name && <p className="text-red-600">{errors.name}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full p-2 text-black border border-gray-300 rounded"
                />
                {errors.email && <p className="text-red-600">{errors.email}</p>}
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full p-2 text-black border border-gray-300 rounded"
                />
                {errors.password && <p className="text-red-600">{errors.password}</p>}
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
