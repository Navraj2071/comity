import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface ISOP extends Document {
  title: "";
  documentNumber: "";
  type: "Policy" | "SOP";
  category: "";
  department: Types.ObjectId;
  description: "";
  createdBy: Types.ObjectId;
  createdDate: "";
  reviewFrequency: "";
}

const SOPSchema = new Schema<ISOP>({
  title: { type: String },
  documentNumber: { type: String },
  type: { type: String },
  category: { type: String },
  department: { type: Schema.ObjectId, ref: "Department" },
  description: { type: String },
  createdBy: { type: Schema.ObjectId, ref: "User" },
  createdDate: { type: String },
  reviewFrequency: { type: String },
});

const SOP = models.SOP || model<ISOP>("SOP", SOPSchema);

export default SOP;
