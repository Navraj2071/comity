import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  ShieldAlert,
  ClipboardCheck,
  FileSearch,
  AlertOctagon,
  AlertTriangle,
} from "lucide-react";

const Rbiauditview = ({
  filteredRbiAuditReviews,
  setSelectedReview,
  setShowReviewDialog,
  store,
}: any) => {
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

  return (
    <TabsContent value="rbi-audit" className="mt-0">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800">
            <TableHead className="text-gray-400">Observation No.</TableHead>
            <TableHead className="text-gray-400">Title</TableHead>
            <TableHead className="text-gray-400">Category</TableHead>
            <TableHead className="text-gray-400">Severity</TableHead>
            <TableHead className="text-gray-400">Assigned To</TableHead>
            <TableHead className="text-gray-400">Department</TableHead>
            <TableHead className="text-gray-400">Submitted Date</TableHead>
            <TableHead className="text-gray-400">Progress</TableHead>
            <TableHead className="text-gray-400 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRbiAuditReviews.length > 0 ? (
            filteredRbiAuditReviews.map((review: any) => (
              <TableRow
                key={review?._id}
                className="border-gray-700 hover:bg-gray-800"
              >
                <TableCell className="text-white font-mono">
                  {review?.observationNumber}
                </TableCell>
                <TableCell className="text-white">{review?.title}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center gap-1">
                    {getRbiCategoryIcon(review.category)}
                    <span>{review.category}</span>
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
                  {store?.tools?.getUserNameFromId(review.assignedTo)}
                </TableCell>
                <TableCell className="text-gray-300">
                  {store?.tools?.getDepartmentNameFromId(review.department)}
                </TableCell>
                <TableCell className="text-gray-300">
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-gray-300">
                  {review.progress}%
                </TableCell>
                <TableCell className="text-right">
                  {review?.status !== "Closed" ? (
                    <Button
                      onClick={() => {
                        setSelectedReview(review);
                        setShowReviewDialog(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      Review
                    </Button>
                  ) : (
                    "---"
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-gray-700">
              <TableCell colSpan={9} className="text-center text-gray-400 py-8">
                No RBI audit reviews pending
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TabsContent>
  );
};

export default Rbiauditview;
