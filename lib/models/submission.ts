import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface ISubmission extends Document {
  subCheckpoint: Types.ObjectId;

  status: "";
  remarks: "";
  attachments: [];

  submittedBy: Types.ObjectId;
  createdAt: Date;
  comments: "";
  complianceComments: "";
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    subCheckpoint: {
      type: Schema.Types.ObjectId,
      ref: "SubCheckpoint",
      required: true,
    },
    status: { type: String },
    remarks: { type: String },
    attachments: { type: [String] },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: { type: String },
    complianceComments: { type: String },
  },
  {
    timestamps: true,
  }
);

const Submission =
  models.Submission || model<ISubmission>("Submission", SubmissionSchema);

export default Submission;
