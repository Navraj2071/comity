import { useState, useEffect } from "react";
import useStore from "@/lib/store/useStore";
import useapi from "../api/api";

const useaudit = () => {
  const api = useapi();
  const store = useStore();

  const AUDIT_CATEGORIES = {
    RMP: "Risk Mitigation Plan (RMP)",
    IRAR: "Inspection and Risk Assessment Report (IRAR)",
    SSI: "Select Scope Inspection",
    MNCR: "Mandatory Non-compliance to Regulatory Guidelines",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFinancialYear, setSelectedFinancialYear] =
    useState<string>("2023-2024");
  const [categoryStats, setCategoryStats] = useState({
    RMP: { total: 0, open: 0, inProgress: 0, closed: 0, overdue: 0 },
    IRAR: { total: 0, open: 0, inProgress: 0, closed: 0, overdue: 0 },
    SSI: { total: 0, open: 0, inProgress: 0, closed: 0, overdue: 0 },
    MNCR: { total: 0, open: 0, inProgress: 0, closed: 0, overdue: 0 },
  });

  const [selectedObservation, setSelectedObservation] = useState<any | null>(
    null
  );

  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const financialYears = ["2021-2022", "2022-2023", "2023-2024", "2024-2025"];

  const getFilteredStats = () => {
    const allObservations = [].filter(
      (obs) => categoryFilter === "all" || obs.auditCategory === categoryFilter
    );

    return {
      total: allObservations.length,
      open: allObservations.filter((o) => o.status === "Open").length,
      inProgress: allObservations.filter((o) => o.status === "In Progress")
        .length,
      pendingClosure: allObservations.filter(
        (o) => o.status === "Pending Closure"
      ).length,
      closed: allObservations.filter((o) => o.status === "Closed").length,
      overdue: allObservations.filter((o) => o.status === "Overdue").length,
      critical: allObservations.filter((o) => o.severity === "Critical").length,
      high: allObservations.filter((o) => o.severity === "High").length,
      medium: allObservations.filter((o) => o.severity === "Medium").length,
      low: allObservations.filter((o) => o.severity === "Low").length,
    };
  };

  const auditStats = getFilteredStats();

  return {
    store,
    AUDIT_CATEGORIES,
    categoryFilter,
    setCategoryFilter,
    departmentFilter,
    setDepartmentFilter,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    selectedFinancialYear,
    setSelectedFinancialYear,
    financialYears,
    showBulkUpload,
    setShowBulkUpload,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    showDetailsDialog,
    setShowDetailsDialog,
    categoryStats,
    setCategoryStats,
    auditStats,
    selectedObservation,
    setSelectedObservation,
  };
};

export default useaudit;
