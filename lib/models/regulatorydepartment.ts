import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IRegulatoryDepartment extends Document {
  name: "RBI" | "NPCI" | "UIDAI" | "CSITE" | "IDRBT";
  fullName: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
  spoc: string;
  description: string;
  createdAt: Date;
  createdBy: string;
}

const RegulatoryDepartmentSchema = new Schema<IRegulatoryDepartment>(
  {
    name: { type: String },
    fullName: { type: String },
    criticality: { type: String },
    spoc: { type: String },
    description: { type: String },
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
