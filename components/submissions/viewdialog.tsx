import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { updateSubCheckpoint, getRBIObservations } from "@/lib/storage";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

const ViewPopup = ({
  isViewSubmission,
  setIsViewSubmission,
  selectedSubmission,
  store,
}: any) => {
  const dataDisplay = {
    checkpoint: selectedSubmission?.checkpointTitle,
    "sub-Checkpoint": selectedSubmission?.subCheckpointTitle,
    "letter-Number": selectedSubmission?.letterNumber,
    "regulatory authority": selectedSubmission?.regulatory,
    deadline: selectedSubmission?.deadline,
    type: selectedSubmission?.type,
    "response-template": selectedSubmission?.responseTemplate,

    "submission date": `${new Date(
      selectedSubmission?.createdAt
    ).toLocaleDateString()}`,
    "assigned To": selectedSubmission?.assignedTo,
  };

  const submittedFiles = selectedSubmission?.attachments;

  const FileDownloads = ({ files }: any) => {
    return (
      <div className="flex gap-2">
        {files.map((file: string) => (
          <Download
            key={`download-file-${file}`}
            onClick={() => window.open(file)}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isViewSubmission} onOpenChange={setIsViewSubmission}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          {/* <DialogDescription className="text-gray-400">
            Submission Details
          </DialogDescription> */}
        </DialogHeader>
        {selectedSubmission && (
          <div className="m-1">
            {Object.keys(dataDisplay).map((label, i) => (
              <DataRow
                key={`data-display-${i}`}
                label={label}
                value={dataDisplay[label]}
              />
            ))}
          </div>
        )}

        {submittedFiles && submittedFiles?.length > 0 && (
          <div>
            View submitted files: <FileDownloads files={submittedFiles} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewPopup;

const DataRow = ({ label, value }: any) => {
  if (!label || !value) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        width: "100%",
      }}
    >
      <div>{label.toUpperCase()}:</div>
      <div>{value[0] === "/" ? "download" : value}</div>
    </div>
  );
};
