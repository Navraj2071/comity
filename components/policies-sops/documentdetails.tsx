"use client";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download } from "lucide-react";
import { useEffect } from "react";

const DocumentDetailsDialog = ({
  selectedDocument,
  setSelectedDocument,
  getStatusBadgeColor,
  getReviewStatus,
  store,
}: any) => {
  if (!selectedDocument) return null;

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

  const version = store?.tools?.getlatestSopVersion(selectedDocument);

  const dataDisplay = {
    department: store?.tools?.getDepartmentNameFromId(
      selectedDocument?.department
    ),
    status: getStatus(selectedDocument),
    approvedBy: store?.tools?.getUserNameFromId(version?.approvedBy),
    reviewedBy: store?.tools?.getUserNameFromId(version?.reviewedBy),
    approvalDate: new Date(version?.approvalDate).toLocaleDateString() || "",
    uploadedBy: store?.tools?.getUserNameFromId(version?.uploadedBy),
    currentVersion: version?.version,
  };

  return (
    <Dialog
      open={!!selectedDocument}
      onOpenChange={() => setSelectedDocument(null)}
    >
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedDocument?.title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {selectedDocument?.documentNumber}
          </DialogDescription>
        </DialogHeader>
        {selectedDocument && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  Document Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <Badge
                      className={
                        selectedDocument.type === "Policy"
                          ? "bg-blue-600"
                          : "bg-purple-600"
                      }
                    >
                      {selectedDocument?.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">
                      {selectedDocument.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Department:</span>
                    <span className="text-white">{dataDisplay.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge className={getStatusBadgeColor(dataDisplay.status)}>
                      {dataDisplay.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Review Frequency:</span>
                    <span className="text-white">
                      {selectedDocument.reviewFrequency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Next Review:</span>
                    <div className="flex items-center">
                      <span className="text-white">{"---"}</span>
                      {getReviewStatus(selectedDocument.nextReviewDate)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reviewer:</span>
                    <span className="text-white">
                      {dataDisplay.reviewedBy || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Approver:</span>
                    <span className="text-white">
                      {dataDisplay.reviewedBy || "Not assigned"}
                    </span>
                  </div>
                  {selectedDocument && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Approval Date:</span>
                      <span className="text-white">
                        {dataDisplay.approvalDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-300">
                  {selectedDocument.description}
                </p>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Document History
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created By:</span>
                      <span className="text-white">
                        {dataDisplay.uploadedBy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created Date:</span>
                      <span className="text-white">
                        {new Date(
                          selectedDocument.createdDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Version:</span>
                      <span className="text-white">
                        v {dataDisplay.currentVersion}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">
                Version History
              </h3>
              <div className="space-y-3">
                {selectedDocument.versions.map((ver: any, index: number) => (
                  <div key={ver._id} className="p-3 bg-gray-700 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium text-white">
                          Version {ver.version}
                        </span>
                        {ver === version && (
                          <Badge className="ml-2 bg-blue-600 text-white text-xs">
                            Latest
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => {
                          try {
                            window.open(ver.file);
                          } catch {
                            alert("Unable to download!");
                          }
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">
                      Uploaded on{" "}
                      {new Date(ver.uploadDate).toLocaleDateString()} by{" "}
                      {store?.tools?.getUserNameFromId(ver?.uploadedBy)}
                    </p>
                    <p className="text-sm text-gray-300 mb-2">{ver.changes}</p>
                    {ver.approvalDate && (
                      <div className="flex items-center text-xs text-green-400">
                        <span>
                          Approved on{" "}
                          {new Date(ver.approvalDate).toLocaleDateString()}{" "}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300"
                onClick={() => {
                  try {
                    window.open(version?.file);
                  } catch {
                    alert("Unable to download!!");
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Latest
              </Button>
              {selectedDocument.status === "Draft" && (
                <Button className="bg-yellow-500 hover:bg-yellow-600">
                  Submit for Review
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDetailsDialog;
