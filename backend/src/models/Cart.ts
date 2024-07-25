import mongoose, { Document, Schema, model } from 'mongoose';

interface ICartItem {
    productId: string;
    quantity: number;
}

interface ICart extends Document {
    items: ICartItem[];
}

const cartSchema: Schema<ICart> = new mongoose.Schema({
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
});

const Cart = model<ICart>('Cart', cartSchema);

export default Cart;
