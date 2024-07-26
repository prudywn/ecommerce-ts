import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Products';
import recordUserActivity from '../middlewares/recordUserActivities';

const router = express.Router();

// Middleware to get product by ID
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    let product;
    try {
        product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.locals.product = product;
    next();
};

// Middleware for validation
const validateProduct = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('description').notEmpty().withMessage('Description is required'),
    body('imageUrl').isURL().withMessage('Invalid image URL'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
    body('category').notEmpty().withMessage('Category is required'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).formatWith(({ msg }) => msg);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Get all products
router.get('/products', async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new product
router.post('/products', validateProduct, async (req: Request, res: Response) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        quantity: req.body.quantity,
        category: req.body.category,
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single product
router.get('/products/:id', getProduct, recordUserActivity('viewed'), (req: Request, res: Response) => {
    res.json(res.locals.product);
});

// Update a product
router.patch('/products/:id', getProduct, validateProduct, async (req: Request, res: Response) => {
    if (req.body.name != null) {
        res.locals.product.name = req.body.name;
    }
    if (req.body.price != null) {
        res.locals.product.price = req.body.price;
    }
    if (req.body.description != null) {
        res.locals.product.description = req.body.description;
    }
    if (req.body.imageUrl != null) {
        res.locals.product.imageUrl = req.body.imageUrl;
    }
    if (req.body.quantity != null) { 
        res.locals.product.quantity = req.body.quantity;
    }
    if (req.body.category != null) {
        res.locals.product.category = req.body.category;
    }
    try {
        const updatedProduct = await res.locals.product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a product
router.delete('/products/:id', getProduct, async (req: Request, res: Response) => {
    try {
        await res.locals.product.deleteOne();
        res.json({ message: 'Deleted product' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
