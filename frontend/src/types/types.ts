// src/types.ts
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    quantity: number;
    category: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Order {
    _id: string;
    items: {
        productId: Product;
        quantity: number;
    }[];
    user: User;
    status: string;
    totalAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
}
