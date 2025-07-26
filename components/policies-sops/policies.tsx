"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  FileText,
  Upload,
  Download,
  Eye,
  Plus,
  Search,
  Clock,
  AlertTriangle,
} from "lucide-react";

import useStore from "@/lib/store/useStore";
import DocumentDetailsDialog from "./documentdetails";
import CreateDocumentDialog from "./createdocumentdialog";
import NewVersionDialog from "./newVersionDialog";

export default function PoliciesSOPsPage() {
  const store = useStore();
  const user = store?.db?.user;
  const documents = store?.db?.sops;
  const departments = ["IT", "Compliance", "RBI"];

  const filteredDocuments = documents;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const getReviewStatus = (nextReviewDate: string) => {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    const reviewDate = new Date(nextReviewDate);

    if (reviewDate < today) {
      return <Badge className="bg-red-600 text-white ml-2">Overdue</Badge>;
    } else if (reviewDate <= threeMonthsFromNow) {
      return <Badge className="bg-yellow-600 text-white ml-2">Due Soon</Badge>;
    }
    return null;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-600 text-white";
      case "Under Review":
        return "bg-yellow-600 text-white";
      case "Approved":
        return "bg-green-600 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const FilterMenu = ({}: any) => {
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

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Policies & SOPs
          </h1>
          <p className="text-gray-400">
            Manage organizational policies and standard operating procedures
          </p>
        </div>
        <Summary documents={documents} />

        <CreateDocumentDialog
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          store={store}
        />

        <Library
          filteredDocuments={filteredDocuments}
          getReviewStatus={getReviewStatus}
          getStatusBadgeColor={getStatusBadgeColor}
          setSelectedDocument={setSelectedDocument}
          setIsVersionDialogOpen={setIsVersionDialogOpen}
          FilterMenu={FilterMenu}
        />
      </div>
      {selectedDocument && (
        <DocumentDetailsDialog
          selectedDocument={selectedDocument}
          setSelectedDocument={setSelectedDocument}
          getStatusBadgeColor={getStatusBadgeColor}
          getReviewStatus={getReviewStatus}
          store={store}
        />
      )}
      <NewVersionDialog
        isVersionDialogOpen={isVersionDialogOpen}
        setIsVersionDialogOpen={setIsVersionDialogOpen}
        selectedDocument={selectedDocument}
        store={store}
      />
    </main>
  );
}

const Summary = ({ documents }: any) => {
  const getDueDate = (doc: any) => {
    const createdDate = new Date(doc.createdDate);
    const dueDate = new Date(createdDate);
    if (doc.reviewFrequency === "Annually") {
      dueDate.setMonth(dueDate.getMonth() + 12);
    } else if (doc.reviewFrequency === "Bi-annually") {
      dueDate.setMonth(dueDate.getMonth() + 6);
    } else if (doc.reviewFrequency === "Quarterly") {
      dueDate.setMonth(dueDate.getMonth() + 3);
    }
    return dueDate;
  };
  const getlatestVersion = (doc: any) => {
    let latestVersion = doc.versioons[0];
    doc.versions.map((version: any) => {
      if (new Date(version.uploadDate) > new Date(latestVersion.uploadDate)) {
        latestVersion = version;
      }
    });
    return latestVersion;
  };
  const getOverDue = () => {
    let overdue = 0;
    documents.map((doc: any) => {
      let duedate = getDueDate(doc);
      let createddate = new Date(doc.createdDate);
    });
    return overdue;
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Documents</p>
              <p className="text-2xl font-bold text-white">
                {documents?.length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Due Soon</p>
              <p className="text-2xl font-bold text-yellow-400">{5}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Overdue</p>
              <p className="text-2xl font-bold text-red-400">{10}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Library = ({
  filteredDocuments,
  getReviewStatus,
  getStatusBadgeColor,
  setSelectedDocument,
  setIsVersionDialogOpen,
  FilterMenu,
}: any) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Document Library</CardTitle>
            <CardDescription className="text-gray-400">
              Manage policies and standard operating procedures
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FilterMenu />

        <div className="rounded-md border border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Document #</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Department</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Next Review</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments?.length > 0 ? (
                filteredDocuments?.map((doc: any) => (
                  <TableRow key={doc._id} className="border-gray-700">
                    <TableCell className="font-medium text-white">
                      {doc.title}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {doc.documentNumber}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gray-600 text-white">
                        {doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {doc.department}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center">
                        {new Date(doc.nextReviewDate).toLocaleDateString()}
                        {getReviewStatus(doc.nextReviewDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            console.log("Setting selected doc: ", doc);
                            setSelectedDocument(doc);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-400 hover:text-green-300"
                          onClick={() => {
                            // Download logic would go here
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-yellow-400 hover:text-yellow-300"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setIsVersionDialogOpen(true);
                          }}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-gray-400"
                  >
                    No documents found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
