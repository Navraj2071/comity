"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import useStore from "@/lib/store/useStore";
import SubmissionPopup from "./submitdialog";
import ViewPopup from "./viewdialog";
import AssignPopup from "./assigndialog";
import Checkpointsview from "./checkpointsview";
import Rbiauditview from "./rbiauditview";

export default function SubmissionsPage() {
  const store = useStore();

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [financialYears, setFinancialYears] = useState<any[]>([]);

  const [rbiAuditSubmissions, setRbiAuditSubmissions] = useState([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isViewSubmission, setIsViewSubmission] = useState(false);
  const [isAssignDialog, setIsAssignDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodsFilter] = useState("all");
  const [filteredRbiAuditSubmissions, setFilteredRbiAuditSubmissions] =
    useState([]);
  const [activeTab, setActiveTab] = useState("checkpoints");
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("all");

  const poppulateSubmissions = () => {
    const checkpoints = store?.db?.checkpoints || [];

    let submissionData = [];
    let yearsData = [] as any[];

    if (checkpoints) {
      checkpoints?.map((cpoint: any) => {
        cpoint.subCheckpoints.map((subpoint: any) => {
          let status =
            store?.tools?.getCheckpointStatus(subpoint._id) || "pending";
          let attachments = [] as any[];
          let expectedClosuredate = "";
          let createdAt = "";
          let submissionId = "";
          let remarks = "";
          let expectedClosureDate = "";
          let submittedBy = "";
          let submissionStatus = "";

          const submitted = store?.tools?.getLatestSubmission(subpoint._id);

          if (submitted) {
            attachments = submitted.attachments;
            expectedClosuredate = submitted.expectedClosuredate;
            createdAt = submitted.createdAt;
            submissionId = submitted._id;
            remarks = submitted.remarks;
            expectedClosureDate = submitted.expectedClosureDate;
            submittedBy = store?.tools?.getUserNameFromId(
              submitted.submittedBy
            );
            submissionStatus = submitted.status;
          }

          submissionData.push({
            id: subpoint._id,
            checkpointId: cpoint._id,
            subCheckpointId: subpoint._id,
            checkpointTitle: cpoint?.title,
            subCheckpointTitle: subpoint?.title,
            letterNumber: cpoint?.letterNumber,
            regulatory: store?.tools?.getRegBodyNameFromId(cpoint?.regulatory),
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
            departmentId: subpoint?.department,
            status: status,
            remarks: remarks,
            attachments,
            expectedClosuredate,
            createdAt,
            assignedTo: subpoint.assignedTo,
            submissionId,
            remarksPlaceholder: subpoint?.remarksPlaceholder,
            remarksType: subpoint?.remarksType,
            submissionStatus,
            evidencePlaceholder: subpoint?.evidencePlaceholder,
          });

          if (
            cpoint.financialYear &&
            cpoint.type === "ad-hoc" &&
            !yearsData.includes(cpoint.financialYear)
          ) {
            yearsData.push(cpoint.financialYear);
          }

          setSubmissions(submissionData);
          setFinancialYears(yearsData);
        });
      });
    }
  };

  const poppulateRBIAuditSubmissions = () => {
    setRbiAuditSubmissions(store?.db?.observations);
  };

  useEffect(() => {
    poppulateSubmissions();
    poppulateRBIAuditSubmissions();
  }, [
    store.db.checkpoints,
    store.db.submissions,
    store?.db?.observations,
    store?.db?.user,
  ]);

  const filterRbiAuditSubmissions = () => {
    let filtered = [...rbiAuditSubmissions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (sub: any) =>
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
      } as any;

      if (statusFilter in statusMap) {
        filtered = filtered.filter((sub: any) =>
          statusMap[statusFilter].includes(sub.status)
        );
      }
    }

    // User filter

    const user = store?.db?.user;
    if (user) {
      filtered = filtered.filter((sub: any) => sub.assignedTo === user._id);
    } else {
      filtered = [];
    }

    setFilteredRbiAuditSubmissions(filtered);
  };

  useEffect(() => {
    filterRbiAuditSubmissions();
  }, [rbiAuditSubmissions, searchTerm, statusFilter, store?.db?.user]);

  const getFinancialYear = () => {
    const now = new Date();
    const thisYear = now.getFullYear();
    const nextYear = (thisYear + 1).toString();
    return `${thisYear}-${nextYear[2]}${nextYear[3]}`;
  };
  const finyear = getFinancialYear();

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Submissions</h1>
            <p className="text-gray-400 mt-1">
              Submit compliance evidence for assigned checkpoints
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
                  {financialYears?.map((year) => (
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
                        <SelectItem value="Q1">Q1 {finyear}</SelectItem>
                        <SelectItem value="Q2">Q2 {finyear}</SelectItem>
                        <SelectItem value="Q3">Q3 {finyear}</SelectItem>
                        <SelectItem value="Q4">Q4 {finyear}</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>

              <Checkpointsview
                submissions={submissions}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                typeFilter={typeFilter}
                periodFilter={periodFilter}
                selectedFinancialYear={selectedFinancialYear}
                setSelectedSubmission={setSelectedSubmission}
                setShowSubmitDialog={setShowSubmitDialog}
                setIsAssignDialog={setIsAssignDialog}
                setIsViewSubmission={setIsViewSubmission}
                store={store}
              />
              <Rbiauditview
                filteredRbiAuditSubmissions={filteredRbiAuditSubmissions}
                setSelectedSubmission={setSelectedSubmission}
                setShowSubmitDialog={setShowSubmitDialog}
              />
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
