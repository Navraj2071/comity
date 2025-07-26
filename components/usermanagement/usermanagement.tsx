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
import CreateUserPopup from "./createuser";
import Displaytable from "./displaytable";
import Deleteuser from "./deleteuser";
import Updateuser from "./updateuser";

export default function UserManagement() {
  const store = useStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-400">
            Create and manage user accounts with role-based access
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Users</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </div>
              <CreateUserPopup
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
                  placeholder="Search users by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <Displaytable
              store={store}
              searchTerm={searchTerm}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              setSelectedUser={setSelectedUser}
              setIsUpdateDialogOpen={setIsUpdateDialogOpen}
            />
          </CardContent>
        </Card>
      </div>
      <Deleteuser
        selectedUser={selectedUser}
        store={store}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      />
      <Updateuser
        selectedUser={selectedUser}
        isUpdateDialogOpen={isUpdateDialogOpen}
        setIsUpdateDialogOpen={setIsUpdateDialogOpen}
        store={store}
      />
    </main>
  );
}
