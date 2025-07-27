"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search } from "lucide-react";

import useStore from "@/lib/store/useStore";
import DocumentDetailsDialog from "./documentdetails";
import NewVersionDialog from "./newVersionDialog";
import Summary from "./docsummary";
import Library from "./library";

export default function PoliciesSOPsPage() {
  const store = useStore();
  const documents = store?.db?.sops;
  const departments = ["IT", "Compliance", "RBI"];

  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-600 text-white";
      case "Under Review":
        return "bg-yellow-600 text-white";
      case "Approved":
        return "bg-green-600 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Policies & SOPs
          </h1>
          <p className="text-gray-400">
            Manage organizational policies and standard operating procedures
          </p>
        </div>
        <Summary documents={documents} />

        <Library
          getStatusBadgeColor={getStatusBadgeColor}
          setSelectedDocument={setSelectedDocument}
          setIsVersionDialogOpen={setIsVersionDialogOpen}
          setFilter
          store={store}
        />
      </div>
      {selectedDocument && (
        <DocumentDetailsDialog
          selectedDocument={selectedDocument}
          setSelectedDocument={setSelectedDocument}
          getStatusBadgeColor={getStatusBadgeColor}
          getReviewStatus={getReviewStatus}
          store={store}
        />
      )}
      <NewVersionDialog
        isVersionDialogOpen={isVersionDialogOpen}
        setIsVersionDialogOpen={setIsVersionDialogOpen}
        selectedDocument={selectedDocument}
        store={store}
      />
    </main>
  );
}
