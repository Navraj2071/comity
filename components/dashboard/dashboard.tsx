"use client";

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
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { PieChart } from "@/components/pie-chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  getCurrentUser,
  getCheckpoints,
  getComplianceStats,
  getRegulatoryStats,
  getCheckpointStatus,
  getCriticalityOrder,
  getPolicySOPStats,
  getRBIAuditStats,
  type CheckpointType,
  getFinancialYears,
  getMonths,
  getQuarters,
  getHalfYears,
  getYears,
} from "@/lib/storage";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "@/lib/store/useStore";

export default function Dashboard() {
  const { user } = useStore();

  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [complianceStats, setComplianceStats] = useState<any>({});
  const [policySOPStats, setPolicySOPStats] = useState<any>({});
  const [rbiAuditStats, setRbiAuditStats] = useState<any>({});
  const [regulatoryDepts, setRegulatoryDepts] = useState<any[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCheckpointDetails, setSelectedCheckpointDetails] =
    useState<any>(null);
  const router = useRouter();

  // Dashboard filters
  const [checkpointType, setCheckpointType] =
    useState<CheckpointType>("ad-hoc");
  const [financialYear, setFinancialYear] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("monthly");
  const [period, setPeriod] = useState<string>("");

  // Time period options
  const [financialYearsList, setFinancialYearsList] = useState<string[]>([]);
  const [monthsList, setMonthsList] = useState<
    { value: string; label: string }[]
  >([]);
  const [quartersList, setQuartersList] = useState<
    { value: string; label: string }[]
  >([]);
  const [halfYearsList, setHalfYearsList] = useState<
    { value: string; label: string }[]
  >([]);
  const [yearsList, setYearsList] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    // const checkpointsData = getCheckpoints();
    // setCheckpoints(checkpointsData);
    // // Set default financial year to the current one
    // const fyears = getFinancialYears();
    // setFinancialYearsList(fyears);
    // setFinancialYear(fyears[1]); // Default to current financial year
    // // Set time period options
    // setMonthsList(getMonths());
    // setQuartersList(getQuarters());
    // setHalfYearsList(getHalfYears());
    // setYearsList(getYears());
    // // Set default period based on frequency
    // const currentMonth = getMonths()[new Date().getMonth()];
    // setPeriod(currentMonth.value);
    // // Update stats with default filters
    // updateStats("ad-hoc", fyears[1]);
    // // Get policy/SOP stats
    // setPolicySOPStats(getPolicySOPStats());
    // // Get RBI audit stats
    // setRbiAuditStats(getRBIAuditStats());
  }, []);

  useEffect(() => {
    // Update stats when filters change
    if (checkpointType === "ad-hoc") {
      updateStats(checkpointType, financialYear);
    } else {
      updateStats(checkpointType, period);
    }
  }, [checkpointType, financialYear, frequency, period]);

  const updateStats = (type: CheckpointType, periodValue: string) => {
    setComplianceStats(getComplianceStats(type, periodValue));

    // Sort regulatory departments by criticality
    const regulatoryStats = getRegulatoryStats(type, periodValue);
    const sortedRegulatoryDepts = regulatoryStats.sort(
      (a, b) =>
        getCriticalityOrder(a.criticality) - getCriticalityOrder(b.criticality)
    );
    setRegulatoryDepts(sortedRegulatoryDepts);
  };

  // Update period options when frequency changes
  useEffect(() => {
    if (frequency === "monthly") {
      setPeriod(monthsList[0]?.value || "");
    } else if (frequency === "quarterly") {
      setPeriod(quartersList[0]?.value || "");
    } else if (frequency === "half-yearly") {
      setPeriod(halfYearsList[0]?.value || "");
    } else if (frequency === "annually") {
      setPeriod(yearsList[0]?.value || "");
    }
  }, [frequency, monthsList, quartersList, halfYearsList, yearsList]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  const selectedDept = regulatoryDepts.find(
    (dept) => dept.name === selectedCheckpoint
  );

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getPercentageBg = (percentage: number) => {
    if (percentage >= 80) return "from-green-500/10 to-green-600/5";
    if (percentage >= 60) return "from-yellow-500/10 to-yellow-600/5";
    return "from-red-500/10 to-red-600/5";
  };

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

  const handleCheckpointClick = (checkpoint: any) => {
    setSelectedCheckpointDetails(checkpoint);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} checkpoints={checkpoints} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 animate-fadeIn flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Compliance Dashboard
                </h1>
                <p className="text-sm text-gray-400">
                  Monitor and manage regulatory compliance across all
                  departments
                </p>
              </div>

              {/* Dashboard Filters - Right aligned and less prominent */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gray-800 rounded-md border border-gray-700 p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-xs px-3 py-1 h-7 ${
                      checkpointType === "ad-hoc"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setCheckpointType("ad-hoc")}
                  >
                    Ad-hoc
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-xs px-3 py-1 h-7 ${
                      checkpointType === "recurring"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setCheckpointType("recurring")}
                  >
                    Recurring
                  </Button>
                </div>

                {checkpointType === "ad-hoc" ? (
                  <Select
                    value={financialYear}
                    onValueChange={setFinancialYear}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-44 text-xs">
                      <SelectValue placeholder="Financial Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {financialYearsList.map((year) => (
                        <SelectItem key={year} value={year} className="text-xs">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-32 text-xs">
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="monthly" className="text-xs">
                          Monthly
                        </SelectItem>
                        <SelectItem value="quarterly" className="text-xs">
                          Quarterly
                        </SelectItem>
                        <SelectItem value="half-yearly" className="text-xs">
                          Half-Yearly
                        </SelectItem>
                        <SelectItem value="annually" className="text-xs">
                          Annually
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {frequency === "monthly" && (
                      <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-32 text-xs">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {monthsList.map((month) => (
                            <SelectItem
                              key={month.value}
                              value={month.value}
                              className="text-xs"
                            >
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {frequency === "quarterly" && (
                      <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-32 text-xs">
                          <SelectValue placeholder="Quarter" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {quartersList.map((quarter) => (
                            <SelectItem
                              key={quarter.value}
                              value={quarter.value}
                              className="text-xs"
                            >
                              {quarter.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {frequency === "half-yearly" && (
                      <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-32 text-xs">
                          <SelectValue placeholder="Half Year" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {halfYearsList.map((half) => (
                            <SelectItem
                              key={half.value}
                              value={half.value}
                              className="text-xs"
                            >
                              {half.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {frequency === "annually" && (
                      <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-32 text-xs">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {yearsList.map((year) => (
                            <SelectItem
                              key={year.value}
                              value={year.value}
                              className="text-xs"
                            >
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Key Metrics */}
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
                          (complianceStats.compliant / complianceStats.total) *
                            100
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
                          (complianceStats.pending / complianceStats.total) *
                            100
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

            {/* Regulatory Department Cards - Top Section */}
            <div
              className="mb-6 animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
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
                {regulatoryDepts.map((dept, index) => (
                  <Card
                    key={dept.name}
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
                              {dept.percentage}%
                            </div>
                            <p className="text-xs text-gray-400">
                              Compliance Rate
                            </p>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">
                                Total: {dept.total}
                              </span>
                              <span className="text-green-400">
                                ✓ {dept.compliant}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-yellow-400">
                                ⏳ {dept.pending}
                              </span>
                              <span className="text-red-400">
                                ⚠ {dept.overdue}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              SPOC: {dept.spoc}
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

            {/* Quick Actions */}
            <Card
              className="bg-gray-800 border-gray-700 shadow-xl mb-6 animate-fadeIn overflow-hidden hover:shadow-2xl transition-all duration-300"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent"></div>
              <CardHeader className="relative z-10 pb-2">
                <CardTitle className="text-sm font-semibold text-white uppercase tracking-wider">
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  <Button
                    onClick={() => router.push("/checkpoints")}
                    className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="truncate">New Checkpoint</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/policies-sops")}
                    className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span className="truncate">Policies & SOPs</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/rbi-audit")}
                    className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <span className="truncate">RBI Audit</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/users")}
                    className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="truncate">Manage Users</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/regulatory-departments")}
                    className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4" />
                    </div>
                    <span className="truncate">Regulatory Depts</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/reports")}
                    className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <span className="truncate">Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* All the existing dialogs remain the same... */}
      {/* Regulatory Department Detail Modal */}
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
                          onClick={() => handleCheckpointClick(checkpoint)}
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
                              className={`text-xs ${getStatusBadgeColor(
                                status
                              )}`}
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

      {/* Rest of the dialogs remain the same... */}
    </div>
  );
}
