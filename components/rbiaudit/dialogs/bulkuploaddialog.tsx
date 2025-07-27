import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Upload } from "lucide-react";
const Bulkuploaddialog = ({ audit }: any) => {
  return (
    <Dialog
      open={audit?.showBulkUpload}
      onOpenChange={audit?.setShowBulkUpload}
    >
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Bulk Upload Observations</DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload multiple observations using CSV or Excel file
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400 mb-2">
              Drop your CSV or Excel file here, or click to browse
            </p>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Choose File
            </Button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">
              File Format Requirements:
            </h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                • Include columns: Observation Number, Title, Description,
                Severity, Department, etc.
              </li>
              <li>• Supported formats: CSV, Excel (.xlsx)</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Download template file for reference</li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
          <div className="flex justify-en gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => audit?.setShowBulkUpload(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Bulkuploaddialog;
