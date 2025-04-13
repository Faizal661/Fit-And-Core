import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { ISubscripton } from '../types/subscription.types';

export interface ISubscriptonModel extends Document ,Omit<ISubscripton,"_id">{}

const SubscriptonSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId , ref: "User", required: true },
  trianerId: { type: Schema.Types.ObjectId , ref: "User", required: true},
  plan: { type: String },
  amount: { type: Number },
  endDate: { type: Date },
  startDate: { type: Date },
  paymentId: { type: Schema.Types.ObjectId , ref: "Payment", required: true},
});

const SubscriptonModel = mongoose.model<ISubscriptonModel>('Subscripton', SubscriptonSchema);

export default SubscriptonModel;