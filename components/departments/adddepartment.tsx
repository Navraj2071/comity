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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

const CreateDepartmentPopup = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  store,
}: any) => {
  const api = useapi();
  const [editForm, setEditForm] = useState({
    name: "",
    head: "",
    spoc: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveDepartment = async () => {
    if (editForm.name === "") {
      setStatus("Department name is required.");
      return;
    }
    if (
      store?.db?.departments.some(
        (dep: { name: string }) => dep.name === editForm.name
      )
    ) {
      setStatus("A Department by this name already exists.");
      return;
    }
    if (editForm.head === "") {
      setStatus("Department Head is required.");
      return;
    }
    if (editForm.spoc === "") {
      setStatus("Department SPOC is required.");
      return;
    }

    setStatus("");
    setLoading(true);
    await api
      .createDepartment({ ...editForm })
      .then((res) => {
        setIsCreateDialogOpen(false);
        store?.update("departments");
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  const users = store?.db?.allUsers;

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter department information and assignments.
          </DialogDescription>
        </DialogHeader>
        {status && status !== "" && (
          <Alert className="bg-red-900/20 border-red-800 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-dept-name" className="text-right">
              Department Name
            </Label>
            <Input
              id="edit-dept-name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="col-span-3 bg-gray-700 border-gray-600"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-head" className="text-right">
              Head of Department
            </Label>
            <Select
              value={editForm.head}
              onValueChange={(value) =>
                setEditForm({ ...editForm, head: value })
              }
            >
              <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select department head" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {users &&
                  users.map((user: {}, i: number) => (
                    <SelectItem value={user._id} key={`head-user-${i}`}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-spoc" className="text-right">
              Department SPOC
            </Label>
            <Select
              value={editForm.spoc}
              onValueChange={(value) =>
                setEditForm({ ...editForm, spoc: value })
              }
            >
              <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select department SPOC" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {users &&
                  users.map((user: {}, i: number) => (
                    <SelectItem value={user._id} key={`spoc-user-${i}`}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveDepartment}
            className="bg-yellow-500 hover:bg-yellow-600"
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
              "Add Department"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentPopup;
