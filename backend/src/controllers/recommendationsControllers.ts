import mongoose, { Document, Types } from 'mongoose';
import UserActivity from '../models/UserActivity';
import Product, { IProduct } from '../models/Products';

interface IUserActivity extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  action: 'viewed' | 'added_to_cart' | 'ordered';
  timestamp: Date;
}

const getRecommendations = async (userId: mongoose.Types.ObjectId): Promise<IProduct[]> => {
  console.log('Fetching activities for user:', userId);

  // Fetch user activity
  const activities: IUserActivity[] = await UserActivity.find({ userId }).populate('productId');
  console.log('User Activities:', activities);

  if (!activities || activities.length === 0) {
    console.log('No activities found for user:', userId);
    return [];
  }

  // Aggregate products based on user actions
  const productScores: Record<string, number> = activities.reduce((acc, activity) => {
    const { productId, action } = activity;
    if (!acc[productId.toString()]) acc[productId.toString()] = 0;
    if (action === 'viewed') acc[productId.toString()] += 1;
    if (action === 'added_to_cart') acc[productId.toString()] += 3;
    if (action === 'ordered') acc[productId.toString()] += 5;
    return acc;
  }, {});

  console.log('Product Scores:', productScores);
  
  // Sort products by scores
  const sortedProducts = Object.keys(productScores).sort((a, b) => productScores[b] - productScores[a]);
  console.log('Sorted Products:', sortedProducts);

  // Fetch detailed product information
  const recommendedProducts = await Product.find({ _id: { $in: sortedProducts.slice(0, 10) } });
  console.log('Recommended Products:', recommendedProducts);

  return recommendedProducts;
};


export { getRecommendations };
