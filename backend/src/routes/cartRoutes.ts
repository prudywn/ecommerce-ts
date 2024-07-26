import { Router } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Products';
import recordUserActivity from '../middlewares/recordUserActivities';

const router = Router();

// Get cart
router.get('/cart', async (req, res) => {
    try {
        const cart = await Cart.findOne();
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add item to cart
router.post('/cart', recordUserActivity('added_to_cart') ,async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne();
        if (!cart) {
            cart = new Cart({ items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        const updatedCart = await cart.save();
        res.status(201).json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Remove item from cart
router.delete('/cart/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        let cart = await Cart.findOne();
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
