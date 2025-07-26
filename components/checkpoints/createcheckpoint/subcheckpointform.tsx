import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Plus,
  Trash2,
  Upload,
  Download,
  FileText,
  Settings,
} from "lucide-react";
const Subcheckpointform = ({ script, store }: any) => {
  const {
    checkpointForm,
    updateSubCheckpoint,
    removeSubCheckpoint,
    getUpcomingDeadline,
    getSpoc,
  } = script;

  return (
    <>
      {checkpointForm?.subCheckpoints.map(
        (subCheckpoint: any, index: number) => (
          <div
            key={index}
            className="p-4 border border-gray-600 rounded-lg space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-300">
                Sub-checkpoint {index + 1}
              </h4>
              {checkpointForm?.subCheckpoints.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSubCheckpoint(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Basic Sub-checkpoint Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 col-span-2">
                <Label>Title</Label>
                <Input
                  placeholder="Sub-checkpoint title"
                  className="bg-gray-700 border-gray-600"
                  value={subCheckpoint.title}
                  onChange={(e) =>
                    updateSubCheckpoint(index, "title", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Assigned Department</Label>
                <Select
                  value={subCheckpoint.department}
                  onValueChange={(value) => {
                    updateSubCheckpoint(index, "department", value);
                    updateSubCheckpoint(index, "assignedTo", "");
                  }}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {store?.db?.departments?.map((dept: any) => (
                      <SelectItem
                        key={`department-select-${dept._id}`}
                        value={dept._id}
                      >
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assigned User</Label>
                <Input
                  className="bg-gray-700 border-gray-600"
                  value={getSpoc(subCheckpoint.department)}
                  disabled
                  onChange={(e) =>
                    updateSubCheckpoint(index, "title", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>
                  {checkpointForm.type === "recurring" ? "Upcoming " : ""}
                  Deadline
                </Label>
                <Input
                  type={checkpointForm.type === "recurring" ? "text" : "date"}
                  disabled={checkpointForm.type === "recurring"}
                  className="bg-gray-700 border-gray-600"
                  value={
                    checkpointForm.type === "recurring"
                      ? getUpcomingDeadline()
                      : subCheckpoint.deadline
                  }
                  onChange={(e) =>
                    updateSubCheckpoint(index, "deadline", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Submission Configuration */}
            <div className="border-t border-gray-600 pt-4">
              <h5 className="font-medium text-gray-300 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Submission Configuration
              </h5>

              {/* Remarks Configuration */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`remarks-required-${index}`}
                    checked={subCheckpoint.isRemarksRequired}
                    onCheckedChange={(checked) =>
                      updateSubCheckpoint(index, "isRemarksRequired", checked)
                    }
                  />
                  <Label htmlFor={`remarks-required-${index}`}>
                    Make remarks mandatory
                  </Label>
                </div>

                {subCheckpoint.isRemarksRequired && (
                  <div className="grid grid-cols-2 gap-3 ml-6">
                    <div className="space-y-2">
                      <Label>Remarks Type</Label>
                      <Select
                        value={subCheckpoint.remarksType}
                        onValueChange={(value) =>
                          updateSubCheckpoint(index, "remarksType", value)
                        }
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Placeholder Text</Label>
                      <Input
                        placeholder="Enter placeholder text"
                        className="bg-gray-700 border-gray-600"
                        value={subCheckpoint.remarksPlaceholder}
                        onChange={(e) =>
                          updateSubCheckpoint(
                            index,
                            "remarksPlaceholder",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Attachment Configuration */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`attachment-required-${index}`}
                    checked={subCheckpoint.isAttachmentRequired}
                    onCheckedChange={(checked) =>
                      updateSubCheckpoint(
                        index,
                        "isAttachmentRequired",
                        checked
                      )
                    }
                  />
                  <Label htmlFor={`attachment-required-${index}`}>
                    Make evidence/attachment mandatory
                  </Label>
                </div>

                {subCheckpoint.isAttachmentRequired && (
                  <div className="ml-6">
                    <Label>Response Template (Optional)</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-4">
                      {subCheckpoint.responseTemplate ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">
                              {subCheckpoint.responseTemplate?.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              (
                              {(
                                subCheckpoint.responseTemplate?.size / 1024
                              ).toFixed(1)}{" "}
                              KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateSubCheckpoint(
                                index,
                                "responseTemplate",
                                null
                              )
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-400 mb-2">
                            Upload response template
                          </p>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                                updateSubCheckpoint(
                                  index,
                                  "responseTemplate",
                                  file
                                );
                            }}
                            className="hidden"
                            id={`template-upload-${index}`}
                          />
                          <Label
                            htmlFor={`template-upload-${index}`}
                            className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
                          >
                            Choose File
                          </Label>
                          <p className="text-xs text-gray-500 mt-2">
                            Supported: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Subcheckpointform;
