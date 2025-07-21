"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  Building2,
  Clock,
  Repeat,
  Upload,
  Download,
  FileText,
  Settings,
} from "lucide-react";
import {
  addCheckpoint,
  getUsers,
  getDepartments,
  type CheckpointType,
  type RecurringFrequency,
  getFinancialYears,
} from "@/lib/storage";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CreateCheckpoint from "./createcheckoint";
import useStore from "@/lib/store/useStore";

export default function CheckpointManagement() {
  const store = useStore();

  const checkpoints = store?.db?.checkpoints;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkpointTypeFilter, setCheckpointTypeFilter] = useState("all");
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  // Reset period filter when timeframe filter changes
  useEffect(() => {
    setPeriodFilter("all");
  }, [timeframeFilter]);

  // Get available periods based on frequency
  const getAvailablePeriods = () => {
    const periods = new Set<string>();

    checkpoints?.forEach((checkpoint: any) => {
      if (
        checkpoint.type === "recurring" &&
        checkpoint.frequency === timeframeFilter
      ) {
        checkpoint.subCheckpoints.forEach((sub: any) => {
          if (sub.period) {
            periods.add(sub.period);
          }
        });
      }
    });

    return Array.from(periods).sort();
  };

  console.log(checkpoints);

  const filteredCheckpoints = checkpoints?.filter((checkpoint) => {
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
        (sub) => sub.period === periodFilter
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

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Compliance Checkpoint Management
          </h1>
          <p className="text-gray-400">
            Create and manage regulatory compliance checkpoints
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Compliance Checkpoints
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage regulatory requirements and sub-checkpoints
                </CardDescription>
              </div>
              <CreateCheckpoint
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                store={store}
              />
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search checkpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Select
                value={checkpointTypeFilter}
                onValueChange={setCheckpointTypeFilter}
              >
                <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ad-hoc">Ad-hoc</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                </SelectContent>
              </Select>

              {checkpointTypeFilter === "ad-hoc" && (
                <Select
                  value={timeframeFilter}
                  onValueChange={setTimeframeFilter}
                >
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Financial Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2023-2024">FY 2023-2024</SelectItem>
                    <SelectItem value="2024-2025">FY 2024-2025</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {checkpointTypeFilter === "recurring" && (
                <>
                  <Select
                    value={timeframeFilter}
                    onValueChange={setTimeframeFilter}
                  >
                    <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all">All Frequencies</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>

                  {timeframeFilter !== "all" && (
                    <Select
                      value={periodFilter}
                      onValueChange={setPeriodFilter}
                    >
                      <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all">All Periods</SelectItem>
                        {getAvailablePeriods().map((period) => (
                          <SelectItem key={period} value={period}>
                            {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </>
              )}
            </div>

            {/* Checkpoints */}
            <div className="space-y-6">
              {filteredCheckpoints?.map((checkpoint: any) => (
                <Card
                  key={checkpoint._id}
                  className="bg-gray-700 border-gray-600"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-white">
                            {checkpoint.title}
                          </CardTitle>
                          <Badge className="bg-blue-600 text-white">
                            {checkpoint.regulatory}
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
                        <p className="text-gray-300 text-sm">
                          {checkpoint.details}
                        </p>
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
                      <h4 className="font-medium text-gray-300">
                        Sub-checkpoints:
                      </h4>
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
                                <span>{sub.department}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{sub.deadline}</span>
                              </div>
                              {checkpoint.type === "recurring" &&
                                sub.period && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>Period: {sub.period}</span>
                                  </div>
                                )}
                            </div>
                          </div>
                          <Badge className={getStatusBadgeColor(sub.status)}>
                            {sub.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
