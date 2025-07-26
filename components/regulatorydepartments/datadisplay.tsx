import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Search, AlertTriangle, Shield, User } from "lucide-react";
import { getSomeValueWithId } from "@/lib/tools";
import { Badge } from "../ui/badge";

const Datadisplay = ({
  searchTerm,
  store,
  setSelectedDept,
  setIsEditDialogOpen,
}: any) => {
  const regulatoryDepts = store?.db?.regulatoryDepartments;

  const filteredDepts = regulatoryDepts?.filter(
    (dept: any) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store?.tools
        ?.getUserNameFromId(dept?.spoc || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "Critical":
        return "bg-red-600 text-white";
      case "High":
        return "bg-orange-600 text-white";
      case "Medium":
        return "bg-yellow-600 text-white";
      case "Low":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getCriticalityIcon = (criticality: string) => {
    switch (criticality) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "High":
        return <AlertTriangle className="h-4 w-4" />;
      case "Medium":
        return <Shield className="h-4 w-4" />;
      case "Low":
        return <Shield className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-md border border-gray-700 shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Regulatory Body</TableHead>
            <TableHead className="text-gray-300">Full Name</TableHead>
            <TableHead className="text-gray-300">Criticality</TableHead>
            <TableHead className="text-gray-300">Compliance SPOC</TableHead>
            <TableHead className="text-gray-300">Description</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDepts?.map((dept: any) => (
            <TableRow
              key={`table1-${dept._id}`}
              className="border-gray-700 hover:bg-gray-700/50"
            >
              <TableCell className="font-medium text-white">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-600 text-white">{dept.name}</Badge>
                </div>
              </TableCell>
              <TableCell className="text-gray-300">{dept.fullName}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getCriticalityIcon(dept.criticality)}
                  <Badge className={getCriticalityColor(dept.criticality)}>
                    {dept.criticality}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-gray-300">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>
                    {getSomeValueWithId(
                      "name",
                      store?.db?.allUsers || [],
                      dept.spoc
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-gray-300 max-w-xs truncate">
                {dept.description}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => {
                      setSelectedDept(dept);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
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
