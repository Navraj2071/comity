import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Loader from "./loader";

const Regdeptcards = ({ data }: any) => {
  const { store, regulatoryDepts, setSelectedCheckpoint } = data;

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "Critical":
        return "from-red-500/20 to-red-600/10";
      case "High":
        return "from-orange-500/20 to-orange-600/10";
      case "Medium":
        return "from-yellow-500/20 to-yellow-600/10";
      case "Low":
        return "from-green-500/20 to-green-600/10";
      default:
        return "from-gray-500/20 to-gray-600/10";
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getCriticalityBorderColor = (criticality: string) => {
    switch (criticality) {
      case "Critical":
        return "border-red-500/30";
      case "High":
        return "border-orange-500/30";
      case "Medium":
        return "border-yellow-500/30";
      case "Low":
        return "border-green-500/30";
      default:
        return "border-gray-500/30";
    }
  };

  if (regulatoryDepts.length === 0) {
    return <Loader />;
  }

  return (
    <div className="mb-6 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
          Regulatory Departments
        </h2>
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="text-xs font-normal text-gray-400 border-gray-700"
          >
            Sorted by Criticality
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-normal text-gray-400 border-gray-700"
          >
            {regulatoryDepts.length} Departments
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {regulatoryDepts.map((dept: any, index: number) => (
          <Card
            key={dept._id}
            className={`bg-gray-800 border-gray-700 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group overflow-hidden shadow-lg ${getCriticalityBorderColor(
              dept.criticality
            )}`}
            onClick={() => setSelectedCheckpoint(dept.name)}
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <CardContent className="p-4">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getCriticalityColor(
                  dept.criticality
                )} opacity-50 group-hover:opacity-70 transition-opacity duration-300 rounded-lg`}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-white">
                      {dept.name}
                    </h3>
                    <Shield className="h-3 w-3 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                  </div>
                  <Badge
                    className={`text-xs ${
                      dept.criticality === "Critical"
                        ? "bg-red-600 text-white"
                        : dept.criticality === "High"
                        ? "bg-orange-600 text-white"
                        : dept.criticality === "Medium"
                        ? "bg-yellow-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {dept.criticality}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${getPercentageColor(
                        dept.percentage
                      )} transition-colors duration-300`}
                    >
                      {dept.total > 0
                        ? ((dept.compliant / dept.total) * 100).toFixed()
                        : 0}
                      %
                    </div>
                    <p className="text-xs text-gray-400">Compliance Rate</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Total: {dept.total}</span>
                      <span className="text-green-400">✓ {dept.compliant}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-yellow-400">⏳ {dept.pending}</span>
                      <span className="text-red-400">⚠ {dept.overdue}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      SPOC: {store?.tools?.getUserNameFromId(dept.spoc)}
                    </div>
                  </div>
                  <Progress
                    value={dept.percentage}
                    className="h-1.5 transition-all duration-300 group-hover:h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Regdeptcards;
