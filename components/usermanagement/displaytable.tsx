import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { getSomeValueWithId } from "@/lib/tools";

const Displaytable = ({
  store,
  searchTerm,
  setIsDeleteDialogOpen,
  setSelectedUser,
  setIsUpdateDialogOpen,
}: any) => {
  const users = store?.db?.allUsers || [];

  const filteredUsers = users?.filter(
    (user: any) =>
      user?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      getSomeValueWithId("name", store?.db?.departments || [], user?.department)
        ?.toLowerCase()
        .includes(searchTerm?.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-600 text-white";
      case "Super-user":
        return "bg-orange-600 text-white";
      case "User":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="rounded-md border border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300">Email</TableHead>
            <TableHead className="text-gray-300">Role</TableHead>
            <TableHead className="text-gray-300">Department</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers?.map((user: any) => (
            <TableRow key={user?._id} className="border-gray-700">
              <TableCell className="font-medium text-white">
                {user?.name}
              </TableCell>
              <TableCell className="text-gray-300">{user?.email}</TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(user?.role)}>
                  {user?.role}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300">
                {getSomeValueWithId(
                  "name",
                  store?.db?.departments || [],
                  user?.department
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={user?.status === "Active" ? "default" : "secondary"}
                >
                  {user?.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsUpdateDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Displaytable;
