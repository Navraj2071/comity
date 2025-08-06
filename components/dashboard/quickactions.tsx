import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  AlertTriangle,
  Clock,
  FileText,
  Shield,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Quickactions = () => {
  const router = useRouter();

  return (
    <Card
      className="bg-gray-800 border-gray-700 shadow-xl mb-6 animate-fadeIn overflow-hidden hover:shadow-2xl transition-all duration-300"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent"></div>
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-sm font-semibold text-white uppercase tracking-wider">
          Quick Actions
        </CardTitle>
        <CardDescription className="text-xs text-gray-400">
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <Button
            onClick={() => router.push("/checkpoints")}
            className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
          >
            <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <span className="truncate">New Checkpoint</span>
          </Button>
          <Button
            onClick={() => router.push("/policies-sops")}
            className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
          >
            <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="truncate">Policies & SOPs</span>
          </Button>
          <Button
            onClick={() => router.push("/rbi-audit")}
            className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
          >
            <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="truncate">RBI Audit</span>
          </Button>
          <Button
            onClick={() => router.push("/users")}
            className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
          >
            <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <span className="truncate">Manage Users</span>
          </Button>
          <Button
            onClick={() => router.push("/regulatory-departments")}
            className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
          >
            <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
              <Shield className="h-4 w-4" />
            </div>
            <span className="truncate">Regulatory Depts</span>
          </Button>
          <Button
            onClick={() => router.push("/reports")}
            className="h-16 flex items-center justify-start px-3 space-x-2 bg-yellow-500 hover:bg-yellow-600 transform transition-all duration-300 hover:scale-102 hover:shadow-lg text-sm shadow-lg min-w-0"
          >
            <div className="h-8 w-8 rounded-full bg-yellow-600/50 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-4 w-4" />
            </div>
            <span className="truncate">Generate Report</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Quickactions;
