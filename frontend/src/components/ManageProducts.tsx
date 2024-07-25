import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Product } from '../types/types';
import { BASE_URL } from '../constants/urls';

const ManageProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<Omit<Product, '_id'>>({
        name: '',
        price: 0,
        description: '',
        imageUrl: '',
        quantity: 0,
        category: '',
    });
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // For form errors
    const formRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/products/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const validateProduct = (product: Omit<Product, '_id'>) => {
        const errors: { [key: string]: string } = {};
        if (!product.name.trim()) errors.name = 'Name is required';
        if (product.price <= 0) errors.price = 'Price must be greater than 0';
        if (product.quantity < 0) errors.quantity = 'Quantity cannot be negative';
        if (!product.category.trim()) errors.category = 'Category is required';
        if (!product.imageUrl.trim()) errors.imageUrl = 'Image URL is required';
        if (!product.description.trim()) errors.description = 'Description is required';

        // Add more validations as needed
        return errors;
    };

    const handleCreateProduct = async () => {
        const validationErrors = validateProduct(newProduct);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/api/products/products`, newProduct);
            setProducts([...products, response.data]);
            setNewProduct({
                name: '',
                price: 0,
                description: '',
                imageUrl: '',
                quantity: 0,
                category: '',
            });
            setErrors({});
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleUpdateProduct = async () => {
        if (editProduct) {
            const validationErrors = validateProduct(editProduct);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            try {
                const response = await axios.patch(`${BASE_URL}/api/products/products/${editProduct._id}`, editProduct);
                setProducts(products.map((product) =>
                    product._id === editProduct._id ? response.data : product
                ));
                setEditProduct(null);
                setErrors({});
            } catch (error) {
                console.error('Error updating product:', error);
            }
        }
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            await axios.delete(`${BASE_URL}/api/products/products/${id}`);
            setProducts(products.filter((product) => product._id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditProduct(product);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
            <div ref={formRef} className="mb-4 space-y-2">
                {editProduct ? (
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Name"
                            value={editProduct.name}
                            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                        <input
                            type="number"
                            placeholder="Price"
                            value={editProduct.price}
                            onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.price && <p className="text-red-500">{errors.price}</p>}
                        <input
                            type="text"
                            placeholder="Description"
                            value={editProduct.description}
                            onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.description && <p className="text-red-500">{errors.description}</p>}
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={editProduct.imageUrl}
                            onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.imageUrl && <p className="text-red-500">{errors.imageUrl}</p>}
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={editProduct.quantity}
                            onChange={(e) => setEditProduct({ ...editProduct, quantity: parseInt(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
                        <input
                            type="text"
                            placeholder="Category"
                            value={editProduct.category}
                            onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.category && <p className="text-red-500">{errors.category}</p>}
                        <button
                            onClick={handleUpdateProduct}
                            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Update Product
                        </button>
                        <button
                            onClick={() => setEditProduct(null)}
                            className="w-full p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                        <input
                            type="number"
                            placeholder="Price"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.price && <p className="text-red-500">{errors.price}</p>}
                        <input
                            type="text"
                            placeholder="Description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.description && <p className="text-red-500">{errors.description}</p>}
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={newProduct.imageUrl}
                            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.imageUrl && <p className="text-red-500">{errors.imageUrl}</p>}
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={newProduct.quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
                        <input
                            type="text"
                            placeholder="Category"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.category && <p className="text-red-500">{errors.category}</p>}
                        <button
                            onClick={handleCreateProduct}
                            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Create Product
                        </button>
                    </div>
                )}
            </div>
            <ul className="space-y-2">
                {products.map((product) => (
                    <li key={product._id} className="p-4 border border-gray-300 rounded flex justify-between">
                        <span>{product.name} - ${product.price.toFixed(2)}</span>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleEditProduct(product)}
                                className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageProducts;
