import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus } from "lucide-react";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

const CreateDocumentDialog = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  store,
}: any) => {
  const api = useapi();
  const departments = store?.db?.departments || [];
  const users = store?.db?.allUsers || [];
  const [newDocument, setNewDocument] = useState({
    title: "",
    documentNumber: "",
    type: "",
    category: "",
    department: "",
    description: "",
    reviewFrequency: "",
    versions: [
      {
        version: "1.0",
        fileName: "",
        fileSize: "",
        changes: "Initial version",
        reviewedBy: "",
        approvedBy: "",
        file: "",
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleCreateDocument = async () => {
    console.log(newDocument);
    let isValid = true;
    Object.keys(newDocument).map((key) => {
      if (newDocument[key] === "") isValid = false;
    });
    Object.keys(newDocument.versions[0]).map((key) => {
      if (!newDocument.versions[0][key] || newDocument.versions[0][key] === "")
        isValid = false;
    });
    if (!isValid) {
      setStatus("All fields are required.");
      return;
    }
    setStatus("");

    setLoading(true);
    let apidata = { ...newDocument };
    const url = await api
      .fileUpload(apidata.versions[0].file)
      .then((res) => res.url)
      .catch((err) => "");
    apidata.versions[0].file = url;
    await api
      .createSop(apidata)
      .then((res) => {
        console.log(res);
        store.update("sops");
        setIsCreateDialogOpen(false);
      })
      .catch((err) => setStatus(err));
    setLoading(false);
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl overflow-y-scroll max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Policy/SOP</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new policy or standard operating procedure document.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                value={newDocument.title}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, title: e.target.value })
                }
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentNumber">Document Number</Label>
              <Input
                id="documentNumber"
                placeholder="e.g., POL-2023-001"
                value={newDocument.documentNumber}
                onChange={(e) =>
                  setNewDocument({
                    ...newDocument,
                    documentNumber: e.target.value,
                  })
                }
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Document Type</Label>
              <Select
                value={newDocument.type}
                onValueChange={(value) =>
                  setNewDocument({ ...newDocument, type: value })
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="SOP">SOP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Information Security"
                value={newDocument.category}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, category: e.target.value })
                }
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={newDocument.department}
                onValueChange={(value) =>
                  setNewDocument({ ...newDocument, department: value })
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {departments.map((dept: any) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewFrequency">Review Frequency</Label>
              <Select
                value={newDocument.reviewFrequency}
                onValueChange={(value) =>
                  setNewDocument({ ...newDocument, reviewFrequency: value })
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Bi-annually">Bi-annually</SelectItem>
                  <SelectItem value="Annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select
                value={newDocument.versions[0].reviewedBy}
                onValueChange={(value) =>
                  setNewDocument((prev) => {
                    let newdata = { ...prev };
                    newdata.versions[0].reviewedBy = value;
                    return newdata;
                  })
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {users.map((user: any) => (
                    <SelectItem value={user?._id} key={`reviewer-${user._id}`}>
                      {user.name} from {user.department} {"("}
                      {user.role}
                      {")"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="approver">Approver</Label>
              <Select
                value={newDocument.versions[0].approvedBy}
                onValueChange={(value) =>
                  setNewDocument((prev) => {
                    let newdata = { ...prev };
                    newdata.versions[0].approvedBy = value;
                    return newdata;
                  })
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select approver" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {users.map((user: any) => (
                    <SelectItem value={user?._id} key={`approver-${user._id}`}>
                      {user.name} from {user.department} {"("}
                      {user.role}
                      {")"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter document description"
              value={newDocument.description}
              onChange={(e) =>
                setNewDocument({ ...newDocument, description: e.target.value })
              }
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Upload Document</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx"
                className="bg-gray-700 border-gray-600"
                onChange={(e) => {
                  setNewDocument((prev) => {
                    let newdata = { ...prev };
                    newdata.versions[0].file = e.target.files[0];
                    newdata.versions[0].fileName = e.target.files[0].name;
                    newdata.versions[0].fileSize = e.target.files[0].size;
                    return newdata;
                  });
                }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {newDocument.versions[0].file
                ? `Selected File: ${newDocument.versions[0].file.name}`
                : "Supported formats: PDF, DOC, DOCX (Max 10MB)"}
            </p>
          </div>
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
            onClick={() => setIsCreateDialogOpen(false)}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateDocument}
            className="bg-yellow-500 hover:bg-yellow-600"
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
              "Create Document"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocumentDialog;
