import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  head: string;
  spoc: string;
  userCount: number;
  activeCheckpoints: number;
  createdAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, unique: true },
    head: { type: String },
    spoc: { type: String },
    userCount: { type: Number, default: 2 },
    activeCheckpoints: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Department =
  models.Department || model<IDepartment>("Department", DepartmentSchema);

export default Department;
