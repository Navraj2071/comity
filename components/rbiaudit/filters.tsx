import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Filters = ({ audit }: any) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search observations..."
                value={audit?.searchTerm}
                onChange={(e) => audit?.setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-600 text-white"
              />
            </div>
          </div>
          <Select
            value={audit?.categoryFilter}
            onValueChange={audit?.setCategoryFilter}
          >
            <SelectTrigger className="w-48 bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="RMP">Risk Mitigation Plan</SelectItem>
              <SelectItem value="IRAR">Inspection & Risk Assessment</SelectItem>
              <SelectItem value="SSI">Select Scope Inspection</SelectItem>
              <SelectItem value="MNCR">Mandatory Non-compliance</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={audit?.statusFilter}
            onValueChange={audit?.setStatusFilter}
          >
            <SelectTrigger className="w-48 bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Pending Closure">Pending Closure</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={audit?.severityFilter}
            onValueChange={audit?.setSeverityFilter}
          >
            <SelectTrigger className="w-48 bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={audit?.departmentFilter}
            onValueChange={audit?.setDepartmentFilter}
          >
            <SelectTrigger className="w-48 bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Departments</SelectItem>
              {audit?.store?.db?.departments?.map((dept: any) => (
                <SelectItem key={dept._id} value={dept._id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default Filters;
