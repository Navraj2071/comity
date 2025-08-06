import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Clock, FileText } from "lucide-react";
import Loader from "./loader";

const Keymetrics = ({ data }: any) => {
  const { complianceStats, setSelectedStatus } = data;

  if (!("total" in complianceStats)) return <Loader />;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fadeIn"
      style={{ animationDelay: "0.1s" }}
    >
      <Card
        className="bg-gray-800 border-gray-700 card-hover overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
        onClick={() => setSelectedStatus("all")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium text-gray-300 uppercase tracking-wider">
            Total Checkpoints
          </CardTitle>
          <div className="h-7 w-7 rounded-full bg-blue-500/10 flex items-center justify-center">
            <FileText className="h-3.5 w-3.5 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {complianceStats.total}
          </div>
        </CardContent>
      </Card>

      <Card
        className="bg-gray-800 border-gray-700 card-hover overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300"
        onClick={() => setSelectedStatus("compliant")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-lg"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium text-gray-300 uppercase tracking-wider">
            Compliant
          </CardTitle>
          <div className="h-7 w-7 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">
            {complianceStats.compliant}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {complianceStats.total > 0
              ? Math.round(
                  (complianceStats.compliant / complianceStats.total) * 100
                )
              : 0}
            % of total
          </p>
        </CardContent>
      </Card>

      <Card
        className="bg-gray-800 border-gray-700 card-hover overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300"
        onClick={() => setSelectedStatus("pending")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-lg"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium text-gray-300 uppercase tracking-wider">
            Pending
          </CardTitle>
          <div className="h-7 w-7 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Clock className="h-3.5 w-3.5 text-yellow-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">
            {complianceStats.pending}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {complianceStats.total > 0
              ? Math.round(
                  (complianceStats.pending / complianceStats.total) * 100
                )
              : 0}
            % of total
          </p>
        </CardContent>
      </Card>

      <Card
        className="bg-gray-800 border-gray-700 card-hover overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300"
        onClick={() => setSelectedStatus("overdue")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-lg"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium text-gray-300 uppercase tracking-wider">
            Overdue
          </CardTitle>
          <div className="h-7 w-7 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">
            {complianceStats.overdue}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Immediate attention required
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Keymetrics;
