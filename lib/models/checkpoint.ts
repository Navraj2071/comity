import mongoose, { Schema, models, model, Document } from "mongoose";

export interface ICheckopint extends Document {
  letterNumber: "";
  date: "";
  regulatory: "";
  title: "";
  details: "";
  type: "ad-hoc" | "recurring";
  financialYear: "";
  frequency: "monthly" | "quarterly" | "half-yearly" | "annually";
}

const CheckpointSchema = new Schema<ICheckopint>({
  letterNumber: { type: String },
  date: { type: String },
  regulatory: { type: String },
  title: { type: String },
  details: { type: String },
  type: { type: String },
  financialYear: { type: String },
  frequency: { type: String },
});

const Checkpoint =
  models.Checkpoint || model<ICheckopint>("Checkpoint", CheckpointSchema);

export default Checkpoint;
