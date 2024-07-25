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
    const recommendations = await getRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

export default router;
