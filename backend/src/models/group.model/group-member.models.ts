import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGroupMember {
  groupId: Types.ObjectId; 
  userId: Types.ObjectId; 
  status: 'active' | 'left' | 'kicked' | 'blocked'; 
  joinedAt: Date; 
  blockedAt?: Date; 
  kickedAt?: Date; 
  leaveAt?: Date; 
}

export interface IGroupMemberModel extends Document, IGroupMember {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GroupMemberSchema = new Schema<IGroupMemberModel>(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'left', 'kicked', 'blocked'], default: 'active' },
    joinedAt: { type: Date, default: Date.now },
    blockedAt: { type: Date },
    kickedAt: { type: Date },
    leaveAt: { type: Date },
  },
  { timestamps: true }
);

GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });
GroupMemberSchema.index({ userId: 1 });

export const GroupMemberModel = mongoose.model<IGroupMemberModel>('GroupMember', GroupMemberSchema);
export default GroupMemberModel;