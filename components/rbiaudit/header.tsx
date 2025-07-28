import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, Filter } from "lucide-react";

const Header = ({ audit }: any) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">RBI Audit Compliance</h1>
        <p className="text-gray-400 mt-1">
          {audit?.categoryFilter !== "all"
            ? `Viewing ${
                audit?.AUDIT_CATEGORIES[audit?.categoryFilter]
              } observations`
            : "Track and manage RBI audit observations"}
        </p>
      </div>
      <div className="flex gap-2 items-center">
        {audit?.categoryFilter !== "all" && (
          <Button
            onClick={() => {
              audit?.setCategoryFilter("all");
              audit?.setSelectedCategory(null);
            }}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Filter className="h-4 w-4 mr-2" />
            Show All Categories
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Label className="text-gray-400 text-sm">Financial Year:</Label>
          <Select
            value={audit?.selectedFinancialYear}
            onValueChange={audit?.setSelectedFinancialYear}
          >
            <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value={"all"}>All years</SelectItem>
              {audit?.financialYears.map((year: string) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => audit?.setShowBulkUpload(true)}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>
        <Button
          onClick={() => audit?.setShowAddDialog(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Observation
        </Button>
      </div>
    </div>
  );
};

export default Header;
