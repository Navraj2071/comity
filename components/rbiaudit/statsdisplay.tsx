import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart } from "../pie-chart";

const Statsdisplay = ({ audit }: any) => {
  if (!audit.selectedCategory) return null;
  const stats = audit?.categoryStats[audit?.selectedCategory];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Observations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <p className="text-xs text-gray-400 mt-1">
                FY {audit?.selectedFinancialYear}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Critical & High
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {stats.critical + stats.high}
              </div>
              <p className="text-xs text-gray-400 mt-1">Immediate attention</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {stats.inProgress}
              </div>
              <p className="text-xs text-gray-400 mt-1">Being addressed</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {stats.overdue}
              </div>
              <p className="text-xs text-gray-400 mt-1">Past deadline</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Closed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {stats.closed}
              </div>
              <p className="text-xs text-gray-400 mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-center">
            Status Distribution
          </CardTitle>
          <CardDescription className="text-gray-400 text-center text-sm">
            {audit?.categoryFilter !== "all"
              ? audit?.AUDIT_CATEGORIES[audit?.categoryFilter]
              : "All Categories"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <PieChart
            data={[
              {
                name: "Open",
                value: stats.open,
                color: "#3b82f6",
              },
              {
                name: "In Progress",
                value: stats.inProgress,
                color: "#f59e0b",
              },
              {
                name: "Pending Closure",
                value: stats.pendingClosure,
                color: "#f97316",
              },
              {
                name: "Closed",
                value: stats.closed,
                color: "#10b981",
              },
              {
                name: "Overdue",
                value: stats.overdue,
                color: "#ef4444",
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Statsdisplay;
