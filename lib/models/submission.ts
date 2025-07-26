import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface ISubmission extends Document {
  subCheckpoint: Types.ObjectId;
  assignedTo: Types.ObjectId;
  status: "";
  remarks: "";
  attachments: [];
  expectedClosureDate: "";
  submittedBy: Types.ObjectId;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    subCheckpoint: {
      type: Schema.Types.ObjectId,
      ref: "SubCheckpoint",
      required: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String },
    remarks: { type: String },
    attachments: { type: [String] },
    expectedClosureDate: { type: String },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Submission =
  models.Submission || model<ISubmission>("Submission", SubmissionSchema);

export default Submission;
