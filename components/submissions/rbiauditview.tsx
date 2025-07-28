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
  AlertTriangle,
  CheckCircle2,
  FileText,
  AlertOctagon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const Rbiauditview = ({
  filteredRbiAuditSubmissions,
  setSelectedSubmission,
  setShowSubmitDialog,
}: any) => {
  const getRbiCategoryIcon = (category: string) => {
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

  const getStatusBadge = (status: string) => {
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

  return (
    <TabsContent value="rbi-audit" className="mt-0">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800">
            <TableHead className="text-gray-400">Observation No.</TableHead>
            <TableHead className="text-gray-400">Title</TableHead>
            <TableHead className="text-gray-400">Category</TableHead>
            <TableHead className="text-gray-400">Severity</TableHead>
            <TableHead className="text-gray-400">Target Date</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Progress</TableHead>
            <TableHead className="text-gray-400 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRbiAuditSubmissions.length > 0 ? (
            filteredRbiAuditSubmissions.map((submission: any) => (
              <TableRow
                key={submission._id}
                className="border-gray-700 hover:bg-gray-800"
              >
                <TableCell className="text-white font-mono">
                  {submission.observationNumber}
                </TableCell>
                <TableCell className="text-white">{submission.title}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center gap-1">
                    {getRbiCategoryIcon(submission.category)}
                    <span>{submission.category}</span>
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
                  {new Date(submission.targetDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
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
              <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                No RBI audit submissions found matching your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TabsContent>
  );
};

export default Rbiauditview;
