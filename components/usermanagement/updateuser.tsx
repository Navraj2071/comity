import { useEffect, useState } from "react";
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
import { Plus } from "lucide-react";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { userRoles } from "@/lib/tools";
const Updateuser = ({
  selectedUser,
  isUpdateDialogOpen,
  setIsUpdateDialogOpen,
  store,
}: any) => {
  const api = useapi();

  const [formdata, setFormdata] = useState({
    name: "",
    role: "",
    status: "",
    department: "",
  });

  useEffect(() => {
    setFormdata({
      name: selectedUser?.name,
      role: selectedUser?.role,
      status: selectedUser?.status,
      department: selectedUser?.department,
    });
  }, [selectedUser]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const changeValue = (key: string, value: string) => {
    setFormdata((prev) => {
      let newdata = { ...prev };
      newdata[key] = value;
      return newdata;
    });
  };
  const updateUser = async (e: any) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    api
      .updateUser({ _id: selectedUser?._id, ...formdata })
      .then((res) => {
        setIsUpdateDialogOpen(false);
        store?.update("allUsers");
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  return (
    <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <form onSubmit={updateUser}>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update user information.
            </DialogDescription>
            <DialogDescription className="text-gray-400">
              Email: {selectedUser?.email}
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
              <Label htmlFor="name" className="text-right">
                Full Name*
              </Label>
              <Input
                id="name"
                value={formdata.name}
                onChange={(e: any) => changeValue("name", e.target.value)}
                required
                placeholder="Enter full name"
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role*
              </Label>
              <Select
                value={formdata.role}
                onValueChange={(e: string) => changeValue("role", e)}
              >
                <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {userRoles.map((role, i) => (
                    <SelectItem value={role} key={`user-role-${i}`}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Status*
              </Label>
              <Select
                value={formdata.status}
                onValueChange={(e: string) => changeValue("status", e)}
              >
                <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {["Active", "Inactive"].map((stat, i) => (
                    <SelectItem value={stat} key={`user-stat-${i}`}>
                      {stat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department*
              </Label>
              <Select
                value={formdata.department}
                onValueChange={(e: string) => changeValue("department", e)}
              >
                <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {store?.db?.departments?.map((dep: any, i: number) => (
                    <SelectItem value={dep._id} key={`dep-select-${i}`}>
                      {dep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
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
                <div>Update User</div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Updateuser;
