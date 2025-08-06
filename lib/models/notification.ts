import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  user: Types.ObjectId;
  message: string;
  severity: "low" | "medium" | "high";
  read: boolean;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String },
    severity: { type: String, default: "low" },
    read: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification =
  models.Notification ||
  model<INotification>("Notification", NotificationSchema);

export default Notification;
