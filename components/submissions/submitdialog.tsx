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

const SubmissionPopup = ({
  showSubmitDialog,
  setShowSubmitDialog,
  selectedSubmission,
  setSelectedSubmission,
  activeTab,
  store,
}: any) => {
  const api = useapi();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [formdata, setFormdata] = useState({
    remarks: "",
    attachments: [],
    expectedClosureDate: "",
  });

  const handleSubmit = async () => {
    if (
      selectedSubmission.isAttachmentRequired &&
      formdata.attachments.length === 0
    ) {
      setStatus("Evidence is mandatory for this checkpoint.");
      return;
    }
    if (selectedSubmission.isRemarksRequired && formdata.remarks === "") {
      setStatus("Remarks is mandatory for this checkpoint.");
      return;
    }
    setStatus("");
    setLoading(true);
    const files = [];
    await Promise.all(
      formdata.attachments.map(async (file) => {
        await api
          .fileUpload(file)
          .then((res) => files.push(res.url))
          .catch((err) => console.log(err));
      })
    );

    const apiData = { ...formdata };
    apiData.attachments = files;
    apiData.status = "pending_review";
    apiData.subCheckpoint = selectedSubmission.subCheckpointId;
    await api
      .createSubmission(apiData)
      .then((res) => {
        setShowSubmitDialog(false);
        store.update("submissions");
        setSelectedSubmission(null);
      })
      .catch((err) => console.log(err));

    setLoading(false);
  };

  const handleRbiAuditSubmit = (formData: any) => {
    if (!selectedSubmission) return;

    const updates = {
      status: "Pending Closure",
      progress: Number.parseInt(formData.get("progress")),
      actionTaken: formData.get("actionTaken"),
      departmentComments: formData.get("departmentComments"),
      evidenceUploaded: ["evidence.pdf"], // In a real app, handle file uploads
    };

    // Update in storage
    updateSubCheckpoint(selectedSubmission.id, updates);

    // Update local state
    setRbiAuditSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubmission.id ? { ...sub, ...updates } : sub
      )
    );

    setShowSubmitDialog(false);
    setSelectedSubmission(null);
  };

  const selectFiles = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.style.display = "none";

      input.onchange = () => {
        const files = input.files;
        if (files && files.length > 0) {
          setFormdata((prev: any) => {
            let newData = { ...prev };
            newData.attachments = Array.from(files);
            return newData;
          });
        }
        document.body.removeChild(input);
      };

      document.body.appendChild(input);
      input.click();
    } catch {}
  };
  return (
    <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Submit Compliance Evidence</DialogTitle>
          <DialogDescription className="text-gray-400">
            {activeTab === "checkpoints"
              ? "Provide evidence and remarks for the selected checkpoint"
              : "Update progress and provide evidence for the RBI audit observation"}
          </DialogDescription>
        </DialogHeader>
        {selectedSubmission && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (activeTab === "checkpoints") {
                handleSubmit();
              } else {
                handleRbiAuditSubmit(new FormData(e.currentTarget));
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label className="text-gray-400">
                {activeTab === "checkpoints" ? "Checkpoint" : "Observation"}
              </Label>
              <p className="text-white font-medium">
                {activeTab === "checkpoints"
                  ? selectedSubmission.checkpointTitle
                  : selectedSubmission.title}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === "checkpoints"
                  ? selectedSubmission.subCheckpointTitle
                  : selectedSubmission.description}
              </p>
            </div>

            {activeTab === "rbi-audit" && (
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  name="progress"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={selectedSubmission.progress}
                  required
                  className="bg-gray-900 border-gray-600"
                />
              </div>
            )}

            <div>
              <Label
                htmlFor={
                  activeTab === "checkpoints" ? "remarks" : "actionTaken"
                }
              >
                {activeTab === "checkpoints"
                  ? selectedSubmission?.isRemarksRequired
                    ? "Remarks"
                    : "Remarks (optional)"
                  : "Action Taken"}
              </Label>
              <Textarea
                id={activeTab === "checkpoints" ? "remarks" : "actionTaken"}
                name={activeTab === "checkpoints" ? "remarks" : "actionTaken"}
                placeholder={
                  activeTab === "checkpoints"
                    ? "Provide details about the compliance evidence"
                    : "Describe actions taken to address the observation"
                }
                className="bg-gray-900 border-gray-600"
                rows={4}
                value={formdata.remarks}
                onChange={(e) =>
                  setFormdata((prev) => {
                    let newValues = { ...prev };
                    newValues.remarks = e.target.value;
                    return newValues;
                  })
                }
              />
            </div>

            {activeTab === "rbi-audit" && (
              <div>
                <Label htmlFor="departmentComments">Department Comments</Label>
                <Textarea
                  id="departmentComments"
                  name="departmentComments"
                  placeholder="Additional comments from the department"
                  className="bg-gray-900 border-gray-600"
                  rows={3}
                  defaultValue={selectedSubmission.departmentComments || ""}
                />
              </div>
            )}

            <div>
              <div className="flex justify-between">
                <Label htmlFor="evidence">
                  {selectedSubmission?.isAttachmentRequired
                    ? "Upload Evidence"
                    : "Upload Evidence (optional)"}
                </Label>
                {selectedSubmission?.responseTemplate &&
                  selectedSubmission?.responseTemplate !== "" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        window.open(selectedSubmission.responseTemplate)
                      }
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  )}
              </div>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center mt-2">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-400 mb-2">
                  Drop files here or click to browse
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={selectFiles}
                >
                  Choose Files
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, DOCX, XLSX, JPG, PNG (Max 10MB)
                </p>
              </div>
              {formdata.attachments.map((file, i) => (
                <div
                  className="flex items-center justify-between"
                  key={`uploaded-file-${i}`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-gray-400">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormdata((prev) => {
                        let newData = { ...prev };
                        newData.attachments = newData.attachments.filter(
                          (_, index) => index !== i
                        );
                        console.log(newData.attachments);
                        return newData;
                      });
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {activeTab === "checkpoints" && (
              <div>
                <Label htmlFor="expectedClosureDate">
                  Expected Closure Date
                </Label>
                <Input
                  id="expectedClosureDate"
                  name="expectedClosureDate"
                  type="date"
                  required
                  className="bg-gray-900 border-gray-600"
                />
              </div>
            )}

            {status && status !== "" && (
              <Alert className="bg-red-900/20 border-red-800 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader
                    color={"#000000"}
                    loading={true}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Submit Evidence"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionPopup;
