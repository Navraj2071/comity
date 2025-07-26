import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface IRegulatoryDepartment extends Document {
  name: string;
  fullName: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
  spoc: Types.ObjectId;
  description: string;
  createdAt: Date;
  createdBy: Types.ObjectId;
}

const RegulatoryDepartmentSchema = new Schema<IRegulatoryDepartment>(
  {
    name: { type: String },
    fullName: { type: String },
    criticality: { type: String },
    spoc: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const RegulatoryDepartment =
  models.RegulatoryDepartment ||
  model<IRegulatoryDepartment>(
    "RegulatoryDepartment",
    RegulatoryDepartmentSchema
  );

export default RegulatoryDepartment;
