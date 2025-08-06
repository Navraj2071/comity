import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNextDeadline } from "@/lib/tools";

const Checkpointsview = ({
  submissions,
  searchTerm,
  statusFilter,
  typeFilter,
  periodFilter,
  selectedFinancialYear,
  setSelectedSubmission,
  setShowSubmitDialog,
  setIsAssignDialog,
  setIsViewSubmission,
  store,
}: any) => {
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([]);

  useEffect(() => {
    filterSubmissions();
  }, [
    searchTerm,
    statusFilter,
    typeFilter,
    periodFilter,
    selectedFinancialYear,
    submissions,
    store?.db?.user,
  ]);

  const filterSubmissions = () => {
    let filtered = [...submissions];

    if (selectedFinancialYear !== "all" && typeFilter !== "recurring") {
      filtered = filtered.filter(
        (sub) =>
          sub.type === "recurring" ||
          sub.financialYear === selectedFinancialYear
      );
    }

    // Filter by search term
    if (searchTerm && searchTerm !== "") {
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
      filtered = filtered.filter((sub) => {
        let deadline = sub?.deadline;
        if (sub?.type === "recurring") {
          deadline = getNextDeadline(sub?.frequency);
        }
        const currentYear = new Date().getFullYear();
        const quarters = [
          [new Date(currentYear, 0, 1), new Date(currentYear, 2, 31)],
          [new Date(currentYear, 3, 1), new Date(currentYear, 5, 30)],
          [new Date(currentYear, 6, 1), new Date(currentYear, 8, 30)],
          [new Date(currentYear, 9, 1), new Date(currentYear, 11, 31)],
        ];
        let concernedQuarter = quarters[0];
        if (periodFilter === "Q2") {
          concernedQuarter = quarters[1];
        }
        if (periodFilter === "Q3") {
          concernedQuarter = quarters[2];
        }
        if (periodFilter === "Q4") {
          concernedQuarter = quarters[3];
        }
        return (
          deadline >= concernedQuarter[0] && deadline <= concernedQuarter[1]
        );
      });
    }

    // Filter to show only submissions assigned to the current user
    filtered = filtered.filter((sub) => {
      const user = store?.db?.user;
      const departments = store?.db?.departments;
      let isValid = false;

      if (user) {
        if (sub.assignedTo === user._id) {
          isValid = true;
        } else if (user.role === "Super-user") {
          isValid = true;
        } else {
          departments?.map((dept: any) => {
            if (dept._id === sub.departmentId && dept.spoc === user._id) {
              isValid = true;
            }
          });
        }
      } else {
        filtered = [];
      }

      return isValid;
    });

    setFilteredSubmissions(filtered);
  };

  return (
    <TabsContent value="checkpoints" className="mt-0">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800">
            <TableHead className="text-gray-400">Checkpoint</TableHead>
            <TableHead className="text-gray-400">Sub-Checkpoint</TableHead>
            <TableHead className="text-gray-400">Letter No.</TableHead>
            <TableHead className="text-gray-400">Regulatory</TableHead>
            <TableHead className="text-gray-400">Deadline</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Type</TableHead>
            <TableHead className="text-gray-400">Period</TableHead>
            <TableHead className="text-gray-400 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission: any) => (
              <CheckpointRow
                key={submission?.id}
                submission={submission}
                setSelectedSubmission={setSelectedSubmission}
                setIsAssignDialog={setIsAssignDialog}
                setIsViewSubmission={setIsViewSubmission}
                setShowSubmitDialog={setShowSubmitDialog}
              />
            ))
          ) : (
            <TableRow className="border-gray-700">
              <TableCell colSpan={9} className="text-center text-gray-400 py-8">
                No submissions found matching your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TabsContent>
  );
};

export default Checkpointsview;

const CheckpointRow = ({
  submission,
  setSelectedSubmission,
  setIsAssignDialog,
  setShowSubmitDialog,
  setIsViewSubmission,
}: any) => {
  const getStatusBadge = (status: string) => {
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

  let deadline = new Date(submission?.deadline).toLocaleDateString();

  if (submission.type === "recurring") {
    const recurringDeadline = new Date(
      getNextDeadline(submission?.frequency)
    ).toLocaleDateString();
    deadline = `${recurringDeadline} recurring ${submission?.frequency}`;
  }

  return (
    <TableRow className="border-gray-700 hover:bg-gray-800">
      <TableCell className="text-white">
        {submission?.checkpointTitle}
      </TableCell>
      <TableCell className="text-white">
        {submission?.subCheckpointTitle}
      </TableCell>
      <TableCell className="text-gray-300 font-mono">
        {submission?.letterNumber}
      </TableCell>
      <TableCell className="text-gray-300">{submission?.regulatory}</TableCell>
      <TableCell className="text-gray-300">{deadline}</TableCell>
      <TableCell>{getStatusBadge(submission.status)}</TableCell>
      <TableCell className="text-gray-300 capitalize">
        {submission?.type}
      </TableCell>
      <TableCell className="text-gray-300">
        {submission?.period || "N/A"}
      </TableCell>
      <TableCell className="text-right">
        {submission.status !== "submitted" &&
        submission.status !== "pending_review" &&
        submission.submissionStatus !== "pending_review" ? (
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
        ) : (
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
  );
};
