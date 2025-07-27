import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
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
  setSelectedReview,
  setShowReviewDialog,
  setIsViewSubmission,
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
    // filtered = filtered.filter((sub) => sub.assignedTo === user.name);

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
            <TableHead className="text-gray-400">Submitted By</TableHead>
            <TableHead className="text-gray-400">Submitted Date</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Type</TableHead>
            <TableHead className="text-gray-400">Period</TableHead>
            <TableHead className="text-gray-400 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions?.length > 0 ? (
            filteredSubmissions?.map((review: any) => (
              <ReviewRow
                key={review?.id}
                review={review}
                setSelectedReview={setSelectedReview}
                setShowReviewDialog={setShowReviewDialog}
                setIsViewSubmission={setIsViewSubmission}
              />
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
  );
};

export default Checkpointsview;

const ReviewRow = ({
  review,
  setSelectedReview,
  setShowReviewDialog,
  setIsViewSubmission,
}: any) => {
  const getStatusBadge = (status: string) => {
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

  return (
    <TableRow className="border-gray-700 hover:bg-gray-800">
      <TableCell className="text-white">{review?.checkpointTitle}</TableCell>
      <TableCell className="text-white">{review?.subCheckpointTitle}</TableCell>
      <TableCell className="text-gray-300 font-mono">
        {review.letterNumber}
      </TableCell>
      <TableCell className="text-gray-300">{review?.regulatory}</TableCell>
      <TableCell className="text-gray-300">{review?.submittedBy}</TableCell>
      <TableCell className="text-gray-300">{review?.submittedDate}</TableCell>
      <TableCell>{getStatusBadge(review?.status)}</TableCell>
      <TableCell className="text-gray-300 capitalize">{review.type}</TableCell>
      <TableCell className="text-gray-300">{review.period || "N/A"}</TableCell>
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
            onClick={() => {
              setIsViewSubmission(true);
              setSelectedReview(review);
            }}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            View
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
