import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Upload,
  Download,
  FileText,
  Settings,
} from "lucide-react";
import {
  type CheckpointType,
  type RecurringFrequency,
  getFinancialYears,
} from "@/lib/storage";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { getSomeValueWithId } from "@/lib/tools";

const EditCheckpoint = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  selectedCheckpoint,
  store,
}: any) => {
  const api = useapi();
  const users = store?.db?.allUsers;
  const departments = store?.db?.departments;
  const regulatoryDepartments = store?.db?.regulatoryDepartments;
  const [checkpointForm, setCheckpointForm] = useState({
    letterNumber: "",
    date: "",
    regulatory: "",
    title: "",
    details: "",
    type: "ad-hoc" as CheckpointType,
    financialYear: "",
    frequency: "" as RecurringFrequency,
    subCheckpoints: [
      {
        title: "",
        department: "",
        deadline: "",
        isRemarksRequired: false,
        remarksType: "text",
        remarksPlaceholder: "",
        isAttachmentRequired: false,
        responseTemplate: null,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [createMode, setCreateMode] = useState("manual");
  const [financialYears, setFinancialYears] = useState<string[]>([]);

  useEffect(() => {
    setFinancialYears(getFinancialYears());
  }, []);

  useEffect(() => {
    setCheckpointForm(selectedCheckpoint);
  }, [selectedCheckpoint]);

  const addSubCheckpoint = (index: number) => {
    setCheckpointForm((prev: any) => {
      let newFormData = { ...prev };
      newFormData.subCheckpoints[index] = {
        title: "",
        department: "",
        deadline: "",
        isRemarksRequired: false,
        remarksType: "text",
        remarksPlaceholder: "",
        isAttachmentRequired: false,
        responseTemplate: null,
      };

      return newFormData;
    });
  };

  const removeSubCheckpoint = (index: number) => {
    // setSubCheckpoints(subCheckpoints.filter((_, i) => i !== index));
    setCheckpointForm((prev) => {
      let newFormData = { ...prev };
      newFormData.subCheckpoints = newFormData.subCheckpoints.filter(
        (_, i) => i !== index
      );
      return newFormData;
    });
  };

  const updateSubCheckpoint = (index: number, field: string, value: any) => {
    setCheckpointForm((prev) => {
      let newData = { ...prev };
      newData.subCheckpoints[index] = {
        ...newData.subCheckpoints[index],
        [field]: value,
      };
      return newData;
    });
  };

  const handleBulkUpload = async (file: File) => {
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none"; // Hidden
    document.body.appendChild(input);

    // 2. Define the onchange handler
    input.onchange = async (event) => {
      const file = event.target.files[0];

      const text = await file.text();
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const mainCheckpointHeaders = lines[0]
        .split(",")
        .slice(0, 8)
        .map((h) => h.trim());

      const mainCheckpointValues = lines[1]
        .split(",")
        .slice(0, 8)
        .map((v) => v.trim());

      let regDept = "";
      try {
        regulatoryDepartments.map((dept: any) => {
          if (dept.name === mainCheckpointValues[2]) regDept = dept._id;
        });
      } catch {}

      const checkpointData = {
        letterNumber: mainCheckpointValues[0],
        date: mainCheckpointValues[1],
        regulatory: regDept,
        // regulatory: mainCheckpointValues[2],
        title: mainCheckpointValues[3],
        details: mainCheckpointValues[4],
        type: mainCheckpointValues[5],
        financialYear: mainCheckpointValues[6],
        frequency: mainCheckpointValues[7],
        subCheckpoints: [],
      };

      const subCheckpointHeaders = lines[0]
        .split(",")
        .slice(8)
        .join(",")
        .split(",")
        .map((h) => h.trim());

      for (let i = 2; i < lines.length; i++) {
        const row = lines[i].split(",").map((v) => v.trim());
        const subRow = row.slice(8);

        let department = "";
        try {
          departments.map((dept: any) => {
            if (dept.name === subRow[2]) department = dept._id;
          });
        } catch {}

        const subCheckpoint = {
          title: subRow[1],
          department: department,
          deadline: subRow[3],
          isRemarksRequired: subRow[4].toLowerCase() === "true",
          remarksType: subRow[5],
          remarksPlaceholder: subRow[6],
          isAttachmentRequired: subRow[7].toLowerCase() === "true",
          responseTemplate: null,
        };

        checkpointData.subCheckpoints.push(subCheckpoint);
      }

      console.log(checkpointData);
      console.log(checkpointForm);

      setCheckpointForm(checkpointData);
      setCreateMode("manual");

      document.body.removeChild(input);
    };

    input.click();
  };

  const downloadBulkTemplate = () => {
    try {
      window.open("/checkpoint_template.csv");
    } catch {
      alert("Unable to download!");
    }
  };

  const handleCreateCheckpoint = async () => {
    setLoading(true);
    let apiData = { ...checkpointForm };
    await Promise.all(
      apiData.subCheckpoints?.map(async (spoint) => {
        if (spoint.responseTemplate) {
          await api
            .fileUpload(spoint.responseTemplate)
            .then((res) => {
              if (res.url) {
                spoint.responseTemplate = res.url;
              } else {
                spoint.responseTemplate = "";
              }
            })
            .catch((err) => console.log(err));
        }
      })
    );

    await api
      .createCheckpoint({ ...checkpointForm })
      .then((res) => {
        console.log(res);
        setIsCreateDialogOpen(false);
        store.update("checkpoints");
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const getUpcomingDeadline = () => {
    const frequency = checkpointForm.frequency;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    let deadline = now;

    if (frequency === "monthly") {
      deadline = new Date(year, month + 1, 0);
    }
    return `${deadline.toLocaleDateString()}, recurring ${frequency}`;
  };

  const getAssignedTo = (subpointIndex: number) => {
    const assignedToId = getSomeValueWithId(
      "spoc",
      departments,
      checkpointForm.subCheckpoints[subpointIndex].department
    );
    const name = getSomeValueWithId("name", users, assignedToId);
    return name;
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="h-4 w-4 mr-2" />
          New Checkpoint
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Compliance Checkpoint</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new regulatory compliance checkpoint with sub-checkpoints.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={createMode}
          onValueChange={setCreateMode}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger
              value="manual"
              className="data-[state=active]:bg-gray-600"
            >
              Manual Entry
            </TabsTrigger>
            <TabsTrigger
              value="bulk"
              className="data-[state=active]:bg-gray-600"
            >
              Bulk Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6 mt-6">
            {/* Checkpoint Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Checkpoint Type
              </h3>
              <RadioGroup
                value={checkpointForm.type}
                onValueChange={(value) =>
                  setCheckpointForm((prev) => ({
                    ...prev,
                    type: value as CheckpointType,
                  }))
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ad-hoc" id="ad-hoc" />
                  <Label htmlFor="ad-hoc">Ad-hoc</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring">Recurring</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Main Checkpoint Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Checkpoint Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="letter-number">
                    Letter/Circular/MD Number
                  </Label>
                  <Input
                    id="letter-number"
                    placeholder="e.g., RBI/2024/001"
                    className="bg-gray-700 border-gray-600"
                    value={checkpointForm.letterNumber}
                    onChange={(e) =>
                      setCheckpointForm((prev) => ({
                        ...prev,
                        letterNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    className="bg-gray-700 border-gray-600"
                    value={checkpointForm.date}
                    onChange={(e) =>
                      setCheckpointForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regulatory">Regulatory Department</Label>
                  <Select
                    value={checkpointForm.regulatory}
                    onValueChange={(value) =>
                      setCheckpointForm((prev) => ({
                        ...prev,
                        regulatory: value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select regulatory body" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {regulatoryDepartments &&
                        regulatoryDepartments?.length > 0 &&
                        regulatoryDepartments?.map((dept: any, i: number) => (
                          <SelectItem
                            value={dept.name}
                            key={`dept-${dept._id}`}
                          >
                            {dept.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief title for the checkpoint"
                    className="bg-gray-700 border-gray-600"
                    value={checkpointForm.title}
                    onChange={(e) =>
                      setCheckpointForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Type-specific fields */}
              <div className="grid grid-cols-2 gap-4">
                {checkpointForm.type === "ad-hoc" && (
                  <div className="space-y-2">
                    <Label htmlFor="financial-year">Financial Year</Label>
                    <Select
                      value={checkpointForm.financialYear}
                      onValueChange={(value) =>
                        setCheckpointForm((prev) => ({
                          ...prev,
                          financialYear: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select financial year" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {financialYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {checkpointForm.type === "recurring" && (
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={checkpointForm.frequency}
                      onValueChange={(value) =>
                        setCheckpointForm((prev) => ({
                          ...prev,
                          frequency: value as RecurringFrequency,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  placeholder="Detailed description of the compliance requirement"
                  className="bg-gray-700 border-gray-600"
                  rows={3}
                  value={checkpointForm.details}
                  onChange={(e) =>
                    setCheckpointForm((prev) => ({
                      ...prev,
                      details: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Sub-checkpoints */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Sub-checkpoints
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentLength =
                      checkpointForm?.subCheckpoints?.length;
                    addSubCheckpoint(currentLength);
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sub-checkpoint
                </Button>
              </div>
              {checkpointForm?.subCheckpoints.map((subCheckpoint, index) => (
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
                          {departments?.map((dept: any) => (
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
                      <Select
                        value={getAssignedTo(index)}
                        onValueChange={(value) =>
                          updateSubCheckpoint(index, "assignedTo", value)
                        }
                        disabled={true}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {users
                            ?.filter(
                              (user: any) =>
                                user.department === subCheckpoint.department ||
                                user.department === "IT" ||
                                departments?.find(
                                  (d: any) =>
                                    d.name === subCheckpoint.department
                                )?.name === user.department
                            )
                            .map((user: any) => (
                              <SelectItem key={user._id} value={user.name}>
                                {user.name} ({user.role})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>
                        {checkpointForm.type === "recurring" ? "Upcoming " : ""}
                        Deadline
                      </Label>
                      <Input
                        type={
                          checkpointForm.type === "recurring" ? "text" : "date"
                        }
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
                            updateSubCheckpoint(
                              index,
                              "isRemarksRequired",
                              checked
                            )
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
                                <SelectItem value="percentage">
                                  Percentage
                                </SelectItem>
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
                                      subCheckpoint.responseTemplate?.size /
                                      1024
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
                                  Supported: PDF, DOC, DOCX, XLS, XLSX (Max
                                  10MB)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

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
                  <li>
                    • Group sub-checkpoints by using the same Letter Number
                  </li>
                  <li>
                    • Leave cells empty for sub-checkpoints that belong to the
                    same main checkpoint
                  </li>
                  <li>• Review the data before clicking "Create Checkpoint"</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {status && status !== "" && (
          <Alert className="bg-red-900/20 border-red-800 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}

        {createMode === "manual" && (
          <DialogFooter className="pt-4">
            <Button
              type="button"
              className="bg-yellow-500 hover:bg-yellow-600"
              onClick={handleCreateCheckpoint}
              disabled={loading || createMode === "bulk"}
            >
              {loading ? (
                <ClipLoader
                  color={"#000000"}
                  loading={true}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <>Create Checkpoint</>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCheckpoint;
