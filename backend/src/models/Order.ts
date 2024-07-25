import mongoose, { Document, Schema } from 'mongoose';

interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: { productId: string; quantity: number }[];
    status: string;
}

const orderSchema: Schema<IOrder> = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }
    ],
    status: { type: String, required: true, default: 'Pending' }
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
