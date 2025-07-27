import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { FileText, Upload, Download, Eye } from "lucide-react";
import CreateDocumentDialog from "./createdocumentdialog";
import { useState } from "react";
import FilterMenu from "./filters";

const Library = ({
  getStatusBadgeColor,
  setSelectedDocument,
  setIsVersionDialogOpen,
  store,
}: any) => {
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const downloadFile = async (doc: any) => {
    try {
      const version = store?.tools?.getlatestSopVersion(doc);
      window.open(version.file);
    } catch {
      alert("Unable to download.");
    }
  };

  const getStatus = (doc: any) => {
    let status = "draft";
    try {
      const version = store?.tools?.getlatestSopVersion(doc);
      if (version.reviewStatus === "pending") {
        status = "review pending";
      } else if (version.approvalStatus === "pending") {
        status = "approval pending";
      } else {
        status = "approved";
      }
    } catch {}
    return status;
  };

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
          <CreateDocumentDialog
            isCreateDialogOpen={isCreateDialogOpen}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
            store={store}
          />
        </div>
      </CardHeader>
      <CardContent>
        <FilterMenu store={store} setFilteredDocuments={setFilteredDocuments} />

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
                      {doc?.title}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {doc?.documentNumber}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gray-600 text-white">
                        {doc?.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {store?.tools?.getDepartmentNameFromId(doc?.department)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(doc.status)}>
                        {getStatus(doc)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center">---</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => {
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
                            downloadFile(doc);
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

export default Library;
