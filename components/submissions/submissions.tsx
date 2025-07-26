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
import { Badge } from "@/components/ui/badge";

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
  Search,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";
import useStore from "@/lib/store/useStore";
import SubmissionPopup from "./submitdialog";
import ViewPopup from "./viewdialog";
import AssignPopup from "./assigndialog";

export default function SubmissionsPage() {
  const store = useStore();
  const checkpoints = store?.db?.checkpoints;
  const submittedSubmissions = store?.db?.submissions;
  const submissions = [];

  if (checkpoints) {
    checkpoints?.map((cpoint: any) => {
      cpoint.subCheckpoints.map((subpoint: any) => {
        let status = "pending";
        let attachments = [];
        let expectedClosuredate = "";
        let createdAt = "";
        let assignedTo = "";
        let submissionId: "";

        submittedSubmissions?.map((submitted: any) => {
          if (submitted.subCheckpoint === subpoint._id) {
            status = submitted.status;
            attachments = submitted.attachments;
            expectedClosuredate = submitted.expectedClosuredate;
            createdAt = submitted.createdAt;
            assignedTo = submitted.assignedTo;
            submissionId = submitted.id;
          }
        });
        submissions.push({
          id: subpoint._id,
          checkpointId: cpoint._id,
          subCheckpointId: subpoint._id,
          checkpointTitle: cpoint?.title,
          subCheckpointTitle: subpoint?.title,
          letterNumber: cpoint?.letterNumber,
          regulatory: cpoint?.regulatory,
          deadline: subpoint?.deadline,
          type: cpoint.type,
          financialYear: cpoint.financialYear,
          isRemarksRequired: subpoint.isRemarksRequired,
          isAttachmentRequired: subpoint.isAttachmentRequired,
          responseTemplate: subpoint.responseTemplate,
          status: status,
          attachments,
          expectedClosuredate,
          createdAt,
          assignedTo,
          submissionId,
        });
      });
    });
  }

  const [rbiAuditSubmissions, setRbiAuditSubmissions] = useState([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isViewSubmission, setIsViewSubmission] = useState(false);
  const [isAssignDialog, setIsAssignDialog] = useState(false);
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
  const financialYears = [
    "2021-2022",
    "2022-2023",
    "2023-2024",
    "2024-2025",
    "2025-2026",
  ];

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
    // filtered = filtered.filter(
    //   (sub) => sub.financialYear === selectedFinancialYear
    // );

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
    // if (periodFilter !== "all") {
    //   filtered = filtered.filter(
    //     (sub) => sub.period === periodFilter || !sub.period
    //   );
    // }

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
      case "pending_review":
        return <Badge className="bg-green-500">Pending Review</Badge>;
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
                            {submission.status !== "submitted" &&
                              submission.status !== "pending_review" && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      setSelectedSubmission(submission);
                                      setShowSubmitDialog(true);
                                    }}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                  >
                                    Submit
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setSelectedSubmission(submission);
                                      setIsAssignDialog(true);
                                    }}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                  >
                                    Assign
                                  </Button>
                                </div>
                              )}
                            {submission.status !== "pending" && (
                              <Button
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setIsViewSubmission(true);
                                }}
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
      <ViewPopup
        isViewSubmission={isViewSubmission}
        setIsViewSubmission={setIsViewSubmission}
        selectedSubmission={selectedSubmission}
        store={store}
      />
      <AssignPopup
        isAssignDialog={isAssignDialog}
        setIsAssignDialog={setIsAssignDialog}
        selectedSubmission={selectedSubmission}
        store={store}
      />
    </main>
  );
}
