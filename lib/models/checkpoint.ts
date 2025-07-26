import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface ICheckopint extends Document {
  letterNumber: "";
  date: "";
  regulatory: Types.ObjectId;
  title: "";
  details: "";
  type: "ad-hoc" | "recurring";
  financialYear: "";
  frequency: "monthly" | "quarterly" | "half-yearly" | "annually";
  createdBy: Types.ObjectId;
}

const CheckpointSchema = new Schema<ICheckopint>({
  letterNumber: { type: String },
  date: { type: String },
  regulatory: { type: Schema.Types.ObjectId, ref: "RegulatoryDepartment" },
  title: { type: String },
  details: { type: String },
  type: { type: String },
  financialYear: { type: String },
  frequency: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const Checkpoint =
  models.Checkpoint || model<ICheckopint>("Checkpoint", CheckpointSchema);

export default Checkpoint;
