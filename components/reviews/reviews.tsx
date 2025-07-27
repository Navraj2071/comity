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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  ClipboardCheck,
  FileSearch,
} from "lucide-react";
import { getRBIObservations, updateRBIObservation } from "@/lib/storage";
import useStore from "@/lib/store/useStore";
import ViewPopup from "../submissions/viewdialog";
import Checkpointsview from "./checkpointsview";
import Rbiauditview from "./rbiauditview";
import ReviewDialog from "./submitreview";

export default function ReviewsPage() {
  const store = useStore();
  const [rbiAuditReviews, setRbiAuditReviews] = useState([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodsFilter] = useState("all");
  const [filteredRbiAuditReviews, setFilteredRbiAuditReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("checkpoints");
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("all");
  const [isViewSubmission, setIsViewSubmission] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [financialYears, setFinancialYears] = useState<any[]>([]);

  const poppulateReviews = () => {
    const checkpoints = store?.db?.checkpoints;
    const submittedSubmissions = store?.db?.submissions;

    let submissionData = [];
    let yearsData = [];

    if (checkpoints) {
      checkpoints?.map((cpoint: any) => {
        cpoint.subCheckpoints.map((subpoint: any) => {
          let status = "pending";
          let attachments = [];
          let expectedClosuredate = "";
          let createdAt = "";
          let assignedTo = "";
          let submissionId: "";
          let remarks = "";
          let expectedClosureDate = "";
          let submittedBy = "";
          let submittedDate = "";

          submittedSubmissions?.map((submitted: any) => {
            if (submitted.subCheckpoint === subpoint._id) {
              status = submitted.status;
              attachments = submitted.attachments;
              expectedClosuredate = submitted.expectedClosuredate;
              createdAt = submitted.createdAt;
              assignedTo = submitted.assignedTo;
              submissionId = submitted._id;
              remarks = submitted.remarks;
              expectedClosureDate = submitted.expectedClosureDate;
              submittedBy = store?.tools?.getUserNameFromId(
                submitted.submittedBy
              );
              submittedDate = new Date(submitted.createdAt).toLocaleString();

              submissionData.push({
                id: subpoint._id,
                checkpointId: cpoint._id,
                subCheckpointId: subpoint._id,
                checkpointTitle: cpoint?.title,
                subCheckpointTitle: subpoint?.title,
                letterNumber: cpoint?.letterNumber,
                regulatory: store?.tools?.getRegBodyNameFromId(
                  cpoint?.regulatory
                ),
                deadline: subpoint?.deadline,
                type: cpoint.type,
                financialYear: cpoint.financialYear,
                isRemarksRequired: subpoint.isRemarksRequired,
                isAttachmentRequired: subpoint.isAttachmentRequired,
                responseTemplate: subpoint.responseTemplate,
                frequency: cpoint?.frequency,
                department: store?.tools?.getDepartmentNameFromId(
                  subpoint?.department
                ),
                submittedDate: submittedDate,
                submittedBy: submittedBy,
                status: status,
                remarks: remarks,
                attachments,
                expectedClosuredate,
                createdAt,
                assignedTo,
                submissionId,
              });

              if (
                cpoint.financialYear &&
                cpoint.type === "ad-hoc" &&
                !yearsData.includes(cpoint.financialYear)
              ) {
                yearsData.push(cpoint.financialYear);
              }
            }
          });

          setReviews(submissionData);
          setFinancialYears(yearsData);
        });
      });
    }
  };

  useEffect(() => {
    poppulateReviews();
  }, [store.db.checkpoints, store.db.submissions]);

  // useEffect(() => {
  //   // Load RBI audit reviews
  //   const rbiObservations = getRBIObservations();
  //   const pendingReviewObservations = rbiObservations
  //     .filter((obs) => obs.status === "Pending Closure")
  //     .map((obs) => ({
  //       id: obs.id,
  //       observationNumber: obs.observationNumber,
  //       title: obs.title,
  //       auditCategory: obs.auditCategory || "RMP",
  //       severity: obs.severity,
  //       status: obs.status,
  //       targetDate: obs.targetDate,
  //       progress: obs.progress || 0,
  //       assignedDepartment: obs.assignedDepartment,
  //       assignedTo: obs.assignedTo,
  //       description: obs.description,
  //       recommendation: obs.recommendation,
  //       actionTaken: obs.actionTaken || "",
  //       departmentComments: obs.departmentComments || "",
  //       evidenceUploaded: obs.evidenceUploaded || [],
  //       submittedDate: obs.lastUpdated,
  //     }));

  //   setRbiAuditReviews(pendingReviewObservations);
  //   setFilteredRbiAuditReviews(pendingReviewObservations);
  // }, []);

  // useEffect(() => {
  //   filterRbiAuditReviews();
  // }, [rbiAuditReviews, searchTerm, statusFilter, selectedFinancialYear]);

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

  const getRbiCategoryIcon = (category: string) => {
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

  const getFinancialYear = () => {
    const now = new Date();
    const thisYear = now.getFullYear();
    const nextYear = (thisYear + 1).toString();
    return `${thisYear}-${nextYear[2]}${nextYear[3]}`;
  };
  const finyear = getFinancialYear();

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
          {typeFilter !== "recurring" && (
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
                  <SelectItem value={"all"}>All</SelectItem>
                  {financialYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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

              <Checkpointsview
                submissions={reviews}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                typeFilter={typeFilter}
                periodFilter={periodFilter}
                selectedFinancialYear={selectedFinancialYear}
                setSelectedReview={setSelectedReview}
                setShowReviewDialog={setShowReviewDialog}
                setIsViewSubmission={setIsViewSubmission}
              />

              {/* <Rbiauditview/> */}
            </CardContent>
          </Card>
        </Tabs>
      </div>
      <ReviewDialog
        showReviewDialog={showReviewDialog}
        setShowReviewDialog={setShowReviewDialog}
        activeTab={activeTab}
        selectedReview={selectedReview}
        store={store}
      />
      <ViewPopup
        isViewSubmission={isViewSubmission}
        setIsViewSubmission={setIsViewSubmission}
        selectedSubmission={selectedReview}
        store={store}
      />
    </main>
  );
}
