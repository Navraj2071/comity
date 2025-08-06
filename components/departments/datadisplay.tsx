import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Users } from "lucide-react";
import { getSomeValueWithId } from "@/lib/tools";
import { useRouter } from "next/navigation";
const Datadisplay = ({
  store,
  searchTerm,
  setEditingDepartment,
  setIsEditDialogOpen,
}: any) => {
  const { user, departments, allUsers, checkpoints } = store?.db;
  const router = useRouter();

  const filteredDepartments = departments?.filter(
    (dept: any) =>
      dept?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store?.tools
        ?.getUserNameFromId(dept?.head)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      store?.tools
        ?.getUserNameFromId(dept?.spoc)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const [activeCheckpoints, setActiveCheckpoints] = useState<any>({});

  const poppulateActiveCheckpoints = () => {
    let acps = {} as any;
    checkpoints?.map((cpoint: any) => {
      cpoint?.subCheckpoints?.map((subpoint: any) => {
        const status = store?.tools?.getCheckpointStatus(subpoint._id);
        if (status !== "closed" && status !== "submitted") {
          if (subpoint.department in acps) {
            acps[subpoint.department] += 1;
          } else {
            acps[subpoint.department] = 1;
          }
        }
      });
    });
    setActiveCheckpoints(acps);
  };

  useEffect(() => {
    poppulateActiveCheckpoints();
  }, [checkpoints, departments]);

  return (
    <div className="rounded-md border border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Department</TableHead>
            <TableHead className="text-gray-300">Head of Department</TableHead>
            <TableHead className="text-gray-300">Department SPOC</TableHead>
            <TableHead className="text-gray-300">Users</TableHead>
            <TableHead className="text-gray-300">Active Checkpoints</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDepartments?.map((dept: any) => (
            <TableRow key={dept._id} className="border-gray-700">
              <TableCell className="font-medium text-white">
                {dept?.name}
              </TableCell>
              <TableCell className="text-gray-300">
                {getSomeValueWithId("name", allUsers, dept?.head)}
              </TableCell>
              <TableCell className="text-gray-300">
                {getSomeValueWithId("name", allUsers, dept?.spoc)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    {store?.tools?.getDepartmentUserCount(dept._id)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="text-blue-400 border-blue-400"
                >
                  {activeCheckpoints[dept._id] || 0}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => {
                      setIsEditDialogOpen(true);
                      setEditingDepartment(dept);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-400 hover:text-green-300"
                    onClick={() => router.push("/users")}
                  >
                    <Users className="h-4 w-4" />
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

export default Datadisplay;
