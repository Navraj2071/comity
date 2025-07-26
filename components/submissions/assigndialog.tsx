import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const AssignDialog = ({
  isAssignDialog,
  setIsAssignDialog,
  selectedSubmission,
  store,
}: any) => {
  const api = useapi();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [assignedUser, setAssignedUser] = useState("");

  const users = store?.db?.allUsers || [];

  const handleSubmit = async () => {
    setStatus("");
    setLoading(true);
    await api
      .updateSubmission({
        _id: selectedSubmission.submissionId,
        assignedTo: assignedUser,
      })
      .then((res) => {
        setIsAssignDialog(false);
        store.update("submissions");
      })
      .catch((err) => console.log(err));

    setLoading(false);
  };

  return (
    <Dialog open={isAssignDialog} onOpenChange={setIsAssignDialog}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Assign User</DialogTitle>
          <DialogDescription className="text-gray-400">
            Assign User to this checkpoint
          </DialogDescription>
        </DialogHeader>
        {selectedSubmission && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4"
          >
            <div>
              <Label className="text-gray-400">Select User</Label>
              <Select
                value={assignedUser}
                onValueChange={(value) => setAssignedUser(value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {users?.map((user: any, i: number) => (
                    <SelectItem value={user._id} key={`user-${user._id}`}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                onClick={() => setIsAssignDialog(false)}
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
                  "Assign User"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignDialog;
