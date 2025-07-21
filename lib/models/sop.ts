import mongoose, { Schema, models, model, Document } from "mongoose";

export interface ISOP extends Document {
  title: "";
  documentNumber: "";
  type: "Policy" | "SOP";
  category: "";
  department: "";
  description: "";
  status: "";
  createdBy: "";
  createdDate: "";
  reviewFrequency: "";
  nextReviewDate: "";
}

const SOPSchema = new Schema<ISOP>({
  title: { type: String, unique: true },
  documentNumber: { type: String, unique: true },
  type: { type: String, unique: true },
  category: { type: String, unique: true },
  department: { type: String, unique: true },
  description: { type: String, unique: true },
  status: { type: String, unique: true },
  createdBy: { type: String, unique: true },
  createdDate: { type: String, unique: true },
  reviewFrequency: { type: String, unique: true },
  nextReviewDate: { type: String, unique: true },
});

const SOP = models.SOP || model<ISOP>("SOP", SOPSchema);

export default SOP;
