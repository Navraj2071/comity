import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const FilterMenu = ({ store, setFilteredDocuments }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [departments, setDepartments] = useState<any[]>([]);

  const poppulateFilteredDocs = () => {
    const sops = store?.db?.sops;
    if (sops) {
      let filtered = [...sops];
      if (searchTerm !== "") {
        filtered = filtered.filter(
          (doc) =>
            doc?.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            doc?.documentNumber
              ?.toLowerCase()
              .includes(searchTerm?.toLowerCase())
        );
      }

      if (filterType !== "all") {
        filtered = filtered.filter((doc: any) => doc.type === filterType);
      }

      if (filterDepartment !== "all") {
        filtered = filtered.filter(
          (doc: any) =>
            store?.tools?.getDepartmentNameFromId(doc.department) ===
            filterDepartment
        );
      }

      setFilteredDocuments(filtered);
    }
  };

  useEffect(() => {
    poppulateFilteredDocs();
  }, [searchTerm, filterType, filterStatus, filterDepartment, store?.db?.sops]);

  const poppulateDepartments = () => {
    const sops = store?.db?.sops;
    let data = [];
    sops?.map((sop: any) => {
      const dept = store?.tools?.getDepartmentNameFromId(sop?.department);
      if (!data.includes(dept)) {
        data.push(dept);
      }
    });
    setDepartments(data);
  };
  useEffect(() => {
    poppulateDepartments();
  }, [store?.db?.sops]);

  return (
    <div className="flex flex-wrap items-center space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-36 bg-gray-700 border-gray-600">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Policy">Policy</SelectItem>
          <SelectItem value="SOP">SOP</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Under Review">Under Review</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterDepartment} onValueChange={setFilterDepartment}>
        <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
          <SelectValue placeholder="Filter by department" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          <SelectItem value="all">All Departments</SelectItem>
          {departments?.map((dept: any) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
export default FilterMenu;
