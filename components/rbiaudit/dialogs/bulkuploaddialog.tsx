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
import Bulkuploadview from "../bulkuploadview";

const Bulkuploaddialog = ({ audit }: any) => {
  const [uploadeddata, setUploadeddata] = useState<any>([]);

  const handleUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none"; // Hidden
    document.body.appendChild(input);

    input.onchange = async (event: any) => {
      const file = event.target.files[0];

      processCsv(file, input);
    };

    input.click();
  };

  const processCsv = async (file: File, input: any) => {
    const csvText = await file.text();

    // Split into rows
    const rows = csvText.trim().split("\n");
    console.log(rows);

    // Get headers
    const headers = rows[0].split(",").map((header: any) => header.trim());

    // Parse rows into objects
    const data = rows.slice(1).map((row: any) => {
      const values = row.split(",").map((val: any) => val.trim());
      const obj = {} as any;
      headers.forEach((header: string, index: number) => {
        obj[header] = values[index] || "";
      });
      return obj;
    });

    setUploadeddata(data);

    if (input) {
      document.body.removeChild(input);
    }
  };

  return (
    <Dialog
      open={audit?.showBulkUpload}
      onOpenChange={audit?.setShowBulkUpload}
    >
      {uploadeddata && uploadeddata.length > 0 ? (
        <Bulkuploadview data={uploadeddata} />
      ) : (
        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Bulk Upload Observations</DialogTitle>
            <DialogDescription className="text-gray-400">
              Upload multiple observations using CSV or Excel file
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <DragAndDrop handleUpload={handleUpload} processCsv={processCsv} />
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">
                File Format Requirements:
              </h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>
                  • Include columns: Observation Number, Title, Description,
                  Severity, Department, etc.
                </li>
                <li>• Supported formats: CSV (.csv)</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Download template file for reference</li>
              </ul>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => window.open("/RBI_Audit_Template.csv")}
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
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={handleUpload}
              >
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default Bulkuploaddialog;

const DragAndDrop = ({ handleUpload, processCsv }: any) => {
  const [isOver, setIsOver] = useState(false);
  const [dropped, setDropped] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    setDropped(true);
    processCsv(e.dataTransfer.files[0], null);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isOver ? "border-blue-500 bg-gray-900" : "border-gray-600 "
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-400 mb-2">
        Drop your CSV or Excel file here, or click to browse
      </p>
      <Button
        variant="outline"
        className="border-gray-600 text-gray-300 hover:bg-gray-700"
        onClick={handleUpload}
      >
        Choose File
      </Button>
    </div>
  );
};
