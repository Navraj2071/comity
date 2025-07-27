import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useapi from "@/components/api/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

const Addialog = ({ audit }: any) => {
  const api = useapi();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleAddObservation = async (formData: FormData) => {
    const newObservation = {
      observationNumber: formData.get("observationNumber") as string,
      auditDate: formData.get("auditDate") as string,
      auditType: formData.get("auditType") as string,
      category: formData.get("auditCategory") as string,
      observationCategory: formData.get("category") as string,
      severity: formData.get("severity") as any,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      recommendation: formData.get("recommendation") as string,
      department: formData.get("assignedDepartment") as string,
      assignedTo: formData.get("assignedTo") as string,
      targetDate: formData.get("targetDate") as string,
      status: "Open" as any,
      progress: 0,
    };

    setStatus("");
    setLoading(true);
    await api
      .createObservation(newObservation)
      .then((res) => {
        audit?.store?.update("observations");
        audit?.setShowAddDialog(false);
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  return (
    <Dialog open={audit?.showAddDialog} onOpenChange={audit?.setShowAddDialog}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Add New RBI Observation</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new audit observation and assign it to a department
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddObservation(new FormData(e.currentTarget));
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="observationNumber">Observation Number</Label>
              <Input
                id="observationNumber"
                name="observationNumber"
                required
                className="bg-gray-900 border-gray-600"
                placeholder="RBI/AUDIT/2024/XXX"
              />
            </div>
            <div>
              <Label htmlFor="auditDate">Audit Date</Label>
              <Input
                id="auditDate"
                name="auditDate"
                type="date"
                required
                className="bg-gray-900 border-gray-600"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="auditType">Audit Type</Label>
              <Select name="auditType" required>
                <SelectTrigger className="bg-gray-900 border-gray-600">
                  <SelectValue placeholder="Select audit type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Statutory Audit">
                    Statutory Audit
                  </SelectItem>
                  <SelectItem value="Surprise Inspection">
                    Surprise Inspection
                  </SelectItem>
                  <SelectItem value="Follow-up Audit">
                    Follow-up Audit
                  </SelectItem>
                  <SelectItem value="Thematic Review">
                    Thematic Review
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="auditCategory">Audit Category</Label>
              <Select
                name="auditCategory"
                required
                defaultValue={
                  audit?.categoryFilter !== "all"
                    ? audit?.categoryFilter
                    : undefined
                }
              >
                <SelectTrigger className="bg-gray-900 border-gray-600">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="RMP">
                    Risk Mitigation Plan (RMP)
                  </SelectItem>
                  <SelectItem value="IRAR">
                    Inspection & Risk Assessment (IRAR)
                  </SelectItem>
                  <SelectItem value="SSI">
                    Select Scope Inspection (SSI)
                  </SelectItem>
                  <SelectItem value="MNCR">
                    Mandatory Non-compliance (MNCR)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Observation Category</Label>
              <Select name="category" required>
                <SelectTrigger className="bg-gray-900 border-gray-600">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="KYC Compliance">KYC Compliance</SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="Risk Management">
                    Risk Management
                  </SelectItem>
                  <SelectItem value="Data Privacy">Data Privacy</SelectItem>
                  <SelectItem value="Transaction Monitoring">
                    Transaction Monitoring
                  </SelectItem>
                  <SelectItem value="Internal Controls">
                    Internal Controls
                  </SelectItem>
                  <SelectItem value="Compliance Monitoring">
                    Compliance Monitoring
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select name="severity" required>
                <SelectTrigger className="bg-gray-900 border-gray-600">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              className="bg-gray-900 border-gray-600"
              placeholder="Brief title of the observation"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              className="bg-gray-900 border-gray-600"
              placeholder="Detailed description of the observation"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="recommendation">Recommendation</Label>
            <Textarea
              id="recommendation"
              name="recommendation"
              required
              className="bg-gray-900 border-gray-600"
              placeholder="Recommended action to address the observation"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignedDepartment">Assigned Department</Label>
              <Select name="assignedDepartment" required>
                <SelectTrigger className="bg-gray-900 border-gray-600">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {audit?.store?.db?.departments?.map((dept: any) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select name="assignedTo" required>
                <SelectTrigger className="bg-gray-900 border-gray-600">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {audit?.store?.db?.allUsers?.map((user: any) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              name="targetDate"
              type="date"
              required
              className="bg-gray-900 border-gray-600"
            />
          </div>

          {status && status !== "" && (
            <Alert className="bg-red-900/20 border-red-800 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => audit?.setShowAddDialog(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
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
                <div>Add Observation</div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Addialog;
