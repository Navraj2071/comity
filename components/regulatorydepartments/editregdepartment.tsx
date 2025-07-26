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
  DialogTrigger,
} from "@/components/ui/dialog";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { getSomeValueWithId } from "@/lib/tools";

const EditDepartmentPopup = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedDept,
  store,
}: any) => {
  const users = store?.db?.allUsers?.filter(
    (user: any) =>
      getSomeValueWithId(
        "name",
        store?.db?.departments || [],
        user?.department || ""
      ) === "Compliance"
  );
  const api = useapi();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [deptForm, setDeptForm] = useState({
    name: "",
    fullName: "",
    criticality: "",
    spoc: "",
    description: "",
  });

  useEffect(() => {
    setDeptForm({ ...selectedDept });
  }, [selectedDept]);

  const handleEdit = async () => {
    if (
      deptForm.name === "" ||
      deptForm.fullName === "" ||
      deptForm.criticality === "" ||
      deptForm.spoc === "" ||
      deptForm.description === ""
    ) {
      setStatus("All fields are required.");
      return;
    }
    setStatus("");
    setLoading(true);
    await api
      .updateRegulatoryDepartment({ ...deptForm, _id: selectedDept?._id })
      .then((res) => {
        setIsEditDialogOpen(false);
        store?.update("regulatoryDepartments");
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Regulatory Department</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure a new regulatory department with criticality and SPOC
            assignment.
          </DialogDescription>
        </DialogHeader>
        {status && status !== "" && (
          <Alert className="bg-red-900/20 border-red-800 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="regbody">Regulatory Body</Label>
            <Input
              id="regbody"
              placeholder="Full name of the regulatory body"
              className="bg-gray-700 border-gray-600"
              value={deptForm.name}
              onChange={(e) =>
                setDeptForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Full name of the regulatory body"
              className="bg-gray-700 border-gray-600"
              value={deptForm.fullName}
              onChange={(e) =>
                setDeptForm((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spoc">Compliance SPOC</Label>
            <Select
              value={deptForm.spoc}
              onValueChange={(value) =>
                setDeptForm((prev) => ({ ...prev, spoc: value }))
              }
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select compliance SPOC" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {users?.map((user: any) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="criticality">Criticality Level</Label>
            <Select
              value={deptForm.criticality}
              onValueChange={(value) =>
                setDeptForm((prev) => ({
                  ...prev,
                  criticality: value as typeof prev.criticality,
                }))
              }
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select criticality" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description of regulatory scope and responsibilities"
              className="bg-gray-700 border-gray-600"
              rows={3}
              value={deptForm.description}
              onChange={(e) =>
                setDeptForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600"
            onClick={handleEdit}
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
              "Save Department"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentPopup;
