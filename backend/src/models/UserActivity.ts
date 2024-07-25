// models/UserActivity.ts

import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IUserActivity extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  action: 'viewed' | 'added_to_cart' | 'purchased';
  timestamp: Date;
}

const userActivitySchema = new Schema<IUserActivity>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const UserActivity = model<IUserActivity>('UserActivity', userActivitySchema);

export default UserActivity;
