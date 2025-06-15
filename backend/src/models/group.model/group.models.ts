import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGroup {
  name: string; // Name of the group (e.g., "Beginner Yoga", "Marathon Prep")
  description: string; // A brief description of the group's purpose
  adminId: Types.ObjectId; 
  groupImage?: string;
}

export interface IGroupModel extends Document, IGroup {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroupModel>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupImage: { type: String },
  },
  { timestamps: true } 
);


export const GroupModel = mongoose.model<IGroupModel>('Group', GroupSchema);
export default GroupModel;