"use client";

import { useState } from "react";
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
import EditDepartmentPopup from "./editdepartment";
import Datadisplay from "./datadisplay";

export default function DepartmentManagement() {
  const store = useStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Department Management
          </h1>
          <p className="text-gray-400">
            Manage departments, heads, and compliance SPOCs
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Departments</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage department structure and assign compliance
                  responsibilities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search departments by name, head, or SPOC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <Datadisplay
              store={store}
              searchTerm={searchTerm}
              setIsEditDialogOpen={setIsEditDialogOpen}
              setEditingDepartment={setEditingDepartment}
            />
            <EditDepartmentPopup
              isEditDialogOpen={isEditDialogOpen}
              setIsEditDialogOpen={setIsEditDialogOpen}
              store={store}
              editingDepartment={editingDepartment}
              setEditingDepartment={setEditingDepartment}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
