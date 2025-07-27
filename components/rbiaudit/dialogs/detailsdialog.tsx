import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ClipboardCheck,
  FileSearch,
  AlertOctagon,
  FileText,
} from "lucide-react";

const Detailsdialog = ({ audit }: any) => {
  const getSeverityColor = (severity: any) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Open":
        return "bg-blue-500";
      case "In Progress":
        return "bg-yellow-500";
      case "Pending Closure":
        return "bg-orange-500";
      case "Closed":
        return "bg-green-500";
      case "Overdue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: any) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="h-4 w-4" />;
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Pending Closure":
        return <AlertTriangle className="h-4 w-4" />;
      case "Closed":
        return <CheckCircle className="h-4 w-4" />;
      case "Overdue":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "RMP":
        return <ShieldAlert className="h-5 w-5" />;
      case "IRAR":
        return <ClipboardCheck className="h-5 w-5" />;
      case "SSI":
        return <FileSearch className="h-5 w-5" />;
      case "MNCR":
        return <AlertOctagon className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const selectedObservation = audit?.selectedObservation;

  return (
    <Dialog
      open={audit?.showDetailsDialog}
      onOpenChange={audit?.setShowDetailsDialog}
    >
      <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Observation Details</DialogTitle>
        </DialogHeader>
        {audit?.selectedObservation && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400">Observation Number</Label>
                  <p className="text-white font-mono">
                    {audit?.selectedObservation.observationNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Audit Date</Label>
                  <p className="text-white">
                    {new Date(
                      audit?.selectedObservation.auditDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Audit Type</Label>
                  <p className="text-white">
                    {audit?.selectedObservation.auditType}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Audit Category</Label>
                  <Badge className="bg-[#e9b306] text-black mt-1 flex items-center gap-1 w-fit">
                    {getCategoryIcon(
                      selectedObservation.auditCategory || "RMP"
                    )}
                    {
                      audit?.AUDIT_CATEGORIES[
                        selectedObservation.auditCategory || "RMP"
                      ]
                    }
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-400">Observation Category</Label>
                  <p className="text-white">
                    {audit?.selectedObservation.category}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Severity</Label>
                  <Badge
                    className={`${getSeverityColor(
                      selectedObservation.severity
                    )} text-white mt-1`}
                  >
                    {selectedObservation.severity}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400">Status</Label>
                  <Badge
                    className={`${getStatusColor(
                      selectedObservation.status
                    )} text-white mt-1 flex items-center gap-1 w-fit`}
                  >
                    {getStatusIcon(selectedObservation.status)}
                    {selectedObservation.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-400">Assigned Department</Label>
                  <p className="text-white">
                    {selectedObservation.assignedDepartment}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Assigned To</Label>
                  <p className="text-white">{selectedObservation.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Target Date</Label>
                  <p className="text-white">
                    {new Date(
                      selectedObservation.targetDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Progress</Label>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">
                        {selectedObservation.progress}%
                      </span>
                    </div>
                    <Progress
                      value={selectedObservation.progress}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-gray-400">Title</Label>
              <p className="text-white mt-1">{selectedObservation.title}</p>
            </div>

            <div>
              <Label className="text-gray-400">Description</Label>
              <p className="text-white mt-1">
                {selectedObservation.description}
              </p>
            </div>

            <div>
              <Label className="text-gray-400">Recommendation</Label>
              <p className="text-white mt-1">
                {selectedObservation.recommendation}
              </p>
            </div>

            {selectedObservation.actionTaken && (
              <div>
                <Label className="text-gray-400">Action Taken</Label>
                <p className="text-white mt-1">
                  {selectedObservation.actionTaken}
                </p>
              </div>
            )}

            {selectedObservation.departmentComments && (
              <div>
                <Label className="text-gray-400">Department Comments</Label>
                <p className="text-white mt-1">
                  {selectedObservation.departmentComments}
                </p>
              </div>
            )}

            {selectedObservation.evidenceUploaded &&
              selectedObservation.evidenceUploaded.length > 0 && (
                <div>
                  <Label className="text-gray-400">Evidence Files</Label>
                  <div className="mt-2 space-y-1">
                    {selectedObservation.evidenceUploaded.map(
                      (file: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-blue-400"
                        >
                          <FileText className="h-4 w-4" />
                          <span>{file}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-gray-400">Created</Label>
                <p className="text-white">
                  {new Date(selectedObservation.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-gray-400">Last Updated</Label>
                <p className="text-white">
                  {new Date(
                    selectedObservation.lastUpdated
                  ).toLocaleDateString()}
                </p>
              </div>
              {selectedObservation.closureDate && (
                <div>
                  <Label className="text-gray-400">Closure Date</Label>
                  <p className="text-white">
                    {new Date(
                      selectedObservation.closureDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Detailsdialog;
