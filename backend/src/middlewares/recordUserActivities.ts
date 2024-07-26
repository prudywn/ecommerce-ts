import { Request, Response, NextFunction } from 'express';
import UserActivity from '../models/UserActivity';

interface AuthRequest extends Request {
  user?: { id: string };
}

const recordUserActivity = (action: 'viewed' | 'added_to_cart' | 'ordered') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log(`Recording user activity: ${action} - User: ${req.user?.id}, Product: ${req.body.productId}`);

    if (!req.user || !req.body.productId) {
        console.log('User or Product ID missing');
       return next();
    }

    try {
      const activity = new UserActivity({
        userId: req.user.id,
        productId: req.body.productId,
        action,
        timestamp: new Date(),
      });
      await activity.save();
      console.log(`User activity recorded: ${action} - User: ${req.user.id}, Product: ${req.body.productId}`);
    } catch (error) {
      console.error('Error recording user activity:', error);
    }

    next();
  };
};

export default recordUserActivity;
