import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ShieldAlert,
  ClipboardCheck,
  FileSearch,
  AlertOctagon,
  Filter,
} from "lucide-react";
const Categorycards = ({ audit }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        className={`bg-gray-800 border-gray-700 cursor-pointer hover:border-[#e9b306] transition-all duration-200 ${
          audit?.categoryFilter === "RMP" ? "border-[#e9b306] border-2" : ""
        }`}
        onClick={() => {
          audit?.setCategoryFilter("RMP");
          audit?.setSelectedCategory("RMP");
        }}
      >
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[#e9b306]" />
              <span>RMP</span>
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs">
              Risk Mitigation Plan
            </CardDescription>
          </div>
          <Badge className="bg-[#e9b306] text-black">
            {audit?.categoryStats.RMP.total}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Open:</span>
              <span className="text-blue-400">
                {audit?.categoryStats.RMP.open}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">In Progress:</span>
              <span className="text-yellow-400">
                {audit?.categoryStats?.RMP.inProgress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Closed:</span>
              <span className="text-green-400">
                {audit?.categoryStats.RMP.closed}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Overdue:</span>
              <span className="text-red-400">
                {audit?.categoryStats.RMP.overdue}
              </span>
            </div>
          </div>
          <Progress
            value={
              audit?.categoryStats?.RMP.total > 0
                ? (audit?.categoryStats.RMP.closed /
                    audit?.categoryStats.RMP.total) *
                  100
                : 0
            }
            className="h-1 mt-3"
          />
        </CardContent>
      </Card>

      {/* IRAR Card */}
      <Card
        className={`bg-gray-800 border-gray-700 cursor-pointer hover:border-[#e9b306] transition-all duration-200 ${
          audit?.categoryFilter === "IRAR" ? "border-[#e9b306] border-2" : ""
        }`}
        onClick={() => {
          audit?.setCategoryFilter("IRAR");
          audit?.setSelectedCategory("IRAR");
        }}
      >
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-[#e9b306]" />
              <span>IRAR</span>
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs">
              Inspection & Risk Assessment
            </CardDescription>
          </div>
          <Badge className="bg-[#e9b306] text-black">
            {audit?.categoryStats.IRAR.total}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Open:</span>
              <span className="text-blue-400">
                {audit?.categoryStats.IRAR.open}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">In Progress:</span>
              <span className="text-yellow-400">
                {audit?.categoryStats.IRAR.inProgress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Closed:</span>
              <span className="text-green-400">
                {audit?.categoryStats.IRAR.closed}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Overdue:</span>
              <span className="text-red-400">
                {audit?.categoryStats.IRAR.overdue}
              </span>
            </div>
          </div>
          <Progress
            value={
              audit?.categoryStats.IRAR.total > 0
                ? (audit?.categoryStats.IRAR.closed /
                    audit?.categoryStats.IRAR.total) *
                  100
                : 0
            }
            className="h-1 mt-3"
          />
        </CardContent>
      </Card>

      {/* SSI Card */}
      <Card
        className={`bg-gray-800 border-gray-700 cursor-pointer hover:border-[#e9b306] transition-all duration-200 ${
          audit?.categoryFilter === "SSI" ? "border-[#e9b306] border-2" : ""
        }`}
        onClick={() => {
          audit?.setCategoryFilter("SSI");
          audit?.setSelectedCategory("SSI");
        }}
      >
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-[#e9b306]" />
              <span>SSI</span>
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs">
              Select Scope Inspection
            </CardDescription>
          </div>
          <Badge className="bg-[#e9b306] text-black">
            {audit?.categoryStats.SSI.total}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Open:</span>
              <span className="text-blue-400">
                {audit?.categoryStats.SSI.open}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">In Progress:</span>
              <span className="text-yellow-400">
                {audit?.categoryStats.SSI.inProgress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Closed:</span>
              <span className="text-green-400">
                {audit?.categoryStats.SSI.closed}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Overdue:</span>
              <span className="text-red-400">
                {audit?.categoryStats.SSI.overdue}
              </span>
            </div>
          </div>
          <Progress
            value={
              audit?.categoryStats.SSI.total > 0
                ? (audit?.categoryStats.SSI.closed /
                    audit?.categoryStats.SSI.total) *
                  100
                : 0
            }
            className="h-1 mt-3"
          />
        </CardContent>
      </Card>

      {/* MNCR Card */}
      <Card
        className={`bg-gray-800 border-gray-700 cursor-pointer hover:border-[#e9b306] transition-all duration-200 ${
          audit?.categoryFilter === "MNCR" ? "border-[#e9b306] border-2" : ""
        }`}
        onClick={() => {
          audit?.setCategoryFilter("MNCR");
          audit?.setSelectedCategory("MNCR");
        }}
      >
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-[#e9b306]" />
              <span>MNCR</span>
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs">
              Mandatory Non-compliance
            </CardDescription>
          </div>
          <Badge className="bg-[#e9b306] text-black">
            {audit?.categoryStats.MNCR.total}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Open:</span>
              <span className="text-blue-400">
                {audit?.categoryStats.MNCR.open}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">In Progress:</span>
              <span className="text-yellow-400">
                {audit?.categoryStats.MNCR.inProgress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Closed:</span>
              <span className="text-green-400">
                {audit?.categoryStats.MNCR.closed}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Overdue:</span>
              <span className="text-red-400">
                {audit?.categoryStats.MNCR.overdue}
              </span>
            </div>
          </div>
          <Progress
            value={
              audit?.categoryStats.MNCR.total > 0
                ? (audit?.categoryStats.MNCR.closed /
                    audit?.categoryStats.MNCR.total) *
                  100
                : 0
            }
            className="h-1 mt-3"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Categorycards;
