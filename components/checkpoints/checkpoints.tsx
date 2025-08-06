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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search } from "lucide-react";

import CreateCheckpoint from "./createcheckpoint/createcheckoint";
import useStore from "@/lib/store/useStore";
import Datadisplay from "./datadisplay";
import AccessControl from "./accesscontrol";

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

  return (
    <AccessControl>
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
                      <SelectItem value="2024-2025">FY 2026-2026</SelectItem>
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

              <Datadisplay
                store={store}
                searchTerm={searchTerm}
                checkpointTypeFilter={checkpointTypeFilter}
                timeframeFilter={timeframeFilter}
                periodFilter={periodFilter}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </AccessControl>
  );
}
