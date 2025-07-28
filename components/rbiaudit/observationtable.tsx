import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Edit,
  Calendar,
  Building2,
  User,
  TrendingUp,
  AlertTriangle,
  AlertOctagon,
  FileSearch,
  ClipboardCheck,
  ShieldAlert,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const Observationtable = ({ audit }: any) => {
  const [filteredObservations, setFilteredObservations] = useState<any[]>(
    audit?.observations
  );

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

  const filterObservations = () => {
    if (audit?.store?.db?.observations) {
      let filteredobs = [...audit?.store?.db?.observations];

      if (audit?.searchTerm !== "") {
        filteredobs = filteredobs.filter(
          (obs) =>
            obs.observationNumber
              .toLowerCase()
              .includes(audit?.searchTerm?.toLowerCase()) ||
            obs.title.toLowerCase().includes(audit?.searchTerm?.toLowerCase())
        );
      }

      if (audit?.categoryFilter !== "all") {
        filteredobs = filteredobs.filter(
          (obs) => obs.category === audit?.categoryFilter
        );
      }

      if (audit?.departmentFilter !== "all") {
        filteredobs = filteredobs.filter(
          (obs) => obs.department === audit?.departmentFilter
        );
      }

      setFilteredObservations(filteredobs);
    }
  };

  useEffect(() => {
    filterObservations();
  }, [
    audit?.store?.db?.observations,
    audit?.searchTerm,
    audit?.categoryFilter,
    audit?.departmentFilter,
  ]);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          {audit?.categoryFilter !== "all"
            ? `${audit?.AUDIT_CATEGORIES[audit?.categoryFilter]} Observations`
            : "All Audit Observations"}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {filteredObservations?.length} observations found
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredObservations?.length > 0 ? (
          <div className="space-y-4">
            {filteredObservations?.map((observation) => (
              <Card
                key={observation._id}
                className="bg-gray-900 border-gray-600"
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono text-gray-400">
                          {observation.observationNumber}
                        </span>
                        <Badge
                          className={`${getSeverityColor(
                            observation.severity
                          )} text-white`}
                        >
                          {observation.severity}
                        </Badge>
                        <Badge
                          className={`${getStatusColor(
                            observation.status
                          )} text-white flex items-center gap-1`}
                        >
                          {getStatusIcon(observation.status)}
                          {observation.status}
                        </Badge>
                        <Badge className="bg-[#e9b306] text-black flex items-center gap-1">
                          {getCategoryIcon(observation.auditCategory || "RMP")}
                          {observation.category || "RMP"}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {observation.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {observation.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {audit?.store?.tools?.getDepartmentNameFromId(
                            observation.department
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {audit?.store?.tools?.getUserNameFromId(
                            observation.assignedTo
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Target:{" "}
                          {new Date(
                            observation.targetDate
                          ).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Progress:{" "}
                          {!observation.progress || observation.progress === ""
                            ? 0
                            : observation.progress}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        onClick={() => {
                          audit?.setSelectedObservation(observation);
                          audit?.setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        onClick={() => {
                          audit?.setSelectedObservation(observation);
                          audit?.setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">
                        {observation.progress}%
                      </span>
                    </div>
                    <Progress value={observation.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No observations found matching the current filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Observationtable;
