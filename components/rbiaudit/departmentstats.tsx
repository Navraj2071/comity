import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Departmentstats = ({ audit }: any) => {
  const departmentStats = audit?.departmentStats;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Department-wise Statistics</CardTitle>
        <CardDescription className="text-gray-400">
          {audit?.categoryFilter !== "all"
            ? `${
                audit?.AUDIT_CATEGORIES[audit?.categoryFilter]
              } observations by department`
            : "Overview of audit observations by department"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {departmentStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept: any) => (
              <Card
                key={dept.department}
                className="bg-gray-900 border-gray-600"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white">
                    {dept.department}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white">{dept.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Critical/High:</span>
                    <span className="text-red-400">
                      {dept.critical + dept.high}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Overdue:</span>
                    <span className="text-red-400">{dept.overdue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Closed:</span>
                    <span className="text-green-400">{dept.closed}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Avg Progress</span>
                      <span className="text-white">{dept.avgProgress}%</span>
                    </div>
                    <Progress value={dept.avgProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No department data available for the selected category.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Departmentstats;
