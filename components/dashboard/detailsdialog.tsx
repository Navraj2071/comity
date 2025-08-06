import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Shield,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { PieChart } from "@/components/pie-chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const Detailsdialog = ({ data }: any) => {
  const {
    selectedCheckpoint,
    setSelectedCheckpoint,
    setSelectedCheckpointDetails,
  } = data;
  const selectedDept = {} as any;

  const getCheckpointStatus = (subs: any) => {
    return "pending";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-600 text-white";
      case "non-compliant":
        return "bg-red-600 text-white";
      case "pending":
        return "bg-yellow-600 text-white";
      case "overdue":
        return "bg-orange-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <Dialog
      open={!!selectedCheckpoint}
      onOpenChange={() => setSelectedCheckpoint(null)}
    >
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-7xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {selectedDept?.name} Compliance Details
          </DialogTitle>
        </DialogHeader>

        {selectedDept && (
          <div className="space-y-6 py-4">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {selectedDept.total}
                  </div>
                  <p className="text-xs text-gray-400">Total Checkpoints</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {selectedDept.compliant}
                  </div>
                  <p className="text-xs text-gray-400">Compliant</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {selectedDept.pending}
                  </div>
                  <p className="text-xs text-gray-400">Pending</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {selectedDept.overdue}
                  </div>
                  <p className="text-xs text-gray-400">Overdue</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-white text-center">
                    Checkpoint Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <PieChart
                    data={[
                      {
                        name: "Compliant",
                        value: selectedDept.compliant,
                        color: "#10b981",
                      },
                      {
                        name: "Pending",
                        value: selectedDept.pending,
                        color: "#f59e0b",
                      },
                      {
                        name: "Overdue",
                        value: selectedDept.overdue,
                        color: "#ef4444",
                      },
                      {
                        name: "Non-Compliant",
                        value: selectedDept.nonCompliant,
                        color: "#dc2626",
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              {/* Department Summary - Made clickable */}
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-white uppercase tracking-wider">
                    Checkpoint Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDept.checkpoints.map((checkpoint: any) => {
                    const status = getCheckpointStatus(
                      checkpoint.subCheckpoints
                    );
                    return (
                      <div
                        key={checkpoint.id}
                        className="p-2 bg-gray-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-750 transition-colors duration-200 group"
                        onClick={() => setSelectedCheckpointDetails(checkpoint)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-xs text-white group-hover:text-blue-400 transition-colors">
                              {checkpoint.title}
                            </h4>
                            {checkpoint.type === "recurring" && (
                              <Badge className="bg-purple-600 text-white text-xs">
                                {checkpoint.frequency}
                              </Badge>
                            )}
                            <ChevronRight className="h-3 w-3 text-gray-500 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <Badge
                            className={`text-xs ${getStatusBadgeColor(status)}`}
                          >
                            {status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          {checkpoint.letterNumber}
                        </p>
                        <Progress
                          value={
                            (checkpoint.subCheckpoints.filter(
                              (sub: any) => sub.status === "compliant"
                            ).length /
                              checkpoint.subCheckpoints.length) *
                            100
                          }
                          className="h-1 mt-1"
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Detailsdialog;
