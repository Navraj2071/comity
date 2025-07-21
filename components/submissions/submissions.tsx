"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Upload,
  Search,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Trash2,
} from "lucide-react";
import { updateSubCheckpoint, getRBIObservations } from "@/lib/storage";
import useStore from "@/lib/store/useStore";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function SubmissionsPage() {
  const store = useStore();
  const user = store?.db?.user;
  const checkpoints = store?.db?.checkpoints;

  const submissions = [];

  if (checkpoints) {
    checkpoints?.map((cpoint: any) => {
      cpoint.subCheckpoints.map((subpoint: any) => {
        submissions.push({
          id: subpoint._id,
          checkpointId: cpoint._id,
          subCheckpointId: subpoint._id,
          checkpointTitle: cpoint?.title,
          subCheckpointTitle: subpoint?.title,
          letterNumber: cpoint?.letterNumber,
          regulatory: cpoint?.regulatory,
          assignedTo: subpoint?.assignedTo,
          deadline: subpoint?.deadline,
          status: subpoint?.status,
          submittedBy: "",
          submittedDate: "",
          remarks: subpoint?.remarks,
          attachments: subpoint?.attachments || [],
          expectedClosureDate: null,
          type: cpoint.type,
          financialYear: cpoint.financialYear,
        });
      });
    });
  }

  const [rbiAuditSubmissions, setRbiAuditSubmissions] = useState([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodsFilter] = useState("all");
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [filteredRbiAuditSubmissions, setFilteredRbiAuditSubmissions] =
    useState([]);
  const [activeTab, setActiveTab] = useState("checkpoints");
  const [selectedFinancialYear, setSelectedFinancialYear] =
    useState("2023-2024");
  const financialYears = ["2021-2022", "2022-2023", "2023-2024", "2024-2025"];

  //   useEffect(() => {
  //     const rbiObservations = getRBIObservations();
  //     const userAssignedObservations = rbiObservations
  //       .filter((obs) => obs.assignedTo === user.name && obs.status !== "Closed")
  //       .map((obs) => ({
  //         id: obs.id,
  //         observationNumber: obs.observationNumber,
  //         title: obs.title,
  //         auditCategory: obs.auditCategory || "RMP",
  //         severity: obs.severity,
  //         status: obs.status,
  //         targetDate: obs.targetDate,
  //         progress: obs.progress || 0,
  //         assignedDepartment: obs.assignedDepartment,
  //         description: obs.description,
  //         recommendation: obs.recommendation,
  //         actionTaken: obs.actionTaken || "",
  //         departmentComments: obs.departmentComments || "",
  //         evidenceUploaded: obs.evidenceUploaded || [],
  //       }));

  //     setRbiAuditSubmissions(userAssignedObservations);
  //     setFilteredRbiAuditSubmissions(userAssignedObservations);
  //   }, [user.name]);

  useEffect(() => {
    filterSubmissions();
  }, [
    searchTerm,
    statusFilter,
    typeFilter,
    periodFilter,
    selectedFinancialYear,
  ]);

  //   useEffect(() => {
  //     filterRbiAuditSubmissions();
  //   }, [rbiAuditSubmissions, searchTerm, statusFilter, selectedFinancialYear]);

  const filterSubmissions = () => {
    let filtered = [...submissions];

    // Filter by financial year
    filtered = filtered.filter(
      (sub) => sub.financialYear === selectedFinancialYear
    );

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.checkpointTitle
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          sub.subCheckpointTitle
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          sub.letterNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((sub) => sub.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((sub) => sub.type === typeFilter);
    }

    // Filter by period (for recurring checkpoints)
    if (periodFilter !== "all") {
      filtered = filtered.filter(
        (sub) => sub.period === periodFilter || !sub.period
      );
    }

    // Filter to show only submissions assigned to the current user
    // filtered = filtered.filter((sub) => sub.assignedTo === user.name);

    setFilteredSubmissions(filtered);
  };

  const filterRbiAuditSubmissions = () => {
    let filtered = rbiAuditSubmissions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.observationNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          sub.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      const statusMap = {
        pending: ["Open", "In Progress"],
        submitted: ["Pending Closure"],
        overdue: ["Overdue"],
      };

      if (statusFilter in statusMap) {
        filtered = filtered.filter((sub) =>
          statusMap[statusFilter].includes(sub.status)
        );
      }
    }

    setFilteredRbiAuditSubmissions(filtered);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-500">Pending</Badge>;
      case "submitted":
        return <Badge className="bg-green-500">Submitted</Badge>;
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
      case "Open":
        return <Badge className="bg-blue-500">Open</Badge>;
      case "In Progress":
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case "Pending Closure":
        return <Badge className="bg-orange-500">Pending Closure</Badge>;
      case "Closed":
        return <Badge className="bg-green-500">Closed</Badge>;
      case "Overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getRbiCategoryIcon = (category) => {
    switch (category) {
      case "RMP":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "IRAR":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "SSI":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "MNCR":
        return <AlertOctagon className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Submissions</h1>
            <p className="text-gray-400 mt-1">
              Submit compliance evidence for assigned checkpoints
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-gray-400 text-sm">Financial Year:</Label>
            <Select
              value={selectedFinancialYear}
              onValueChange={setSelectedFinancialYear}
            >
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {financialYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger
              value="checkpoints"
              className="data-[state=active]:bg-gray-700"
            >
              Checkpoint Submissions
            </TabsTrigger>
            <TabsTrigger
              value="rbi-audit"
              className="data-[state=active]:bg-gray-700"
            >
              RBI Audit Submissions
            </TabsTrigger>
          </TabsList>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-900 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-gray-900 border-gray-600 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                {activeTab === "checkpoints" && (
                  <>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40 bg-gray-900 border-gray-600 text-white">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="ad-hoc">Ad-hoc</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={periodFilter}
                      onValueChange={setPeriodsFilter}
                    >
                      <SelectTrigger className="w-40 bg-gray-900 border-gray-600 text-white">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Periods</SelectItem>
                        <SelectItem value="Q1 2023-24">Q1 2023-24</SelectItem>
                        <SelectItem value="Q2 2023-24">Q2 2023-24</SelectItem>
                        <SelectItem value="Q3 2023-24">Q3 2023-24</SelectItem>
                        <SelectItem value="Q4 2023-24">Q4 2023-24</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>

              <TabsContent value="checkpoints" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800">
                      <TableHead className="text-gray-400">
                        Checkpoint
                      </TableHead>
                      <TableHead className="text-gray-400">
                        Sub-Checkpoint
                      </TableHead>
                      <TableHead className="text-gray-400">
                        Letter No.
                      </TableHead>
                      <TableHead className="text-gray-400">
                        Regulatory
                      </TableHead>
                      <TableHead className="text-gray-400">Deadline</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Period</TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.length > 0 ? (
                      filteredSubmissions.map((submission) => (
                        <TableRow
                          key={submission.id}
                          className="border-gray-700 hover:bg-gray-800"
                        >
                          <TableCell className="text-white">
                            {submission.checkpointTitle}
                          </TableCell>
                          <TableCell className="text-white">
                            {submission.subCheckpointTitle}
                          </TableCell>
                          <TableCell className="text-gray-300 font-mono">
                            {submission.letterNumber}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {submission.regulatory}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(submission.deadline).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(submission.status)}
                          </TableCell>
                          <TableCell className="text-gray-300 capitalize">
                            {submission.type}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {submission.period || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {submission.status !== "submitted" && (
                              <Button
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setShowSubmitDialog(true);
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                              >
                                Submit
                              </Button>
                            )}
                            {submission.status === "submitted" && (
                              <Button
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                              >
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="border-gray-700">
                        <TableCell
                          colSpan={9}
                          className="text-center text-gray-400 py-8"
                        >
                          No submissions found matching your filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="rbi-audit" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800">
                      <TableHead className="text-gray-400">
                        Observation No.
                      </TableHead>
                      <TableHead className="text-gray-400">Title</TableHead>
                      <TableHead className="text-gray-400">Category</TableHead>
                      <TableHead className="text-gray-400">Severity</TableHead>
                      <TableHead className="text-gray-400">
                        Target Date
                      </TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Progress</TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRbiAuditSubmissions.length > 0 ? (
                      filteredRbiAuditSubmissions.map((submission) => (
                        <TableRow
                          key={submission.id}
                          className="border-gray-700 hover:bg-gray-800"
                        >
                          <TableCell className="text-white font-mono">
                            {submission.observationNumber}
                          </TableCell>
                          <TableCell className="text-white">
                            {submission.title}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <div className="flex items-center gap-1">
                              {getRbiCategoryIcon(submission.auditCategory)}
                              <span>{submission.auditCategory}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                submission.severity === "Critical"
                                  ? "bg-red-500"
                                  : submission.severity === "High"
                                  ? "bg-orange-500"
                                  : submission.severity === "Medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            >
                              {submission.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(
                              submission.targetDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(submission.status)}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {submission.progress}%
                          </TableCell>
                          <TableCell className="text-right">
                            {submission.status !== "Pending Closure" &&
                              submission.status !== "Closed" && (
                                <Button
                                  onClick={() => {
                                    setSelectedSubmission(submission);
                                    setShowSubmitDialog(true);
                                  }}
                                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                >
                                  Submit
                                </Button>
                              )}
                            {(submission.status === "Pending Closure" ||
                              submission.status === "Closed") && (
                              <Button
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                              >
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="border-gray-700">
                        <TableCell
                          colSpan={8}
                          className="text-center text-gray-400 py-8"
                        >
                          No RBI audit submissions found matching your filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
      <SubmissionPopup
        showSubmitDialog={showSubmitDialog}
        setShowSubmitDialog={setShowSubmitDialog}
        selectedSubmission={selectedSubmission}
        setSelectedSubmission={setSelectedSubmission}
        activeTab={activeTab}
        store={store}
      />
    </main>
  );
}

const SubmissionPopup = ({
  showSubmitDialog,
  setShowSubmitDialog,
  selectedSubmission,
  setSelectedSubmission,
  activeTab,
  store,
}: any) => {
  const api = useapi();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [formdata, setFormdata] = useState({
    remarks: "",
    attachments: [],
    expectedClosureDate: "",
  });

  const handleSubmit = async () => {
    setStatus("");
    setLoading(true);
    const files = [];
    await Promise.all(
      formdata.attachments.map(async (file) => {
        await api
          .fileUpload(file)
          .then((res) => files.push(res.url))
          .catch((err) => console.log(err));
      })
    );

    const apiData = { ...formdata };
    apiData.attachments = files;
    apiData.status = "submitted";
    apiData._id = selectedSubmission.subCheckpointId;
    await api
      .updateSubCheckpoint(apiData)
      .then((res) => {
        setShowSubmitDialog(false);
        store.update("checkpoints");
        setSelectedSubmission(null);
      })
      .catch((err) => console.log(err));

    setLoading(false);
  };

  const handleRbiAuditSubmit = (formData) => {
    if (!selectedSubmission) return;

    const updates = {
      status: "Pending Closure",
      progress: Number.parseInt(formData.get("progress")),
      actionTaken: formData.get("actionTaken"),
      departmentComments: formData.get("departmentComments"),
      evidenceUploaded: ["evidence.pdf"], // In a real app, handle file uploads
    };

    // Update in storage
    updateSubCheckpoint(selectedSubmission.id, updates);

    // Update local state
    setRbiAuditSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubmission.id ? { ...sub, ...updates } : sub
      )
    );

    setShowSubmitDialog(false);
    setSelectedSubmission(null);
  };

  const selectFiles = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.style.display = "none";

      input.onchange = () => {
        const files = input.files;
        if (files && files.length > 0) {
          setFormdata((prev: any) => {
            let newData = { ...prev };
            newData.attachments = Array.from(files);
            return newData;
          });
        }
        document.body.removeChild(input);
      };

      document.body.appendChild(input);
      input.click();
    } catch {}
  };
  return (
    <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Submit Compliance Evidence</DialogTitle>
          <DialogDescription className="text-gray-400">
            {activeTab === "checkpoints"
              ? "Provide evidence and remarks for the selected checkpoint"
              : "Update progress and provide evidence for the RBI audit observation"}
          </DialogDescription>
        </DialogHeader>
        {selectedSubmission && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (activeTab === "checkpoints") {
                handleSubmit();
              } else {
                handleRbiAuditSubmit(new FormData(e.currentTarget));
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label className="text-gray-400">
                {activeTab === "checkpoints" ? "Checkpoint" : "Observation"}
              </Label>
              <p className="text-white font-medium">
                {activeTab === "checkpoints"
                  ? selectedSubmission.checkpointTitle
                  : selectedSubmission.title}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === "checkpoints"
                  ? selectedSubmission.subCheckpointTitle
                  : selectedSubmission.description}
              </p>
            </div>

            {activeTab === "rbi-audit" && (
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  name="progress"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={selectedSubmission.progress}
                  required
                  className="bg-gray-900 border-gray-600"
                />
              </div>
            )}

            <div>
              <Label
                htmlFor={
                  activeTab === "checkpoints" ? "remarks" : "actionTaken"
                }
              >
                {activeTab === "checkpoints" ? "Remarks" : "Action Taken"}
              </Label>
              <Textarea
                id={activeTab === "checkpoints" ? "remarks" : "actionTaken"}
                name={activeTab === "checkpoints" ? "remarks" : "actionTaken"}
                placeholder={
                  activeTab === "checkpoints"
                    ? "Provide details about the compliance evidence"
                    : "Describe actions taken to address the observation"
                }
                required
                className="bg-gray-900 border-gray-600"
                rows={4}
                value={formdata.remarks}
                onChange={(e) =>
                  setFormdata((prev) => {
                    let newValues = { ...prev };
                    newValues.remarks = e.target.value;
                    return newValues;
                  })
                }
              />
            </div>

            {activeTab === "rbi-audit" && (
              <div>
                <Label htmlFor="departmentComments">Department Comments</Label>
                <Textarea
                  id="departmentComments"
                  name="departmentComments"
                  placeholder="Additional comments from the department"
                  className="bg-gray-900 border-gray-600"
                  rows={3}
                  defaultValue={selectedSubmission.departmentComments || ""}
                />
              </div>
            )}

            <div>
              <Label htmlFor="evidence">Upload Evidence</Label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center mt-2">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-400 mb-2">
                  Drop files here or click to browse
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={selectFiles}
                >
                  Choose Files
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, DOCX, XLSX, JPG, PNG (Max 10MB)
                </p>
              </div>
              {formdata.attachments.map((file, i) => (
                <div
                  className="flex items-center justify-between"
                  key={`uploaded-file-${i}`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-gray-400">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormdata((prev) => {
                        let newData = { ...prev };
                        newData.attachments = newData.attachments.filter(
                          (_, index) => index !== i
                        );
                        console.log(newData.attachments);
                        return newData;
                      });
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {activeTab === "checkpoints" && (
              <div>
                <Label htmlFor="expectedClosureDate">
                  Expected Closure Date
                </Label>
                <Input
                  id="expectedClosureDate"
                  name="expectedClosureDate"
                  type="date"
                  required
                  className="bg-gray-900 border-gray-600"
                />
              </div>
            )}

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
                onClick={() => setShowSubmitDialog(false)}
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
                  "Submit Evidence"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
