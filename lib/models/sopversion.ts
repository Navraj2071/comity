import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface ISOPVersion extends Document {
  sop: Types.ObjectId;
  version: "";
  fileName: "";
  fileSize: "";
  uploadDate: "";
  uploadedBy: Types.ObjectId;
  changes: "";
  reviewedBy: Types.ObjectId;
  reviewDate: "";
  reviewStatus: "";
  approvedBy: Types.ObjectId;
  approvalDate: "";
  approvalStatus: "";
  file: "";
}

const SOPVersionSchema = new Schema<ISOPVersion>({
  version: { type: String },
  fileName: { type: String },
  fileSize: { type: String },
  uploadDate: { type: String },
  uploadedBy: { type: Schema.ObjectId, ref: "User" },
  changes: { type: String },
  reviewedBy: { type: Schema.ObjectId, ref: "User" },
  reviewDate: { type: String },
  reviewStatus: { type: String },
  approvedBy: { type: Schema.ObjectId, ref: "User" },
  approvalDate: { type: String },
  approvalStatus: { type: String },
  sop: { type: Schema.Types.ObjectId, ref: "SOP", required: true },
  file: { type: String, required: true },
});

const SOPVersion =
  models.SOPVersion || model<ISOPVersion>("SOPVersion", SOPVersionSchema);

export default SOPVersion;
