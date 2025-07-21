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
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  ClipboardCheck,
  FileSearch,
} from "lucide-react";
import { getRBIObservations, updateRBIObservation } from "@/lib/storage";
import useStore from "@/lib/store/useStore";

export default function ReviewsPage() {
  const store = useStore();
  const user = store?.db?.user;
  const checkpoints = store?.db?.checkpoints;

  const reviews = [];

  checkpoints?.map((cpoint) => {
    cpoint.subCheckpoints.map((subpoint) => {
      reviews.push({
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
        remarks: "",
        attachments: subpoint?.attachments || [],
        expectedClosureDate: null,
        type: cpoint.type,
        financialYear: cpoint.financialYear,
      });
    });
  });

  const [rbiAuditReviews, setRbiAuditReviews] = useState([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodsFilter] = useState("all");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filteredRbiAuditReviews, setFilteredRbiAuditReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("checkpoints");
  const [selectedFinancialYear, setSelectedFinancialYear] =
    useState("2023-2024");
  const financialYears = ["2021-2022", "2022-2023", "2023-2024", "2024-2025"];

  useEffect(() => {
    // Load RBI audit reviews
    const rbiObservations = getRBIObservations();
    const pendingReviewObservations = rbiObservations
      .filter((obs) => obs.status === "Pending Closure")
      .map((obs) => ({
        id: obs.id,
        observationNumber: obs.observationNumber,
        title: obs.title,
        auditCategory: obs.auditCategory || "RMP",
        severity: obs.severity,
        status: obs.status,
        targetDate: obs.targetDate,
        progress: obs.progress || 0,
        assignedDepartment: obs.assignedDepartment,
        assignedTo: obs.assignedTo,
        description: obs.description,
        recommendation: obs.recommendation,
        actionTaken: obs.actionTaken || "",
        departmentComments: obs.departmentComments || "",
        evidenceUploaded: obs.evidenceUploaded || [],
        submittedDate: obs.lastUpdated,
      }));

    setRbiAuditReviews(pendingReviewObservations);
    setFilteredRbiAuditReviews(pendingReviewObservations);
  }, []);

  useEffect(() => {
    filterReviews();
  }, [
    searchTerm,
    statusFilter,
    typeFilter,
    periodFilter,
    selectedFinancialYear,
  ]);

  useEffect(() => {
    filterRbiAuditReviews();
  }, [rbiAuditReviews, searchTerm, statusFilter, selectedFinancialYear]);

  const filterReviews = () => {
    let filtered = reviews;

    // Filter by financial year
    filtered = filtered.filter(
      (rev) => rev.financialYear === selectedFinancialYear
    );

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (rev) =>
          rev.checkpointTitle
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          rev.subCheckpointTitle
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          rev.letterNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((rev) => rev.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((rev) => rev.type === typeFilter);
    }

    // Filter by period (for recurring checkpoints)
    if (periodFilter !== "all") {
      filtered = filtered.filter(
        (rev) => rev.period === periodFilter || !rev.period
      );
    }

    setFilteredReviews(filtered);
  };

  const filterRbiAuditReviews = () => {
    let filtered = rbiAuditReviews;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (rev) =>
          rev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rev.observationNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          rev.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRbiAuditReviews(filtered);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending_review":
        return <Badge className="bg-blue-500">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "Pending Closure":
        return <Badge className="bg-orange-500">Pending Closure</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getRbiCategoryIcon = (category) => {
    switch (category) {
      case "RMP":
        return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
      case "IRAR":
        return <ClipboardCheck className="h-4 w-4 text-green-500" />;
      case "SSI":
        return <FileSearch className="h-4 w-4 text-blue-500" />;
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
            <h1 className="text-3xl font-bold text-white">Reviews</h1>
            <p className="text-gray-400 mt-1">
              Review and approve compliance submissions
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
              Checkpoint Reviews
            </TabsTrigger>
            <TabsTrigger
              value="rbi-audit"
              className="data-[state=active]:bg-gray-700"
            >
              RBI Audit Reviews
            </TabsTrigger>
          </TabsList>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search reviews..."
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
                    <SelectItem value="pending_review">
                      Pending Review
                    </SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
                      <TableHead className="text-gray-400">
                        Submitted By
                      </TableHead>
                      <TableHead className="text-gray-400">
                        Submitted Date
                      </TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Period</TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews?.length > 0 ? (
                      filteredReviews?.map((review) => (
                        <TableRow
                          key={review?.id}
                          className="border-gray-700 hover:bg-gray-800"
                        >
                          <TableCell className="text-white">
                            {review.checkpointTitle}
                          </TableCell>
                          <TableCell className="text-white">
                            {review.subCheckpointTitle}
                          </TableCell>
                          <TableCell className="text-gray-300 font-mono">
                            {review.letterNumber}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {review.regulatory}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {review.submittedBy}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(
                              review.submittedDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(review.status)}</TableCell>
                          <TableCell className="text-gray-300 capitalize">
                            {review.type}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {review.period || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {review.status === "pending_review" && (
                              <Button
                                onClick={() => {
                                  setSelectedReview(review);
                                  setShowReviewDialog(true);
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                              >
                                Review
                              </Button>
                            )}
                            {review.status !== "pending_review" && (
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
                          colSpan={10}
                          className="text-center text-gray-400 py-8"
                        >
                          No reviews found matching your filters
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
                        Assigned To
                      </TableHead>
                      <TableHead className="text-gray-400">
                        Department
                      </TableHead>
                      <TableHead className="text-gray-400">
                        Submitted Date
                      </TableHead>
                      <TableHead className="text-gray-400">Progress</TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRbiAuditReviews.length > 0 ? (
                      filteredRbiAuditReviews.map((review) => (
                        <TableRow
                          key={review?.id}
                          className="border-gray-700 hover:bg-gray-800"
                        >
                          <TableCell className="text-white font-mono">
                            {review?.observationNumber}
                          </TableCell>
                          <TableCell className="text-white">
                            {review?.title}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <div className="flex items-center gap-1">
                              {getRbiCategoryIcon(review.auditCategory)}
                              <span>{review.auditCategory}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                review.severity === "Critical"
                                  ? "bg-red-500"
                                  : review.severity === "High"
                                  ? "bg-orange-500"
                                  : review.severity === "Medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            >
                              {review.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {review.assignedTo}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {review.assignedDepartment}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(
                              review.submittedDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {review.progress}%
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => {
                                setSelectedReview(review);
                                setShowReviewDialog(true);
                              }}
                              className="bg-yellow-500 hover:bg-yellow-600 text-black"
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="border-gray-700">
                        <TableCell
                          colSpan={9}
                          className="text-center text-gray-400 py-8"
                        >
                          No RBI audit reviews pending
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
      <ReviewDialog
        showReviewDialog={showReviewDialog}
        setShowReviewDialog={setShowReviewDialog}
        activeTab={activeTab}
        selectedReview={selectedReview}
      />
    </main>
  );
}

const ReviewDialog = ({
  showReviewDialog,
  setShowReviewDialog,
  activeTab,
  selectedReview,
}: any) => {
  return (
    <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Review Submission</DialogTitle>
          <DialogDescription className="text-gray-400">
            {activeTab === "checkpoints"
              ? "Review the compliance evidence and approve or reject the submission"
              : "Review the RBI audit observation evidence and approve or reject the closure"}
          </DialogDescription>
        </DialogHeader>
        {selectedReview && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReview(new FormData(e.currentTarget));
            }}
            className="space-y-4"
          >
            <div>
              <Label className="text-gray-400">
                {activeTab === "checkpoints" ? "Checkpoint" : "Observation"}
              </Label>
              <p className="text-white font-medium">
                {activeTab === "checkpoints"
                  ? selectedReview.checkpointTitle
                  : selectedReview.title}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === "checkpoints"
                  ? selectedReview.subCheckpointTitle
                  : selectedReview.description}
              </p>
            </div>

            <div>
              <Label className="text-gray-400">Submitted By</Label>
              <p className="text-white">
                {activeTab === "checkpoints"
                  ? selectedReview.submittedBy
                  : selectedReview.assignedTo}
              </p>
            </div>

            <div>
              <Label className="text-gray-400">
                {activeTab === "checkpoints" ? "Remarks" : "Action Taken"}
              </Label>
              <div className="bg-gray-900 border border-gray-600 rounded-md p-3 mt-1">
                <p className="text-white">
                  {activeTab === "checkpoints"
                    ? selectedReview.remarks
                    : selectedReview.actionTaken}
                </p>
              </div>
            </div>

            {activeTab === "rbi-audit" && selectedReview.departmentComments && (
              <div>
                <Label className="text-gray-400">Department Comments</Label>
                <div className="bg-gray-900 border border-gray-600 rounded-md p-3 mt-1">
                  <p className="text-white">
                    {selectedReview.departmentComments}
                  </p>
                </div>
              </div>
            )}

            <div>
              <Label className="text-gray-400">Attachments</Label>
              <div className="bg-gray-900 border border-gray-600 rounded-md p-3 mt-1">
                {(selectedReview.attachments &&
                  selectedReview.attachments.length > 0) ||
                (selectedReview.evidenceUploaded &&
                  selectedReview.evidenceUploaded.length > 0) ? (
                  <div className="space-y-2">
                    {(activeTab === "checkpoints"
                      ? selectedReview.attachments
                      : selectedReview.evidenceUploaded
                    ).map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-blue-400"
                      >
                        <FileText className="h-4 w-4" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No attachments provided</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="decision" className="text-gray-400">
                Decision
              </Label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="approve"
                    name="decision"
                    value="approve"
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 bg-gray-900"
                    required
                  />
                  <Label
                    htmlFor="approve"
                    className="ml-2 text-white flex items-center gap-1"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {activeTab === "checkpoints"
                      ? "Approve"
                      : "Close Observation"}
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="reject"
                    name="decision"
                    value="reject"
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 bg-gray-900"
                    required
                  />
                  <Label
                    htmlFor="reject"
                    className="ml-2 text-white flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
                    {activeTab === "checkpoints"
                      ? "Reject"
                      : "Return for Revision"}
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="reviewComments">Review Comments</Label>
              <Textarea
                id="reviewComments"
                name="reviewComments"
                placeholder="Provide your review comments"
                required
                className="bg-gray-900 border-gray-600"
                rows={4}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Submit Review
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
