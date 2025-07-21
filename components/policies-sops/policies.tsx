"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  FileText,
  Upload,
  Download,
  Eye,
  Plus,
  Search,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { getCurrentUser } from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function PoliciesSOPsPage() {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const router = useRouter();

  const [newDocument, setNewDocument] = useState({
    title: "",
    documentNumber: "",
    type: "",
    category: "",
    department: "",
    description: "",
    reviewFrequency: "",
    reviewer: "",
    approver: "",
  });

  // Sample data
  const [documents, setDocuments] = useState([
    {
      id: "pol-001",
      title: "Information Security Policy",
      documentNumber: "ISP-2023-001",
      type: "Policy",
      category: "Information Security",
      department: "IT",
      description:
        "This policy outlines the requirements for securing information assets.",
      status: "Approved",
      createdBy: "John Smith",
      createdDate: "2023-01-15",
      reviewFrequency: "Annually",
      nextReviewDate: "2024-01-15",
      versions: [
        {
          id: "v1-pol-001",
          version: 1.0,
          fileName: "Information_Security_Policy_v1.pdf",
          fileSize: "1.2 MB",
          uploadDate: "2023-01-15",
          uploadedBy: "John Smith",
          changes: "Initial version",
          reviewedBy: "Jane Doe",
          reviewDate: "2023-01-20",
          approvedBy: "Michael Johnson",
          approvalDate: "2023-01-25",
        },
      ],
    },
    {
      id: "sop-001",
      title: "Data Backup Procedure",
      documentNumber: "DBP-2023-001",
      type: "SOP",
      category: "Data Management",
      department: "IT",
      description: "Standard operating procedure for data backup and recovery.",
      status: "Approved",
      createdBy: "Jane Doe",
      createdDate: "2023-02-10",
      reviewFrequency: "Quarterly",
      nextReviewDate: "2023-08-10",
      versions: [
        {
          id: "v1-sop-001",
          version: 1.0,
          fileName: "Data_Backup_Procedure_v1.pdf",
          fileSize: "0.8 MB",
          uploadDate: "2023-02-10",
          uploadedBy: "Jane Doe",
          changes: "Initial version",
          reviewedBy: "John Smith",
          reviewDate: "2023-02-15",
          approvedBy: "Michael Johnson",
          approvalDate: "2023-02-20",
        },
        {
          id: "v2-sop-001",
          version: 2.0,
          fileName: "Data_Backup_Procedure_v2.pdf",
          fileSize: "0.9 MB",
          uploadDate: "2023-05-10",
          uploadedBy: "Jane Doe",
          changes: "Updated recovery procedures and added cloud backup section",
          reviewedBy: "John Smith",
          reviewDate: "2023-05-15",
          approvedBy: "Michael Johnson",
          approvalDate: "2023-05-20",
        },
      ],
    },
    {
      id: "pol-002",
      title: "Password Management Policy",
      documentNumber: "PMP-2023-002",
      type: "Policy",
      category: "Information Security",
      department: "IT",
      description: "Policy for secure password creation and management.",
      status: "Under Review",
      createdBy: "Michael Johnson",
      createdDate: "2023-03-05",
      reviewFrequency: "Bi-annually",
      nextReviewDate: "2023-09-05",
      versions: [
        {
          id: "v1-pol-002",
          version: 1.0,
          fileName: "Password_Management_Policy_v1.pdf",
          fileSize: "0.7 MB",
          uploadDate: "2023-03-05",
          uploadedBy: "Michael Johnson",
          changes: "Initial version",
          reviewedBy: "Jane Doe",
          reviewDate: "2023-03-10",
        },
      ],
    },
    {
      id: "sop-002",
      title: "Incident Response Procedure",
      documentNumber: "IRP-2023-002",
      type: "SOP",
      category: "Security Operations",
      department: "Security",
      description: "Procedure for responding to security incidents.",
      status: "Draft",
      createdBy: "Sarah Williams",
      createdDate: "2023-06-20",
      reviewFrequency: "Quarterly",
      nextReviewDate: "2023-09-20",
      versions: [
        {
          id: "v1-sop-002",
          version: 1.0,
          fileName: "Incident_Response_Procedure_v1.pdf",
          fileSize: "1.5 MB",
          uploadDate: "2023-06-20",
          uploadedBy: "Sarah Williams",
          changes: "Initial draft",
        },
      ],
    },
    {
      id: "pol-003",
      title: "Data Classification Policy",
      documentNumber: "DCP-2023-003",
      type: "Policy",
      category: "Data Management",
      department: "Compliance",
      description:
        "Policy for classifying data based on sensitivity and importance.",
      status: "Approved",
      createdBy: "Robert Brown",
      createdDate: "2023-04-12",
      reviewFrequency: "Annually",
      nextReviewDate: "2023-07-12",
      versions: [
        {
          id: "v1-pol-003",
          version: 1.0,
          fileName: "Data_Classification_Policy_v1.pdf",
          fileSize: "1.1 MB",
          uploadDate: "2023-04-12",
          uploadedBy: "Robert Brown",
          changes: "Initial version",
          reviewedBy: "Michael Johnson",
          reviewDate: "2023-04-18",
          approvedBy: "Jane Doe",
          approvalDate: "2023-04-25",
        },
      ],
    },
  ]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
  }, [router]);

  // Filter documents based on search term and filters
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || doc.type === filterType;
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    const matchesDepartment =
      filterDepartment === "all" || doc.department === filterDepartment;

    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = Array.from(
    new Set(documents.map((doc) => doc.department))
  );

  // Count documents by review status
  const today = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  const overdueCount = documents.filter(
    (doc) => new Date(doc.nextReviewDate) < today
  ).length;

  const upcomingCount = documents.filter((doc) => {
    const reviewDate = new Date(doc.nextReviewDate);
    return reviewDate >= today && reviewDate <= threeMonthsFromNow;
  }).length;

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-600 text-white";
      case "Under Review":
        return "bg-yellow-600 text-white";
      case "Approved":
        return "bg-green-600 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  // Get review status
  const getReviewStatus = (nextReviewDate: string) => {
    const reviewDate = new Date(nextReviewDate);

    if (reviewDate < today) {
      return <Badge className="bg-red-600 text-white ml-2">Overdue</Badge>;
    } else if (reviewDate <= threeMonthsFromNow) {
      return <Badge className="bg-yellow-600 text-white ml-2">Due Soon</Badge>;
    }
    return null;
  };

  const handleCreateDocument = () => {
    if (
      !newDocument.title ||
      !newDocument.type ||
      !newDocument.department ||
      !newDocument.reviewer ||
      !newDocument.approver
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const today = new Date();
    const nextReviewDate = new Date();

    // Calculate next review date based on frequency
    switch (newDocument.reviewFrequency) {
      case "Quarterly":
        nextReviewDate.setMonth(today.getMonth() + 3);
        break;
      case "Bi-annually":
        nextReviewDate.setMonth(today.getMonth() + 6);
        break;
      case "Annually":
        nextReviewDate.setFullYear(today.getFullYear() + 1);
        break;
      default:
        nextReviewDate.setFullYear(today.getFullYear() + 1);
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      title: newDocument.title,
      documentNumber:
        newDocument.documentNumber ||
        `${newDocument.type.toUpperCase()}-${new Date().getFullYear()}-${String(
          documents.length + 1
        ).padStart(3, "0")}`,
      type: newDocument.type,
      category: newDocument.category,
      department: newDocument.department,
      description: newDocument.description,
      status: "Draft",
      createdBy: user.name,
      createdDate: today.toISOString().split("T")[0],
      reviewFrequency: newDocument.reviewFrequency,
      nextReviewDate: nextReviewDate.toISOString().split("T")[0],
      reviewer: newDocument.reviewer,
      approver: newDocument.approver,
      approvalDate: null,
      versions: [
        {
          id: `v1-doc-${Date.now()}`,
          version: 1.0,
          fileName: `${newDocument.title.replace(/\s+/g, "_")}_v1.pdf`,
          fileSize: "1.0 MB",
          uploadDate: today.toISOString().split("T")[0],
          uploadedBy: user.name,
          changes: "Initial version",
          reviewedBy: null,
          reviewDate: null,
          approvedBy: null,
          approvalDate: null,
        },
      ],
    };

    setDocuments([...documents, newDoc]);
    setNewDocument({
      title: "",
      documentNumber: "",
      type: "",
      category: "",
      department: "",
      description: "",
      reviewFrequency: "",
      reviewer: "",
      approver: "",
    });
    setIsCreateDialogOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Policies & SOPs
              </h1>
              <p className="text-gray-400">
                Manage organizational policies and standard operating procedures
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Documents</p>
                      <p className="text-2xl font-bold text-white">
                        {documents.length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Due Soon</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {upcomingCount}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Overdue</p>
                      <p className="text-2xl font-bold text-red-400">
                        {overdueCount}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">
                      Document Library
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage policies and standard operating procedures
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-yellow-500 hover:bg-yellow-600">
                        <Plus className="h-4 w-4 mr-2" />
                        New Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Policy/SOP</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Create a new policy or standard operating procedure
                          document.
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
                                setNewDocument({
                                  ...newDocument,
                                  title: e.target.value,
                                })
                              }
                              className="bg-gray-700 border-gray-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="documentNumber">
                              Document Number
                            </Label>
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
                                setNewDocument({
                                  ...newDocument,
                                  category: e.target.value,
                                })
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
                                setNewDocument({
                                  ...newDocument,
                                  department: value,
                                })
                              }
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                {departments.map((dept) => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reviewFrequency">
                              Review Frequency
                            </Label>
                            <Select
                              value={newDocument.reviewFrequency}
                              onValueChange={(value) =>
                                setNewDocument({
                                  ...newDocument,
                                  reviewFrequency: value,
                                })
                              }
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="Quarterly">
                                  Quarterly
                                </SelectItem>
                                <SelectItem value="Bi-annually">
                                  Bi-annually
                                </SelectItem>
                                <SelectItem value="Annually">
                                  Annually
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="reviewer">Reviewer</Label>
                            <Select
                              value={newDocument.reviewer}
                              onValueChange={(value) =>
                                setNewDocument({
                                  ...newDocument,
                                  reviewer: value,
                                })
                              }
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select reviewer" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="Rohit Agarwal">
                                  Rohit Agarwal
                                </SelectItem>
                                <SelectItem value="Sneha Gupta">
                                  Sneha Gupta
                                </SelectItem>
                                <SelectItem value="Rajesh Kumar">
                                  Rajesh Kumar
                                </SelectItem>
                                <SelectItem value="Meera Patel">
                                  Meera Patel
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="approver">Approver</Label>
                            <Select
                              value={newDocument.approver}
                              onValueChange={(value) =>
                                setNewDocument({
                                  ...newDocument,
                                  approver: value,
                                })
                              }
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select approver" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Priya Sharma">
                                  Priya Sharma
                                </SelectItem>
                                <SelectItem value="Rohit Agarwal">
                                  Rohit Agarwal
                                </SelectItem>
                                <SelectItem value="Vikram Singh">
                                  Vikram Singh
                                </SelectItem>
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
                              setNewDocument({
                                ...newDocument,
                                description: e.target.value,
                              })
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
                            />
                          </div>
                          <p className="text-xs text-gray-400">
                            Supported formats: PDF, DOC, DOCX (Max 10MB)
                          </p>
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
                          onClick={handleCreateDocument}
                          className="bg-yellow-500 hover:bg-yellow-600"
                        >
                          Create Document
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-wrap items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-36 bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Policy">Policy</SelectItem>
                      <SelectItem value="SOP">SOP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterDepartment}
                    onValueChange={setFilterDepartment}
                  >
                    <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Documents Table */}
                <div className="rounded-md border border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Title</TableHead>
                        <TableHead className="text-gray-300">
                          Document #
                        </TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">
                          Department
                        </TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">
                          Next Review
                        </TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => (
                          <TableRow key={doc.id} className="border-gray-700">
                            <TableCell className="font-medium text-white">
                              {doc.title}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {doc.documentNumber}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-gray-600 text-white">
                                {doc.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {doc.department}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusBadgeColor(doc.status)}
                              >
                                {doc.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              <div className="flex items-center">
                                {new Date(
                                  doc.nextReviewDate
                                ).toLocaleDateString()}
                                {getReviewStatus(doc.nextReviewDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300"
                                  onClick={() => setSelectedDocument(doc)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-400 hover:text-green-300"
                                  onClick={() => {
                                    // Download logic would go here
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-yellow-400 hover:text-yellow-300"
                                  onClick={() => {
                                    setSelectedDocument(doc);
                                    setIsVersionDialogOpen(true);
                                  }}
                                >
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-4 text-gray-400"
                          >
                            No documents found matching your criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Document Details Dialog */}
      <Dialog
        open={!!selectedDocument}
        onOpenChange={() => setSelectedDocument(null)}
      >
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedDocument?.documentNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Document Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <Badge
                        className={
                          selectedDocument.type === "Policy"
                            ? "bg-blue-600"
                            : "bg-purple-600"
                        }
                      >
                        {selectedDocument.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white">
                        {selectedDocument.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Department:</span>
                      <span className="text-white">
                        {selectedDocument.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge
                        className={getStatusBadgeColor(selectedDocument.status)}
                      >
                        {selectedDocument.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Review Frequency:</span>
                      <span className="text-white">
                        {selectedDocument.reviewFrequency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Next Review:</span>
                      <div className="flex items-center">
                        <span className="text-white">
                          {new Date(
                            selectedDocument.nextReviewDate
                          ).toLocaleDateString()}
                        </span>
                        {getReviewStatus(selectedDocument.nextReviewDate)}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reviewer:</span>
                      <span className="text-white">
                        {selectedDocument.reviewer || "Not assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Approver:</span>
                      <span className="text-white">
                        {selectedDocument.approver || "Not assigned"}
                      </span>
                    </div>
                    {selectedDocument.approvalDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Approval Date:</span>
                        <span className="text-white">
                          {new Date(
                            selectedDocument.approvalDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-gray-300">
                    {selectedDocument.description}
                  </p>
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">
                      Document History
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created By:</span>
                        <span className="text-white">
                          {selectedDocument.createdBy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created Date:</span>
                        <span className="text-white">
                          {new Date(
                            selectedDocument.createdDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Version:</span>
                        <span className="text-white">
                          v{selectedDocument.versions[0].version}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  Version History
                </h3>
                <div className="space-y-3">
                  {selectedDocument.versions.map((version, index) => (
                    <div
                      key={version.id}
                      className="p-3 bg-gray-700 rounded-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium text-white">
                            Version {version.version}
                          </span>
                          {index === 0 && (
                            <Badge className="ml-2 bg-blue-600 text-white text-xs">
                              Latest
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">
                        Uploaded on{" "}
                        {new Date(version.uploadDate).toLocaleDateString()} by{" "}
                        {version.uploadedBy}
                      </p>
                      <p className="text-sm text-gray-300 mb-2">
                        {version.changes}
                      </p>
                      {version.approvalDate && (
                        <div className="flex items-center text-xs text-green-400">
                          <span>
                            Approved on{" "}
                            {new Date(
                              version.approvalDate
                            ).toLocaleDateString()}{" "}
                            by {version.approvedBy}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Latest
                </Button>
                {selectedDocument.status === "Draft" && (
                  <Button className="bg-yellow-500 hover:bg-yellow-600">
                    Submit for Review
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Version Dialog */}
      <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Upload New Version</DialogTitle>
            <DialogDescription className="text-gray-400">
              Upload a new version of "{selectedDocument?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Document File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx"
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="changes">Changes Made</Label>
              <Textarea
                id="changes"
                placeholder="Describe the changes made in this version"
                rows={3}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsVersionDialogOpen(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsVersionDialogOpen(false)}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Upload Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
