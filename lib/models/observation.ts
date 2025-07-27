import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface IObservation extends Document {
  observationNumber: "";
  auditDate: "";
  auditType: "";
  category: "";
  observationCategory: "";
  severity: "";
  title: "";
  description: "";
  recommendation: "";
  department: Types.ObjectId;
  assignedTo: Types.ObjectId;
  targetDate: "";
  createdAt: Date;
  status: "";
  progress: "";
  createdBy: Types.ObjectId;
}

const ObservationSchema = new Schema<IObservation>(
  {
    observationNumber: { type: String },
    auditDate: { type: String },
    auditType: { type: String },
    category: { type: String },
    observationCategory: { type: String },
    severity: { type: String },
    title: { type: String },
    description: { type: String },
    recommendation: { type: String },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    targetDate: { type: String },
    status: { type: String },
    progress: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Observation =
  models.Observation || model<IObservation>("Observation", ObservationSchema);

export default Observation;
