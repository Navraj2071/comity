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
  const users = store?.db?.allUsers || [];
  const departments = store?.db?.departments || [];
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
    let currentYear = new Date().getFullYear();
    dueDate.setFullYear(currentYear);
    return dueDate.toLocaleDateString();
  };
  const getUsername = (id: string) => {
    let username = "";
    users?.map((user: any) => {
      if (user._id === id) username = `${user.name} from ${user.department}`;
    });
    return username;
  };
  const getDepartment = (id: string) => {
    let name = "";
    departments?.map((department: any) => {
      if (department._id === id) name = department.name;
    });
    return name;
  };
  const getlatestVersion = (doc: any) => {
    let latestVersion = doc.versions[0];
    doc.versions.map((version: any) => {
      if (new Date(version.uploadDate) > new Date(latestVersion.uploadDate)) {
        latestVersion = version;
      }
    });
    return latestVersion;
  };

  let reviewer;
  let approver;
  let creator;
  let department;
  let currentVersion;
  try {
    reviewer = getUsername(getlatestVersion(selectedDocument).reviewedBy);
  } catch {}
  try {
    approver = getUsername(getlatestVersion(selectedDocument).approvedBy);
  } catch {}
  try {
    creator = getUsername(selectedDocument?.createdBy);
  } catch {}
  try {
    department = getDepartment(selectedDocument?.department);
  } catch {}
  try {
    currentVersion = getlatestVersion(selectedDocument).version;
  } catch {}

  useEffect(() => {}, [selectedDocument]);

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
                    <span className="text-white">{department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge
                      className={getStatusBadgeColor(selectedDocument.status)}
                    >
                      {selectedDocument.status}
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
                      <span className="text-white">
                        {getDueDate(selectedDocument)}
                      </span>
                      {getReviewStatus(selectedDocument.nextReviewDate)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reviewer:</span>
                    <span className="text-white">
                      {reviewer || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Approver:</span>
                    <span className="text-white">
                      {approver || "Not assigned"}
                    </span>
                  </div>
                  {selectedDocument &&
                    getlatestVersion(selectedDocument).approvalDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Approval Date:</span>
                        <span className="text-white">
                          {new Date(
                            getlatestVersion(selectedDocument).approvalDate
                          ).toLocaleDateString()}
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
                      <span className="text-white">{creator}</span>
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
                      <span className="text-white">v {currentVersion}</span>
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
                {selectedDocument.versions.map(
                  (version: any, index: number) => (
                    <div
                      key={version._id}
                      className="p-3 bg-gray-700 rounded-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium text-white">
                            Version {version.version}
                          </span>
                          {version === getlatestVersion(selectedDocument) && (
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
                              window.open(version.file);
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
                        {new Date(version.uploadDate).toLocaleDateString()} by{" "}
                        {getUsername(version.uploadedBy)}
                      </p>
                      <p className="text-sm text-gray-300 mb-2">
                        {version.changes}
                      </p>
                      {version.approvalDate && (
                        <div className="flex items-center text-xs text-green-400">
                          <span>
                            Approved on{" "}
                            {new Date(
                              version.approvalDate
                            ).toLocaleDateString()}{" "}
                            by {version.approvedBy}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300"
                onClick={() => {
                  try {
                    window.open(getlatestVersion(selectedDocument).file);
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
