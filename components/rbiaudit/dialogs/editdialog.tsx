import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useapi from "@/components/api/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

const Editdialog = ({ audit }: any) => {
  const api = useapi();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleUpdateObservation = async (formData: FormData) => {
    if (!audit?.selectedObservation) return;

    const updates = {
      _id: audit.selectedObservation._id,
      status: formData.get("status") as any,
      progress: Number.parseInt(formData.get("progress") as string),
      actionTaken: formData.get("actionTaken") as string,
      departmentComments: formData.get("departmentComments") as string,
    };

    setStatus("");
    setLoading(true);
    await api
      .updateObservation(updates)
      .then((res) => {
        audit?.store?.update("observations");
        audit?.setShowEditDialog(false);
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  return (
    <Dialog
      open={audit?.showEditDialog}
      onOpenChange={audit?.setShowEditDialog}
    >
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Update Observation Progress</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the status and progress of the observation
          </DialogDescription>
        </DialogHeader>
        {audit?.selectedObservation && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateObservation(new FormData(e.currentTarget));
            }}
            className="space-y-4"
          >
            <div>
              <Label>Observation: {audit?.selectedObservation.title}</Label>
              <p className="text-sm text-gray-400 mt-1">
                {audit?.selectedObservation.observationNumber}
              </p>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                defaultValue={audit?.selectedObservation.status}
              >
                <SelectTrigger className="bg-gray-900 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending Closure">
                    Pending Closure
                  </SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                name="progress"
                type="number"
                min="0"
                max="100"
                defaultValue={audit?.selectedObservation.progress}
                className="bg-gray-900 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="actionTaken">Action Taken</Label>
              <Textarea
                id="actionTaken"
                name="actionTaken"
                defaultValue={audit?.selectedObservation.actionTaken || ""}
                className="bg-gray-900 border-gray-600"
                placeholder="Describe the actions taken to address this observation"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="departmentComments">Department Comments</Label>
              <Textarea
                id="departmentComments"
                name="departmentComments"
                defaultValue={
                  audit?.selectedObservation.departmentComments || ""
                }
                className="bg-gray-900 border-gray-600"
                placeholder="Additional comments from the department"
                rows={3}
              />
            </div>

            {status && status !== "" && (
              <Alert className="bg-red-900/20 border-red-800 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => audit?.setShowEditDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
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
                ) : (
                  <div>Update Observation</div>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Editdialog;
