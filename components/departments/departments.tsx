"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Edit, Users, Search, Plus } from "lucide-react";
import useStore from "@/lib/store/useStore";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function DepartmentManagement() {
  const store = useStore();
  const { user, departments } = store?.db;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const filteredDepartments = departments?.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.spoc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Department Management
          </h1>
          <p className="text-gray-400">
            Manage departments, heads, and compliance SPOCs
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Departments</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage department structure and assign compliance
                  responsibilities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search departments by name, head, or SPOC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Departments Table */}
            <div className="rounded-md border border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Department</TableHead>
                    <TableHead className="text-gray-300">
                      Head of Department
                    </TableHead>
                    <TableHead className="text-gray-300">
                      Department SPOC
                    </TableHead>
                    <TableHead className="text-gray-300">Users</TableHead>
                    <TableHead className="text-gray-300">
                      Active Checkpoints
                    </TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments?.map((dept) => (
                    <TableRow key={dept._id} className="border-gray-700">
                      <TableCell className="font-medium text-white">
                        {dept.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {dept.head}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {dept.spoc}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">
                            {dept.userCount}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-blue-400 border-blue-400"
                        >
                          {dept.activeCheckpoints}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => {
                              setIsEditDialogOpen(true);
                              setEditingDepartment(dept);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <EditDepartmentPopup
              isEditDialogOpen={isEditDialogOpen}
              setIsEditDialogOpen={setIsEditDialogOpen}
              store={store}
              editingDepartment={editingDepartment}
              setEditingDepartment={setEditingDepartment}
            />
            <CreateDepartmentPopup
              isCreateDialogOpen={isCreateDialogOpen}
              setIsCreateDialogOpen={setIsCreateDialogOpen}
              store={store}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

const EditDepartmentPopup = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  store,
  editingDepartment,
  setEditingDepartment,
}: any) => {
  const api = useapi();
  const [editForm, setEditForm] = useState({
    name: "",
    head: "",
    spoc: "",
  });

  useEffect(() => {
    setEditForm({
      name: editingDepartment?.name,
      head: editingDepartment?.head,
      spoc: editingDepartment?.spoc,
    });
  }, [editingDepartment]);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveDepartment = async () => {
    if (editForm.name === "") {
      setStatus("Department name is required.");
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
      .updateDepartment({ ...editForm, _id: editingDepartment._id })
      .then((res) => {
        setIsEditDialogOpen(false);
        store?.update("departments");
        setEditingDepartment(null);
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  const users = store?.db?.allUsers;

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update department information and assignments.
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
                    <SelectItem value={user.name} key={`head-user-${i}`}>
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
                    <SelectItem value={user.name} key={`spoc-user-${i}`}>
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
            onClick={() => setIsEditDialogOpen(false)}
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
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
                    <SelectItem value={user.name} key={`head-user-${i}`}>
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
                    <SelectItem value={user.name} key={`spoc-user-${i}`}>
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
