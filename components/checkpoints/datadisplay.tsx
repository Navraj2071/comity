import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Edit, Calendar, Building2, Clock, Repeat } from "lucide-react";
import { getSomeValueWithId } from "@/lib/tools";
const Datadisplay = ({
  store,
  searchTerm,
  checkpointTypeFilter,
  timeframeFilter,
  periodFilter,
}: any) => {
  const checkpoints = store?.db?.checkpoints;

  const filteredCheckpoints = checkpoints?.filter((checkpoint: any) => {
    const matchesSearch =
      checkpoint?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkpoint?.letterNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      checkpoint?.regulatory?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      checkpointTypeFilter === "all" ||
      checkpoint.type === checkpointTypeFilter;

    let matchesTimeframe = true;
    if (timeframeFilter !== "all") {
      if (checkpoint.type === "ad-hoc") {
        matchesTimeframe = timeframeFilter === checkpoint.financialYear;
      } else if (checkpoint.type === "recurring") {
        matchesTimeframe = timeframeFilter === checkpoint.frequency;
      }
    }

    let matchesPeriod = true;
    if (periodFilter !== "all" && checkpoint.type === "recurring") {
      matchesPeriod = checkpoint.subCheckpoints.some(
        (sub: any) => sub.period === periodFilter
      );
    }

    return matchesSearch && matchesType && matchesTimeframe && matchesPeriod;
  });

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

  const getCheckpointTypeBadge = (type: string, frequency?: string) => {
    if (type === "ad-hoc") {
      return <Badge className="bg-blue-600 text-white">Ad-hoc</Badge>;
    } else if (type === "recurring" && frequency) {
      return (
        <Badge className="bg-purple-600 text-white flex items-center">
          <Repeat className="h-3 w-3 mr-1" />
          {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
        </Badge>
      );
    }
    return null;
  };

  const getStatus = (subpointId: string) => {
    return store?.tools?.getSubCheckpointStatus(subpointId);
  };

  return (
    <div className="space-y-6">
      {filteredCheckpoints?.map((checkpoint: any) => (
        <Card key={checkpoint._id} className="bg-gray-700 border-gray-600">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-white">
                    {checkpoint.title}
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white">
                    {store?.tools?.getRegBodyNameFromId(checkpoint?.regulatory)}
                  </Badge>
                  {getCheckpointTypeBadge(
                    checkpoint.type,
                    checkpoint.frequency
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>{checkpoint.letterNumber}</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{checkpoint.date}</span>
                  </div>
                  {checkpoint.type === "ad-hoc" && (
                    <span>FY: {checkpoint.financialYear}</span>
                  )}
                </div>
                <p className="text-gray-300 text-sm">{checkpoint.details}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-300">Sub-checkpoints:</h4>
              {checkpoint?.subCheckpoints?.map((sub: any) => (
                <div
                  key={sub._id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">
                      {sub.title}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-3 w-3" />
                        <span>
                          {getSomeValueWithId(
                            "name",
                            store?.db?.departments || [],
                            sub.department
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{sub.deadline}</span>
                      </div>
                      {checkpoint.type === "recurring" && sub.period && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Period: {sub.period}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusBadgeColor(sub.status)}>
                    {getStatus(sub._id)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Datadisplay;
