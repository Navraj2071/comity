import { useState, useEffect } from "react";
import useStore from "@/lib/store/useStore";

const usedash = () => {
  const store = useStore();

  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [complianceStats, setComplianceStats] = useState<any>({});
  const poppulateComplianceStats = () => {
    let stats = { total: 0, compliant: 0, pending: 0, overdue: 0 };
    store?.db?.checkpoints?.map((cpoint: any) => {
      cpoint.subCheckpoints?.map((subpoint: any) => {
        stats.total += 1;
        const status = store?.tools?.getCheckpointStatus(subpoint._id);

        if (status === "submitted") {
          stats.compliant += 1;
        } else if (status === "overdue") {
          stats.overdue += 1;
        } else {
          stats.pending += 1;
        }
      });
    });
    setComplianceStats(stats);
  };

  const [policySOPStats, setPolicySOPStats] = useState<any>({});
  const [rbiAuditStats, setRbiAuditStats] = useState<any>({});
  const [regulatoryDepts, setRegulatoryDepts] = useState<any[]>([]);

  const poppulateRegDepartments = () => {
    let stats = {} as any;

    store?.db?.regulatoryDepartments?.map((dept: any) => {
      stats[dept.name] = {
        ...dept,
        percentage: 0,
        total: 0,
        pending: 0,
        compliant: 0,
        overdue: 0,
      };
    });

    store?.db?.checkpoints?.map((cpoint: any) => {
      cpoint.subCheckpoints?.map((subpoint: any) => {
        const deptname = store?.tools?.getRegBodyNameFromId(cpoint?.regulatory);
        stats[deptname].total += 1;
        const status = store?.tools?.getCheckpointStatus(subpoint._id);

        if (status === "submitted") {
          stats[deptname].compliant += 1;
        } else if (status === "overdue") {
          stats[deptname].overdue += 1;
        } else {
          stats[deptname].pending += 1;
        }
      });
    });

    let depts = [] as any[];

    Object.keys(stats).map((key: string) => {
      depts.push(stats[key]);
    });

    setRegulatoryDepts(depts);
  };

  useEffect(() => {
    poppulateComplianceStats();
    setCheckpoints(store?.db?.checkpoints);
    poppulateRegDepartments();
  }, [store?.db?.checkpoints]);

  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCheckpointDetails, setSelectedCheckpointDetails] =
    useState<any>(null);

  // Dashboard filters
  const [checkpointType, setCheckpointType] = useState<string>("ad-hoc");
  const [financialYear, setFinancialYear] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("monthly");
  const [period, setPeriod] = useState<string>("");

  // Time period options
  const [financialYearsList, setFinancialYearsList] = useState<string[]>([]);
  const [monthsList, setMonthsList] = useState<
    { value: string; label: string }[]
  >([]);
  const [quartersList, setQuartersList] = useState<
    { value: string; label: string }[]
  >([]);
  const [halfYearsList, setHalfYearsList] = useState<
    { value: string; label: string }[]
  >([]);
  const [yearsList, setYearsList] = useState<
    { value: string; label: string }[]
  >([]);

  return {
    store,
    checkpoints,
    complianceStats,
    policySOPStats,
    rbiAuditStats,
    regulatoryDepts,
    selectedCheckpoint,
    setSelectedCheckpoint,
    selectedStatus,
    setSelectedStatus,
    selectedCheckpointDetails,
    setSelectedCheckpointDetails,
    checkpointType,
    setCheckpointType,
    financialYear,
    setFinancialYear,
    frequency,
    setFrequency,
    period,
    setPeriod,
    financialYearsList,
    monthsList,
    quartersList,
    halfYearsList,
    yearsList,
  };
};

export default usedash;
