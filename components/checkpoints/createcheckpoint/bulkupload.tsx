import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Upload, Download } from "lucide-react";

const Bulkupload = ({ script }: any) => {
  const { downloadBulkTemplate, handleBulkUpload } = script;

  return (
    <TabsContent value="bulk" className="space-y-6 mt-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Bulk Upload Checkpoints
          </h3>
          <Button
            type="button"
            variant="outline"
            onClick={downloadBulkTemplate}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-white font-medium mb-2">
              Upload CSV or Excel file
            </p>
            <p className="text-gray-400 mb-4">
              Drop your file here or click to browse
            </p>

            <Label
              htmlFor="bulk-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md font-medium"
              onClick={handleBulkUpload}
            >
              Choose File
            </Label>
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: CSV (Max 5MB)
            </p>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <h4 className="font-medium text-blue-300 mb-2">
            Upload Instructions:
          </h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Ensure your file follows the template format</li>
            <li>• Each row represents a sub-checkpoint</li>
            <li>• Group sub-checkpoints by using the same Letter Number</li>
            <li>
              • Leave cells empty for sub-checkpoints that belong to the same
              main checkpoint
            </li>
            <li>• Review the data before clicking "Create Checkpoint"</li>
          </ul>
        </div>
      </div>
    </TabsContent>
  );
};

export default Bulkupload;
