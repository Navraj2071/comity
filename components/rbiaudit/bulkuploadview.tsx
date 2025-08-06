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

const cellWidth = 52;

const Bulkuploadview = ({ data }: any) => {
  return (
    <DialogContent className="w-full max-w-[90vw] bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-scroll">
      <DialogHeader>
        <DialogTitle>Add New RBI Observation</DialogTitle>
        <DialogDescription className="text-gray-400">
          Create a new audit observation and assign it to a department
        </DialogDescription>
      </DialogHeader>
      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "100%",
        }}
      >
        <div className={`w-${cellWidth}`}>S.No.</div>
        <Label
          htmlFor="observationNumber"
          className={`w-${cellWidth} bg-red-500`}
        >
          Observation Number
        </Label>
        <Label htmlFor="auditDate" className={`w-${cellWidth}`}>
          Audit Date
        </Label>
        <Label htmlFor="auditType" className={`w-${cellWidth}`}>
          Audit Type
        </Label>
        <Label htmlFor="auditCategory" className={`w-${cellWidth}`}>
          Audit Category
        </Label>
        <Label htmlFor="category" className={`w-${cellWidth}`}>
          Observation Category
        </Label>
        <Label htmlFor="severity" className={`w-${cellWidth}`}>
          Severity
        </Label>
        <Label htmlFor="title" className={`w-${cellWidth}`}>
          Title
        </Label>
        <Label htmlFor="description" className={`w-${cellWidth}`}>
          Description
        </Label>
        <Label htmlFor="recommendation" className={`w-${cellWidth}`}>
          Recommendation
        </Label>
        <Label htmlFor="assignedDepartment" className={`w-${cellWidth}`}>
          Assigned Department
        </Label>
        <Label htmlFor="assignedTo" className={`w-${cellWidth}`}>
          Assigned To
        </Label>
        <Label htmlFor="targetDate" className={`w-${cellWidth}`}>
          Target Date
        </Label>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
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
  const className = `w-${cellWidth} bg-gray-900 border-gray-600`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      style={{
        display: "flex",
        gap: "10px",
        width: "100%",
      }}
    >
      <div className={`w-${cellWidth}`}>{index + 1}</div>
      <Input
        id="observationNumber"
        name="observationNumber"
        required
        className={className}
        placeholder="RBI/AUDIT/2024/XXX"
      />

      <Input
        id="auditDate"
        name="auditDate"
        type="date"
        required
        className={className}
      />

      <Select name="auditType" required>
        <SelectTrigger className={className}>
          <SelectValue placeholder="Select audit type" />
        </SelectTrigger>
        <SelectContent className={className}>
          <SelectItem value="Statutory Audit">Statutory Audit</SelectItem>
          <SelectItem value="Surprise Inspection">
            Surprise Inspection
          </SelectItem>
          <SelectItem value="Follow-up Audit">Follow-up Audit</SelectItem>
          <SelectItem value="Thematic Review">Thematic Review</SelectItem>
        </SelectContent>
      </Select>

      <Select name="auditCategory" required defaultValue={undefined}>
        <SelectTrigger className={className}>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className={className}>
          <SelectItem value="RMP">Risk Mitigation Plan (RMP)</SelectItem>
          <SelectItem value="IRAR">
            Inspection & Risk Assessment (IRAR)
          </SelectItem>
          <SelectItem value="SSI">Select Scope Inspection (SSI)</SelectItem>
          <SelectItem value="MNCR">Mandatory Non-compliance (MNCR)</SelectItem>
        </SelectContent>
      </Select>

      <Select name="category" required>
        <SelectTrigger className={className}>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className={className}>
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
        <SelectTrigger className={className}>
          <SelectValue placeholder="Select severity" />
        </SelectTrigger>
        <SelectContent className={className}>
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
        className={className}
        placeholder="Brief title of the observation"
      />

      <Textarea
        id="description"
        name="description"
        required
        className={className}
        placeholder="Detailed description of the observation"
        rows={3}
      />

      <Textarea
        id="recommendation"
        name="recommendation"
        required
        className={className}
        placeholder="Recommended action to address the observation"
        rows={3}
      />

      <Select name="assignedDepartment" required>
        <SelectTrigger className={className}>
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value={"sdsdc"}>"sdfsdf"</SelectItem>
        </SelectContent>
      </Select>

      <Select name="assignedTo" required>
        <SelectTrigger className={className}>
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
        className={className}
      />
    </form>
  );
};
