"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart } from "@/components/pie-chart";
import {
  FileText,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type CheckpointType,
  getFinancialYears,
  getMonths,
  getQuarters,
  getHalfYears,
  getYears,
} from "@/lib/storage";
import useReports from "./useReports";
import LoadingPage from "@/app/loading";

export default function ReportsPage() {
  const { store, complianceData, reportFilters, setReportFilters } =
    useReports();

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  // Time period options
  const financialYears = getFinancialYears();
  const months = getMonths();
  const quarters = getQuarters();
  const halfYears = getHalfYears();
  const years = getYears();

  const generateReport = async () => {
    try {
      // Dynamic imports for PDF generation
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;

      // Get the main content area (excluding sidebar and header)
      const element = document.querySelector("main");

      if (!element) {
        alert("Unable to generate report. Please try again.");
        return;
      }

      // Show loading message
      const originalContent = element.innerHTML;
      element.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 400px; color: white;">
          <div style="text-align: center;">
            <div style="font-size: 18px; margin-bottom: 10px;">Generating PDF Report...</div>
            <div style="font-size: 14px; color: #9CA3AF;">Please wait while we create your report</div>
          </div>
        </div>
      `;

      // Wait a moment for the loading message to show
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Restore original content
      element.innerHTML = originalContent;

      // Wait for content to render
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#111827",
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Add image to PDF
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Add additional pages if content is too long
      const totalPDFPages = Math.ceil((imgHeight * ratio) / pdfHeight);
      for (let i = 1; i < totalPDFPages; i++) {
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          -(pdfHeight * i) + imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );
      }

      // Generate filename with current date
      const filename = `compliance-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating report. Please try again.");
    }
  };

  if (!complianceData) return <LoadingPage />;

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Compliance Reports
          </h1>
          <p className="text-gray-400">
            Generate and view comprehensive compliance reports and analytics
          </p>
        </div>

        {/* Report Filters */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Report Filters
            </CardTitle>
            <CardDescription className="text-gray-400">
              Customize your report parameters and generate detailed compliance
              analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Checkpoint Type Selection */}
              <div className="space-y-4">
                <Label className="text-gray-300">Checkpoint Type</Label>
                <Tabs
                  defaultValue="ad-hoc"
                  onValueChange={(value) =>
                    setReportFilters((prev) => ({
                      ...prev,
                      checkpointType: value as CheckpointType,
                    }))
                  }
                >
                  <TabsList className="bg-gray-700">
                    <TabsTrigger value="ad-hoc">Ad-hoc Checkpoints</TabsTrigger>
                    <TabsTrigger value="recurring">
                      Recurring Checkpoints
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="ad-hoc" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="financial-year"
                          className="text-gray-300"
                        >
                          Financial Year
                        </Label>
                        <Select
                          value={reportFilters.financialYear}
                          onValueChange={(value) =>
                            setReportFilters((prev) => ({
                              ...prev,
                              financialYear: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select financial year" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            {financialYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-gray-300">
                          Department
                        </Label>
                        <Select
                          value={reportFilters.department}
                          onValueChange={(value) =>
                            setReportFilters((prev) => ({
                              ...prev,
                              department: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="all">All Departments</SelectItem>
                            {store?.db?.departments?.map((dept: any) => (
                              <SelectItem
                                value={dept.name}
                                key={`dept-${dept._id}`}
                              >
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="regulatory" className="text-gray-300">
                          Regulatory Body
                        </Label>
                        <Select
                          value={reportFilters.regulatory}
                          onValueChange={(value) =>
                            setReportFilters((prev) => ({
                              ...prev,
                              regulatory: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select regulatory body" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="all">
                              All Regulatory Bodies
                            </SelectItem>
                            <SelectItem value="RBI">RBI</SelectItem>
                            <SelectItem value="NPCI">NPCI</SelectItem>
                            <SelectItem value="UIDAI">UIDAI</SelectItem>
                            <SelectItem value="CSITE">CSITE</SelectItem>
                            <SelectItem value="IDRBT">IDRBT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-gray-300">
                          Status
                        </Label>
                        <Select
                          value={reportFilters.status}
                          onValueChange={(value) =>
                            setReportFilters((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="compliant">Compliant</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="non-compliant">
                              Non-Compliant
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="recurring" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="frequency" className="text-gray-300">
                          Frequency
                        </Label>
                        <Select
                          value={reportFilters.frequency}
                          onValueChange={(value) =>
                            setReportFilters((prev) => ({
                              ...prev,
                              frequency: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="half-yearly">
                              Half-Yearly
                            </SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="period" className="text-gray-300">
                          Period
                        </Label>
                        {reportFilters.frequency === "monthly" && (
                          <Select
                            value={reportFilters.period}
                            onValueChange={(value) =>
                              setReportFilters((prev) => ({
                                ...prev,
                                period: value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              {months.map((month) => (
                                <SelectItem
                                  key={month.value}
                                  value={month.value}
                                >
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {reportFilters.frequency === "quarterly" && (
                          <Select
                            value={reportFilters.period}
                            onValueChange={(value) =>
                              setReportFilters((prev) => ({
                                ...prev,
                                period: value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                              <SelectValue placeholder="Select quarter" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              {quarters.map((quarter) => (
                                <SelectItem
                                  key={quarter.value}
                                  value={quarter.value}
                                >
                                  {quarter.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {reportFilters.frequency === "half-yearly" && (
                          <Select
                            value={reportFilters.period}
                            onValueChange={(value) =>
                              setReportFilters((prev) => ({
                                ...prev,
                                period: value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                              <SelectValue placeholder="Select half" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              {halfYears.map((half) => (
                                <SelectItem key={half.value} value={half.value}>
                                  {half.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {reportFilters.frequency === "annually" && (
                          <Select
                            value={reportFilters.period}
                            onValueChange={(value) =>
                              setReportFilters((prev) => ({
                                ...prev,
                                period: value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              {years.map((year) => (
                                <SelectItem key={year.value} value={year.value}>
                                  {year.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-gray-300">
                          Department
                        </Label>
                        <Select
                          value={reportFilters.department}
                          onValueChange={(value) =>
                            setReportFilters((prev) => ({
                              ...prev,
                              department: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="Operations">
                              Operations
                            </SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-gray-300">
                          Status
                        </Label>
                        <Select
                          value={reportFilters.status}
                          onValueChange={(value) =>
                            setReportFilters((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="compliant">Compliant</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="non-compliant">
                              Non-Compliant
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={generateReport}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {complianceData.overview.totalCheckpoints}
              </div>
              <p className="text-xs text-gray-400">Total Checkpoints</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400">
                {complianceData.overview.compliant}
              </div>
              <p className="text-xs text-gray-400">Compliant</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {complianceData.overview.pending}
              </div>
              <p className="text-xs text-gray-400">Pending</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-orange-400">
                {complianceData.overview.overdue}
              </div>
              <p className="text-xs text-gray-400">Overdue</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div
                className={`text-2xl font-bold ${getPercentageColor(
                  complianceData.overview.complianceRate
                )}`}
              >
                {complianceData?.overview?.totalCheckpoints > 0
                  ? (
                      (100 * complianceData?.overview?.compliant) /
                      complianceData?.overview?.totalCheckpoints
                    ).toFixed()
                  : 0}
                %
              </div>
              <p className="text-xs text-gray-400">Compliance Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Compliance Overview Chart */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Compliance Status Distribution
              </CardTitle>
              <CardDescription className="text-gray-400">
                Overall compliance status breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <PieChart
                data={[
                  {
                    name: "Compliant",
                    value: complianceData.overview.compliant,
                    color: "#10b981",
                  },
                  {
                    name: "Pending",
                    value: complianceData.overview.pending,
                    color: "#f59e0b",
                  },
                  {
                    name: "Overdue",
                    value: complianceData.overview.overdue,
                    color: "#f97316",
                  },
                  {
                    name: "Non-Compliant",
                    value: complianceData.overview.nonCompliant,
                    color: "#ef4444",
                  },
                ]}
              />
            </CardContent>
          </Card>

          {/* Regulatory Compliance Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Regulatory Body Performance
              </CardTitle>
              <CardDescription className="text-gray-400">
                Compliance rates by regulatory department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Regulatory</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                    <TableHead className="text-gray-300">Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceData.byRegulatory.map((reg: any) => {
                    const rate = (
                      reg?.total > 1
                        ? ((100 * reg?.compliant) / reg.total).toFixed()
                        : 0
                    ) as number;
                    return (
                      <TableRow key={reg.name} className="border-gray-700">
                        <TableCell className="text-white font-medium">
                          {reg.name}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {reg.total}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${getPercentageColor(
                              rate
                            )}`}
                          >
                            {rate}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Department Performance
            </CardTitle>
            <CardDescription className="text-gray-400">
              Compliance performance across all departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Department</TableHead>
                  <TableHead className="text-gray-300">Total</TableHead>
                  <TableHead className="text-gray-300">Compliant</TableHead>
                  <TableHead className="text-gray-300">Pending</TableHead>
                  <TableHead className="text-gray-300">Overdue</TableHead>
                  <TableHead className="text-gray-300">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceData.byDepartment.map((dept: any) => {
                  const rate = (
                    dept?.total > 1
                      ? ((100 * dept?.compliant) / dept.total).toFixed()
                      : 0
                  ) as number;
                  return (
                    <TableRow key={dept.name} className="border-gray-700">
                      <TableCell className="text-white font-medium">
                        {dept.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {dept.total}
                      </TableCell>
                      <TableCell className="text-green-400">
                        {dept.compliant}
                      </TableCell>
                      <TableCell className="text-yellow-400">
                        {dept.pending}
                      </TableCell>
                      <TableCell className="text-orange-400">
                        {dept.overdue}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${getPercentageColor(
                            dept.rate
                          )}`}
                        >
                          {dept.rate}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
