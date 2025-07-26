import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
const Deleteuser = ({
  selectedUser,
  store,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
}: any) => {
  const api = useapi();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const deleteUser = async () => {
    setStatus("");
    setLoading(true);
    console.log("deleting user: ", selectedUser, selectedUser?._id);
    await api
      .deleteUser({ _id: selectedUser?._id })
      .then((res) => {
        console.log(res);
        setIsDeleteDialogOpen(false);
        store?.update("allUsers");
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription className="text-gray-400">
            Delete {selectedUser?.name} from the system.
          </DialogDescription>
        </DialogHeader>
        <div className="text-red-600">
          Warning: All user data will be deleted permanently. If you want to
          temporary disable the user, please try editing the user details and
          change the status to "Inactive"
        </div>
        {status && status !== "" && (
          <Alert className="bg-red-900/20 border-red-800 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600"
            disabled={loading}
            onClick={deleteUser}
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
              <div className="flex">
                <Trash2 className="h-4 w-4" />
                Delete User
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Deleteuser;
