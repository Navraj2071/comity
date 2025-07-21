import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface ISubCheckpoint extends Document {
  checkpoint: Types.ObjectId;
  title: "";
  department: "";
  deadline: "";
  assignedTo: "";
  isRemarksRequired: boolean;
  remarksType: "";
  remarksPlaceholder: "";
  isAttachmentRequired: boolean;
  responseTemplate: "";
  status: "submitted" | "pending";
  remarks: "";
  attachments: [];
  expectedClosureDate: "";
  submittedBy: Types.ObjectId;
}

const SubCheckpointSchema = new Schema<ISubCheckpoint>({
  checkpoint: {
    type: Schema.Types.ObjectId,
    ref: "Checkpoint",
    required: true,
  },
  title: { type: String },
  department: { type: String },
  deadline: { type: String },
  assignedTo: { type: String },
  isRemarksRequired: { type: Boolean },
  remarksType: { type: String },
  remarksPlaceholder: { type: String },
  isAttachmentRequired: { type: Boolean },
  responseTemplate: { type: String },
  status: { type: String, default: "pending" },
  remarks: { type: String },
  attachments: { type: [String] },
  expectedClosureDate: { type: String },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const SubCheckpoint =
  models.SubCheckpoint ||
  model<ISubCheckpoint>("SubCheckpoint", SubCheckpointSchema);

export default SubCheckpoint;
