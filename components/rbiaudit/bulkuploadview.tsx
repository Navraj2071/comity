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

const Bulkuploadview = ({ data }: any) => {
  return (
    <DialogContent className="max-w-[90vw] bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-scroll">
      <DialogHeader>
        <DialogTitle>Add New RBI Observation</DialogTitle>
        <DialogDescription className="text-gray-400">
          Create a new audit observation and assign it to a department
        </DialogDescription>
      </DialogHeader>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
          gap: "10px",
        }}
      >
        <div>S.No.</div>
        <Label htmlFor="observationNumber">Observation Number</Label>
        <Label htmlFor="auditDate">Audit Date</Label>
        <Label htmlFor="auditType">Audit Type</Label>
        <Label htmlFor="auditCategory">Audit Category</Label>
        <Label htmlFor="category">Observation Category</Label>
        <Label htmlFor="severity">Severity</Label>
        <Label htmlFor="title">Title</Label>
        <Label htmlFor="description">Description</Label>
        <Label htmlFor="recommendation">Recommendation</Label>
        <Label htmlFor="assignedDepartment">Assigned Department</Label>
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Label htmlFor="targetDate">Target Date</Label>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {data?.map((datarow: any, i: number) => (
          <DataRow key={`row-${i}`} index={i} />
        ))}
      </div>
    </DialogContent>
  );
};

export default Bulkuploadview;

const DataRow = ({ index }: any) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      //   className="space-y-4"
      style={{
        display: "grid",
        gridTemplateColumns:
          "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
        gap: "10px",
      }}
    >
      <div>{index + 1}</div>
      <Input
        id="observationNumber"
        name="observationNumber"
        required
        className="bg-gray-900 border-gray-600"
        placeholder="RBI/AUDIT/2024/XXX"
      />

      <Input
        id="auditDate"
        name="auditDate"
        type="date"
        required
        className="bg-gray-900 border-gray-600"
      />

      <Select name="auditType" required>
        <SelectTrigger className="bg-gray-900 border-gray-600">
          <SelectValue placeholder="Select audit type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="Statutory Audit">Statutory Audit</SelectItem>
          <SelectItem value="Surprise Inspection">
            Surprise Inspection
          </SelectItem>
          <SelectItem value="Follow-up Audit">Follow-up Audit</SelectItem>
          <SelectItem value="Thematic Review">Thematic Review</SelectItem>
        </SelectContent>
      </Select>

      <Select name="auditCategory" required defaultValue={undefined}>
        <SelectTrigger className="bg-gray-900 border-gray-600">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="RMP">Risk Mitigation Plan (RMP)</SelectItem>
          <SelectItem value="IRAR">
            Inspection & Risk Assessment (IRAR)
          </SelectItem>
          <SelectItem value="SSI">Select Scope Inspection (SSI)</SelectItem>
          <SelectItem value="MNCR">Mandatory Non-compliance (MNCR)</SelectItem>
        </SelectContent>
      </Select>

      <Select name="category" required>
        <SelectTrigger className="bg-gray-900 border-gray-600">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="KYC Compliance">KYC Compliance</SelectItem>
          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
          <SelectItem value="Risk Management">Risk Management</SelectItem>
          <SelectItem value="Data Privacy">Data Privacy</SelectItem>
          <SelectItem value="Transaction Monitoring">
            Transaction Monitoring
          </SelectItem>
          <SelectItem value="Internal Controls">Internal Controls</SelectItem>
          <SelectItem value="Compliance Monitoring">
            Compliance Monitoring
          </SelectItem>
        </SelectContent>
      </Select>

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

      <Input
        id="title"
        name="title"
        required
        className="bg-gray-900 border-gray-600"
        placeholder="Brief title of the observation"
      />

      <Textarea
        id="description"
        name="description"
        required
        className="bg-gray-900 border-gray-600"
        placeholder="Detailed description of the observation"
        rows={3}
      />

      <Textarea
        id="recommendation"
        name="recommendation"
        required
        className="bg-gray-900 border-gray-600"
        placeholder="Recommended action to address the observation"
        rows={3}
      />

      <Select name="assignedDepartment" required>
        <SelectTrigger className="bg-gray-900 border-gray-600">
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value={"sdsdc"}>"sdfsdf"</SelectItem>
        </SelectContent>
      </Select>

      <Select name="assignedTo" required>
        <SelectTrigger className="bg-gray-900 border-gray-600">
          <SelectValue placeholder="Select user" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value={"sdsdf"}>{"sdsd"}</SelectItem>
        </SelectContent>
      </Select>

      <Input
        id="targetDate"
        name="targetDate"
        type="date"
        required
        className="bg-gray-900 border-gray-600"
      />
    </form>
  );
};
