import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes'
import orderRoutes from './routes/orderRoutes'
import cartRoutes from './routes/cartRoutes'
import reviewRoutes from './routes/reviewRoutes';
import recommendationRoutes from './routes/recommendationRoutes'

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/recommendations', recommendationRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app