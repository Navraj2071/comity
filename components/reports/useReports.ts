import useStore from "@/lib/store/useStore";
import { useEffect, useState } from "react";

const useReports = () => {
  const store = useStore();
  const checkpoints = store?.db?.checkpoints;

  const [complianceData, setComplianceData] = useState<any>(null);
  const [reportFilters, setReportFilters] = useState({
    dateRange: "last-30-days",
    department: "all",
    regulatory: "all",
    status: "all",
    checkpointType: "ad-hoc",
    financialYear: "",
    frequency: "monthly",
    period: "",
  });

  const poppulateComplianceData = () => {
    let data = {
      overview: {
        totalCheckpoints: 0,
        compliant: 0,
        pending: 0,
        overdue: 0,
        nonCompliant: 0,
        complianceRate: 0,
      },
      byRegulatory: {},
      byDepartment: {},
    } as any;

    store?.db?.checkpoints?.map((cpoint: any) => {
      cpoint.subCheckpoints.map((subpoint: any) => {
        const regBody = store?.tools?.getRegBodyNameFromId(cpoint.regulatory);
        const deptname = store?.tools?.getDepartmentNameFromId(
          subpoint.department
        );

        if (
          (reportFilters?.department === "all" ||
            reportFilters?.department === deptname) &&
          (reportFilters?.regulatory === "all" ||
            reportFilters?.regulatory === regBody)
        ) {
          data.overview.totalCheckpoints += 1;
          const status = store?.tools?.getCheckpointStatus(subpoint?._id);

          if (status === "overdue") data.overview.overdue += 1;
          if (status === "pending") data.overview.pending += 1;
          if (status === "submitted") data.overview.compliant += 1;
          else data.overview.nonCompliant += 1;

          if (regBody in data.byRegulatory) {
            data.byRegulatory[regBody].total += 1;

            if (status === "overdue") data.byRegulatory[regBody].overdue += 1;
            if (status === "pending") data.byRegulatory[regBody].pending += 1;
            if (status === "submitted")
              data.byRegulatory[regBody].compliant += 1;
            else data.overview.nonCompliant += 1;
          } else {
            data.byRegulatory[regBody] = {
              total: 1,
              compliant: status === "submitted" ? 1 : 0,
              pending: status === "pending" ? 1 : 0,
              overdue: status === "overdue" ? 1 : 0,
              nonCompliant: status !== "submitted" ? 1 : 0,
              rate: 0,
            };
          }

          if (deptname in data.byDepartment) {
            data.byDepartment[deptname].total += 1;
            if (status === "overdue") data.byDepartment[deptname].overdue += 1;
            if (status === "pending") data.byDepartment[deptname].pending += 1;
            if (status === "submitted")
              data.byDepartment[deptname].compliant += 1;
            else data.overview.nonCompliant += 1;
          } else {
            data.byDepartment[deptname] = {
              total: 1,
              compliant: status === "submitted" ? 1 : 0,
              pending: status === "pending" ? 1 : 0,
              overdue: status === "overdue" ? 1 : 0,
              nonCompliant: status !== "submitted" ? 1 : 0,
              rate: 0,
            };
          }
        }
      });
    });

    const arrayfiedData = {
      overview: data.overview,
      byRegulatory: [],
      byDepartment: [],
    } as any;

    Object.keys(data.byRegulatory).map((key) => {
      arrayfiedData.byRegulatory.push({
        name: key,
        ...data.byRegulatory[key],
      });
    });

    Object.keys(data.byDepartment).map((key) => {
      arrayfiedData.byDepartment.push({
        name: key,
        ...data.byDepartment[key],
      });
    });

    setComplianceData(arrayfiedData);
  };

  useEffect(() => {
    poppulateComplianceData();
  }, [store?.db, reportFilters]);

  return { store, complianceData, reportFilters, setReportFilters };
};

export default useReports;
