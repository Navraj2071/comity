import { Button } from "@/components/ui/button";
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
import { Search, FileText, CheckCircle, XCircle } from "lucide-react";
import { getRBIObservations, updateRBIObservation } from "@/lib/storage";
import useapi from "../api/api";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

const ReviewDialog = ({
  showReviewDialog,
  setShowReviewDialog,
  activeTab,
  selectedReview,
  store,
}: any) => {
  const api = useapi();
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState("approve");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    await api
      .updateSubmission({
        status: "submitted",
        complianceComments: comments,
        _id: selectedReview?.submissionId,
      })
      .then((res) => {
        setShowReviewDialog(false);
        store.update("submissions");
      })
      .catch((err) => {
        setError(`Unable to ${status}`);
      });
    setLoading(false);
  };
  const handleRbiSubmit = async () => {
    setError("");
    setLoading(true);
    await api
      .updateObservation({
        status: status === "approve" ? "Closed" : "Pending Closure",
        comments,
        _id: selectedReview?._id,
      })
      .then((res) => {
        setShowReviewDialog(false);
        store.update("observations");
      })
      .catch((err) => {
        setError(`Unable to ${status}`);
      });
    setLoading(false);
  };

  useEffect(() => {
    setStatus("approved");
    setComments("");
  }, [selectedReview]);

  return (
    <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Close Submission</DialogTitle>
          <DialogDescription className="text-gray-400">
            {activeTab === "checkpoints"
              ? "Review the compliance evidence and close the submission"
              : "Review the RBI audit observation evidence and approve or reject the closure"}
          </DialogDescription>
        </DialogHeader>
        {selectedReview && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (activeTab === "checkpoints") handleSubmit();
              else handleRbiSubmit();
            }}
            className="space-y-4"
          >
            <div>
              <Label className="text-gray-400">
                {activeTab === "checkpoints" ? "Checkpoint" : "Observation"}
              </Label>
              <p className="text-white font-medium">
                {activeTab === "checkpoints"
                  ? selectedReview?.checkpointTitle
                  : selectedReview?.title}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === "checkpoints"
                  ? selectedReview?.subCheckpointTitle
                  : selectedReview?.description}
              </p>
            </div>

            <div>
              <Label className="text-gray-400">Submitted By</Label>
              <p className="text-white">
                {activeTab === "checkpoints"
                  ? selectedReview?.submittedBy
                  : store?.tools?.getUserNameFromId(selectedReview?.assignedTo)}
              </p>
            </div>
            <div>
              <Label className="text-gray-400">Status</Label>
              <p className="text-white">
                {selectedReview?.status?.toUpperCase()}
              </p>
            </div>

            <div>
              <Label className="text-gray-400">
                {activeTab === "checkpoints" ? "Remarks" : "Action Taken"}
              </Label>
              <div className="bg-gray-900 border border-gray-600 rounded-md p-3 mt-1">
                <p className="text-white">
                  {activeTab === "checkpoints"
                    ? selectedReview?.remarks
                    : selectedReview.actionTaken}
                </p>
              </div>
            </div>

            {activeTab === "rbi-audit" &&
              selectedReview?.departmentComments && (
                <div>
                  <Label className="text-gray-400">Department Comments</Label>
                  <div className="bg-gray-900 border border-gray-600 rounded-md p-3 mt-1">
                    <p className="text-white">
                      {selectedReview?.departmentComments}
                    </p>
                  </div>
                </div>
              )}

            <div>
              <Label className="text-gray-400">Attachments</Label>
              <div className="bg-gray-900 border border-gray-600 rounded-md p-3 mt-1">
                {(selectedReview.attachments &&
                  selectedReview.attachments.length > 0) ||
                (selectedReview.evidenceUploaded &&
                  selectedReview.evidenceUploaded.length > 0) ? (
                  <div className="space-y-2 flex flex-wrap items-center">
                    {(activeTab === "checkpoints"
                      ? selectedReview.attachments
                      : selectedReview.evidenceUploaded
                    ).map((file: string, index: number) => (
                      <div
                        key={index}
                        className="text-blue-400 hover:text-white"
                        onClick={() => window.open(file)}
                      >
                        <FileText className="h-10 w-10" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No attachments provided</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="reviewComments">Add Comments</Label>
              <Textarea
                id="reviewComments"
                name="reviewComments"
                placeholder="Provide your comments (optional)"
                className="bg-gray-900 border-gray-600"
                rows={4}
              />
            </div>

            {error && error !== "" && (
              <Alert className="bg-red-900/20 border-red-800 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading || selectedReview?.status === "closed"}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {loading ? (
                  <ClipLoader
                    color={"#000000"}
                    loading={true}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : selectedReview?.status === "closed" ? (
                  "Already closed"
                ) : (
                  "Close Compliance"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default ReviewDialog;
