import mongoose, { Document, Schema, model } from 'mongoose';

interface IReview {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface IProduct extends Document {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    quantity: number;
    category: string;
    reviews: IReview[];
}

const reviewSchema: Schema<IReview> = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const productSchema: Schema<IProduct> = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    category: { type: String, required: true},
    reviews: [reviewSchema]
});

const Product = model<IProduct>('Product', productSchema);

export default Product;
