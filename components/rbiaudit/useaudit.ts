import { useState, useEffect } from "react";
import useStore from "@/lib/store/useStore";
import usestats from "./usestats";

const useaudit = () => {
  const store = useStore();
  const { categoryStats, departmentStats } = usestats(store);

  const AUDIT_CATEGORIES = {
    RMP: "Risk Mitigation Plan (RMP)",
    IRAR: "Inspection and Risk Assessment Report (IRAR)",
    SSI: "Select Scope Inspection",
    MNCR: "Mandatory Non-compliance to Regulatory Guidelines",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [financialYears, setFinancialYears] = useState<string[]>([]);
  const [selectedFinancialYear, setSelectedFinancialYear] =
    useState<string>("all");

  const poppulateYears = () => {
    if (store?.db?.observations) {
      let years = [] as any[];
      store?.db?.observations?.map((obs: any) => {
        const year = new Date(obs.createdAt).getFullYear();
        const yearStr = `${year}-${year + 1}`;
        if (!years.includes(yearStr)) {
          years.push(yearStr);
        }
      });
      setFinancialYears(years);
    }
  };

  useEffect(() => {
    poppulateYears();
  }, [store?.db?.observations]);

  const [selectedObservation, setSelectedObservation] = useState<any | null>(
    null
  );

  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  return {
    store,
    AUDIT_CATEGORIES,
    categoryFilter,
    setCategoryFilter,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    severityFilter,
    setSeverityFilter,

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
    departmentStats,
    selectedObservation,
    setSelectedObservation,
  };
};

export default useaudit;
