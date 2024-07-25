import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants/urls';
import { useAuth } from '../context/AuthContext';

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    quantity: number;
    reviews: Review[];
}

interface Review {
    _id: string;
    user: string;
    rating: number;
    comment: string;
    createdAt: string;
}

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth(); // Get the authentication token from context
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [quantityError, setQuantityError] = useState<string>('');
    const [reviewError, setReviewError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get<Product>(`${BASE_URL}/api/products/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!token) {
            alert('Please log in to add items to the cart.');
            return;
        }

        if (quantity < 1) {
            setQuantityError('Quantity must be at least 1.');
            return;
        } else {
            setQuantityError('');
        }

        try {
            await axios.post(`${BASE_URL}/api/cart/cart`, { productId: id, quantity }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Ensure token is used for authenticated requests
                }
            });
            alert('Product added to cart!');
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleAddReview = async () => {
        if (!token) {
            alert('Please log in to submit a review.');
            return;
        }

        if (rating < 1 || rating > 5) {
            setReviewError('Rating must be between 1 and 5.');
            return;
        } else if (comment.trim() === '') {
            setReviewError('Comment cannot be empty.');
            return;
        } else {
            setReviewError('');
        }

        try {
            await axios.post(`${BASE_URL}/api/reviews/${id}`, { rating, comment }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Ensure token is used for authenticated requests
                }
            });
            setRating(0);
            setComment('');
            alert('Review added!');
            const { data } = await axios.get<Product>(`${BASE_URL}/api/products/products/${id}`);
            setProduct(data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Handle specific error responses
                console.error('Error adding review:', error.response.data.message || error.message);
                alert('Failed to add review: ' + (error.response.data.message || error.message));
            } else {
                // Handle unexpected errors
                console.error('Unexpected error:', error);
                alert('An unexpected error occurred.');
            }
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover mb-4" />
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                    <p className="text-gray-800 mb-4">{product.description}</p>
                    <div className="mb-4">
                        <label htmlFor="quantity" className="block text-gray-700">Quantity:</label>
                        <input 
                            type="number" 
                            id="quantity" 
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="w-20 border rounded px-2 py-1"
                            min="1"
                        />
                        {quantityError && <p className="text-red-500 text-sm mt-2">{quantityError}</p>}
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add to Cart
                    </button>
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                        <div>
                            {product.reviews.map(review => (
                                <div key={review._id} className="border-b border-gray-300 mb-4 pb-4">
                                    <p className="text-gray-600"><strong>Rating:</strong> {review.rating}</p>
                                    <p className="text-gray-800"><strong>Comment:</strong> {review.comment}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4">Add a Review</h2>
                            <div className="mb-4">
                                <label htmlFor="rating" className="block text-gray-700">Rating:</label>
                                <input 
                                    type="number" 
                                    id="rating" 
                                    value={rating}
                                    onChange={(e) => setRating(parseInt(e.target.value))}
                                    className="w-20 border rounded px-2 py-1"
                                    min="1"
                                    max="5"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="comment" className="block text-gray-700">Comment:</label>
                                <textarea 
                                    id="comment" 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                    rows={4}
                                ></textarea>
                                {reviewError && <p className="text-red-500 text-sm mt-2">{reviewError}</p>}
                            </div>
                            <button 
                                onClick={handleAddReview}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
