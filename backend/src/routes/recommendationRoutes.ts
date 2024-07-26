import express, { Request, Response } from 'express';
import { getRecommendations } from '../controllers/recommendationsControllers';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

interface AuthRequest extends Request {
  user: any;
  userId?: string;
}

router.get('/recommendations', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('Fetching recommendations for user:', userId);
    const recommendations = await getRecommendations(userId);
    console.log('Recommendations fetched:', recommendations);
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

export default router;
