import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Products';
import User from '../models/User';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

interface AuthRequest extends Request {
  user?: { id: string };
}

router.post('/:productId', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  try {
    // Validate request data
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    if (typeof comment !== 'string' || comment.trim() === '') {
      return res.status(400).json({ message: 'Comment cannot be empty.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newReview = {
      user: user._id as mongoose.Types.ObjectId,
      rating: rating ,
      comment: comment ,
      createdAt: new Date(),
    };

    product.reviews.push(newReview);
    await product.save();

    res.status(201).json({ message: 'Review added successfully', product });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
