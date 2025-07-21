"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Edit, Search, AlertTriangle, Shield, User } from "lucide-react";
import {
  getRegulatoryDepartments,
  addRegulatoryDepartment,
  updateRegulatoryDepartment,
  getUsers,
  type RegulatoryDepartment,
} from "@/lib/storage";
import useStore from "@/lib/store/useStore";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function RegulatoryDepartmentsPage() {
  const store = useStore();

  const regulatoryDepts = store?.db?.regulatoryDepartments;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<RegulatoryDepartment | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepts = regulatoryDepts?.filter(
    (dept: any) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.spoc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "Critical":
        return "bg-red-600 text-white";
      case "High":
        return "bg-orange-600 text-white";
      case "Medium":
        return "bg-yellow-600 text-white";
      case "Low":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getCriticalityIcon = (criticality: string) => {
    switch (criticality) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "High":
        return <AlertTriangle className="h-4 w-4" />;
      case "Medium":
        return <Shield className="h-4 w-4" />;
      case "Low":
        return <Shield className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Regulatory Departments
          </h1>
          <p className="text-gray-400">
            Manage regulatory departments, criticality levels, and compliance
            SPOCs
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Regulatory Departments
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure regulatory departments with criticality and SPOC
                  assignments
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
                  placeholder="Search regulatory departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <CreateDepartmentPopup
              isCreateDialogOpen={isCreateDialogOpen}
              setIsCreateDialogOpen={setIsCreateDialogOpen}
              store={store}
            />

            {/* Departments Table */}
            <div className="rounded-md border border-gray-700 shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">
                      Regulatory Body
                    </TableHead>
                    <TableHead className="text-gray-300">Full Name</TableHead>
                    <TableHead className="text-gray-300">Criticality</TableHead>
                    <TableHead className="text-gray-300">
                      Compliance SPOC
                    </TableHead>
                    <TableHead className="text-gray-300">Description</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepts?.map((dept: any) => (
                    <TableRow
                      key={`table1-${dept._id}`}
                      className="border-gray-700 hover:bg-gray-700/50"
                    >
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-600 text-white">
                            {dept.name}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {dept.fullName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getCriticalityIcon(dept.criticality)}
                          <Badge
                            className={getCriticalityColor(dept.criticality)}
                          >
                            {dept.criticality}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{dept.spoc}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-xs truncate">
                        {dept.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => {
                              setSelectedDept(dept);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditDepartmentPopup
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedDept={selectedDept}
        store={store}
      />
    </main>
  );
}

const CreateDepartmentPopup = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  store,
}: any) => {
  const users = store?.db?.allUsers;
  const regBodies = ["RBI", "NPCI", "UIDAI", "CSITE", "IDRBT"];
  const api = useapi();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [deptForm, setDeptForm] = useState({
    name: "" as "RBI" | "NPCI" | "UIDAI" | "CSITE" | "IDRBT" | "",
    fullName: "",
    criticality: "" as "Critical" | "High" | "Medium" | "Low" | "",
    spoc: "",
    description: "",
  });

  const handleCreate = async () => {
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
      .createRegulatoryDepartment({ ...deptForm })
      .then((res) => {
        setIsCreateDialogOpen(false);
        store?.update("regulatoryDepartments");
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600 shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Regulatory Department
        </Button>
      </DialogTrigger>
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
            <Select
              value={deptForm.name}
              onValueChange={(value) =>
                setDeptForm((prev) => ({
                  ...prev,
                  name: value as typeof prev.name,
                }))
              }
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select regulatory body" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {regBodies.map((rb, i) => (
                  <SelectItem value={rb} key={`reg-body-${i}`}>
                    {rb}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <SelectItem key={user._id} value={user.name}>
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
            onClick={handleCreate}
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
const EditDepartmentPopup = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedDept,
  store,
}: any) => {
  const users = store?.db?.allUsers;
  const regBodies = ["RBI", "NPCI", "UIDAI", "CSITE", "IDRBT"];
  const api = useapi();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [deptForm, setDeptForm] = useState({
    name: "" as "RBI" | "NPCI" | "UIDAI" | "CSITE" | "IDRBT" | "",
    fullName: "",
    criticality: "" as "Critical" | "High" | "Medium" | "Low" | "",
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
            <Select
              value={deptForm.name}
              onValueChange={(value) =>
                setDeptForm((prev) => ({
                  ...prev,
                  name: value as typeof prev.name,
                }))
              }
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select regulatory body" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {regBodies.map((rb, i) => (
                  <SelectItem value={rb} key={`reg-body-${i}`}>
                    {rb}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <SelectItem key={user._id} value={user.name}>
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
