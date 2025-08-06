"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import useStore from "@/lib/store/useStore";
import CreateDepartmentPopup from "./addregdepartment";
import EditDepartmentPopup from "./editregdepartment";
import Datadisplay from "./datadisplay";
import AccessControl from "./accesscontrol";

export default function RegulatoryDepartmentsPage() {
  const store = useStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AccessControl>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Regulatory Departments
            </h1>
            <p className="text-gray-400">
              Manage regulatory departments, criticality levels, and compliance
              SPOCs
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">
                    Regulatory Departments
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure regulatory departments with criticality and SPOC
                    assignments
                  </CardDescription>
                </div>
                <CreateDepartmentPopup
                  isCreateDialogOpen={isCreateDialogOpen}
                  setIsCreateDialogOpen={setIsCreateDialogOpen}
                  store={store}
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search regulatory departments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <Datadisplay
                store={store}
                searchTerm={searchTerm}
                setSelectedDept={setSelectedDept}
                setIsEditDialogOpen={setIsEditDialogOpen}
              />
            </CardContent>
          </Card>
        </div>

        <EditDepartmentPopup
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          selectedDept={selectedDept}
          store={store}
        />
      </main>
    </AccessControl>
  );
}
