import mongoose, { Schema, models, model, Document } from "mongoose";

export interface ISOPVersion extends Document {
  version: 1.0;
  fileName: "";
  fileSize: "";
  uploadDate: "";
  uploadedBy: "";
  changes: "";
  reviewedBy: "";
  reviewDate: "";
  approvedBy: "";
  approvalDate: "";
}

const SOPVersionSchema = new Schema<ISOPVersion>({
  version: { type: Number, unique: true },
  fileName: { type: String, unique: true },
  fileSize: { type: String, unique: true },
  uploadDate: { type: String, unique: true },
  uploadedBy: { type: String, unique: true },
  changes: { type: String, unique: true },
  reviewedBy: { type: String, unique: true },
  reviewDate: { type: String, unique: true },
  approvedBy: { type: String, unique: true },
  approvalDate: { type: String, unique: true },
});

const SOPVersion =
  models.SOPVersion || model<ISOPVersion>("SOPVersion", SOPVersionSchema);

export default SOPVersion;
