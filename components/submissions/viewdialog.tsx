import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";

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
    "submitted By": selectedSubmission?.submittedBy,
    remarks: selectedSubmission?.remarks,
    status: selectedSubmission?.status,
  };

  const submittedFiles = selectedSubmission?.attachments;

  const FileDownloads = ({ files }: any) => {
    return (
      <div className="flex gap-2">
        {files.map((file: string) => (
          <div
            key={`download-file-${file}`}
            className="p-2 bg-gray-600 hover:bg-black"
          >
            <Download onClick={() => window.open(file)} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isViewSubmission} onOpenChange={setIsViewSubmission}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
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
