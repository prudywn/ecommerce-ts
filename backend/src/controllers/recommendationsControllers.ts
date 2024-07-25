import { Document, Types } from 'mongoose';
import UserActivity from '../models/UserActivity';
import Product, { IProduct } from '../models/Products';

interface IUserActivity extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  action: 'viewed' | 'added_to_cart' | 'purchased';
  timestamp: Date;
}

const getRecommendations = async (userId: Types.ObjectId): Promise<IProduct[]> => {
  // Fetch user activity
  const activities: IUserActivity[] = await UserActivity.find({ userId }).populate('productId');
  
  // Aggregate products based on user actions
  const productScores: Record<string, number> = activities.reduce((acc, activity) => {
    const { productId, action } = activity;
    if (!acc[productId.toString()]) acc[productId.toString()] = 0;
    if (action === 'viewed') acc[productId.toString()] += 1;
    if (action === 'added_to_cart') acc[productId.toString()] += 3;
    if (action === 'purchased') acc[productId.toString()] += 5;
    return acc;
  }, {});

  // Sort products by scores
  const sortedProducts = Object.keys(productScores).sort((a, b) => productScores[b] - productScores[a]);

  // Fetch detailed product information
  const recommendedProducts = await Product.find({ _id: { $in: sortedProducts.slice(0, 10) } });

  return recommendedProducts;
};

export { getRecommendations };
