import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  head: Types.ObjectId;
  spoc: Types.ObjectId;
  createdAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, unique: true },
    head: { type: Schema.ObjectId, ref: "User" },
    spoc: { type: Schema.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Department =
  models.Department || model<IDepartment>("Department", DepartmentSchema);

export default Department;
