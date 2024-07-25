import express, { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

interface AuthRequest extends Request {
    user?: { id: string; isAdmin: boolean };
}

// Place a new order
router.post('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { cartId } = req.body;
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const order = new Order({
      user: req.user.id,
      items: cart.items,
      status: 'Pending',
    });

    const newOrder = await order.save();
    console.log('New order created:', newOrder); // Debug log
    await Cart.findByIdAndDelete(cartId); // Clear the cart after placing an order
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all orders for the logged-in user or all orders if admin
router.get('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const query = req.user.isAdmin ? {} : { user: req.user.id };
    const orders = await Order.find(query).populate('items.productId', 'name price imageUrl'); // Ensure correct fields are populated
   // console.log('Fetched orders from DB:', orders); // Debug log
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update an order status (admin only)
router.put('/orders/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { status } = req.body;
    
     // Validate status
     const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
     if (!validStatuses.includes(status)) {
       return res.status(400).json({ message: 'Invalid status' });
     } 
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete an order
router.delete('/orders/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, user: req.user.id };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:ordersId',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const query = req.user.isAdmin ? { _id: req.params.ordersId } : { _id: req.params.ordersId, user: req.user.id };
        const order = await Order.findOne(query).populate('items.productId', 'name price imageUrl');
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
          }
          res.json(order);
          } catch (error) {
            res.status(500).json({ message: error.message });
            }
            }
            
 )

export default router;
