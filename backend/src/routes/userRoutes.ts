import express, { Request, Response, NextFunction } from 'express';
import User from '../models/User';

const router = express.Router();

// Middleware to get user by ID
const getUser = async (req: Request, res: Response, next: NextFunction) => {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.locals.user = user;
    next();
};

// Get all users
router.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new user
router.post('/users', async (req: Request, res: Response) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a single user
router.get('/users/:id', getUser, (req: Request, res: Response) => {
    res.json(res.locals.user);
});

// Update a user
router.patch('/users/:id', getUser, async (req: Request, res: Response) => {
    if (req.body.name != null) {
        res.locals.user.name = req.body.name;
    }
    if (req.body.email != null) {
        res.locals.user.email = req.body.email;
    }
    if (req.body.password != null) {
        res.locals.user.password = req.body.password;
    }
    try {
        const updatedUser = await res.locals.user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user
router.delete('/users/:id', getUser, async (req: Request, res: Response) => {
    try {
        await res.locals.user.deleteOne();
        res.json({ message: 'Deleted user' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
