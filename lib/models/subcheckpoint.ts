import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface ISubCheckpoint extends Document {
  checkpoint: Types.ObjectId;
  title: "";
  department: Types.ObjectId;
  deadline: "";
  isRemarksRequired: boolean;
  remarksType: "";
  remarksPlaceholder: "";
  isAttachmentRequired: boolean;
  responseTemplate: "";
  evidencePlaceholder: "";
  submittedBy: Types.ObjectId;
  assignedTo: Types.ObjectId;
}

const SubCheckpointSchema = new Schema<ISubCheckpoint>({
  checkpoint: {
    type: Schema.Types.ObjectId,
    ref: "Checkpoint",
    required: true,
  },
  title: { type: String },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  deadline: { type: String },
  isRemarksRequired: { type: Boolean },
  remarksType: { type: String },
  remarksPlaceholder: { type: String },
  isAttachmentRequired: { type: Boolean },
  responseTemplate: { type: String },
  evidencePlaceholder: { type: String },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const SubCheckpoint =
  models.SubCheckpoint ||
  model<ISubCheckpoint>("SubCheckpoint", SubCheckpointSchema);

export default SubCheckpoint;
