import mongoose, { Schema, Document, Types } from "mongoose";

export type NotificationType =
  | "new_subscription"
  | "subscription_expiry"
  | "new_booking"
  | "upcoming_session"
  | "general"
  | "system_alert";

export interface INotification {
  userId: Types.ObjectId;
  userType?: "Trainer" | "Trainee";
  type: NotificationType;
  message: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
}

export interface INotificationModel extends Document, INotification {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "new_subscription",
        "subscription_expiry",
        "new_booking",
        "upcoming_session",
        "general",
        "system_alert",
      ],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    link: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotificationModel>(
  "Notification",
  NotificationSchema
);
export default NotificationModel;
