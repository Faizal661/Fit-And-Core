import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage {
  _id?: Types.ObjectId;
  senderId: Types.ObjectId;
  groupId?: Types.ObjectId;
  receiverId?: Types.ObjectId;
  content: string; 
  type: "text" | "image" | "system";
  replyToMessageId?: Types.ObjectId;
  readBy: Types.ObjectId[]; 
  status: "sent" | "delivered" | "read";
  isDeleted: boolean; 
  messageScope: "private" | "group";
  createdAt: Date; 
  updatedAt: Date;
}

export interface IMessageModel extends Document, IMessage {
  _id: Types.ObjectId;
}

const MessageSchema = new Schema<IMessageModel>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    type: {
      type: String,
      enum: ["text", "image", "video", "file", "system"],
      default: "text",
    },
    replyToMessageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    isDeleted: { type: Boolean, default: false },

    messageScope: { type: String, enum: ["private", "group"], required: true },
  },
  { timestamps: true }
);

MessageSchema.index({ groupId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });

export const MessageModel = mongoose.model<IMessageModel>(
  "Message",
  MessageSchema
);
export default MessageModel;
