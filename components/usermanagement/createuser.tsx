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
import { Plus } from "lucide-react";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

const CreateUserPopup = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  store,
}: any) => {
  const api = useapi();
  const [formdata, setFormdata] = useState<any>({
    name: "",
    email: "",
    role: "User",
    department: "",
    password: "",
  });

  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const userRoles = ["Admin", "Super-user", "User"];

  const changeValue = (key: string, value: string) => {
    setFormdata((prev: any) => {
      const newValues = { ...prev };
      newValues[key] = value;
      return newValues;
    });
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("");
    setLoading(true);
    await api
      .createUser(formdata)
      .then((res) => {
        setIsCreateDialogOpen(false);
        store.update("allUsers");
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  const departments = store?.db?.departments || [];

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <form onSubmit={addUser}>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new user to the system with appropriate role and department
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
              <Label htmlFor="email" className="text-right">
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                value={formdata.email}
                onChange={(e: any) => changeValue("email", e.target.value)}
                required
                placeholder="Enter email address"
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
                  {departments?.map((dep: any, i: number) => (
                    <SelectItem value={dep._id} key={`dep-select-${i}`}>
                      {dep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password*
              </Label>
              <Input
                id="password"
                type="password"
                value={formdata.password}
                onChange={(e: any) => changeValue("password", e.target.value)}
                required
                placeholder="Enter password"
                className="col-span-3 bg-gray-700 border-gray-600"
              />
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
                <div>Create User</div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserPopup;
