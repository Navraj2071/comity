import { useEffect, useState } from "react";

const usestats = (store: any) => {
  const [categoryStats, setCategoryStats] = useState({
    RMP: {
      total: 0,
      open: 0,
      inProgress: 0,
      closed: 0,
      overdue: 0,
      critical: 0,
      high: 0,
      pendingClosure: 0,
    },
    IRAR: {
      total: 0,
      open: 0,
      inProgress: 0,
      closed: 0,
      overdue: 0,
      critical: 0,
      high: 0,
      pendingClosure: 0,
    },
    SSI: {
      total: 0,
      open: 0,
      inProgress: 0,
      closed: 0,
      overdue: 0,
      critical: 0,
      high: 0,
      pendingClosure: 0,
    },
    MNCR: {
      total: 0,
      open: 0,
      inProgress: 0,
      closed: 0,
      overdue: 0,
      critical: 0,
      high: 0,
      pendingClosure: 0,
    },
  });
  const [departmentStats, setDepartmentStats] = useState({});

  const poppulateStats = () => {
    let stats = {
      RMP: {
        total: 0,
        open: 0,
        inProgress: 0,
        closed: 0,
        overdue: 0,
        critical: 0,
        high: 0,
        pendingClosure: 0,
      },
      IRAR: {
        total: 0,
        open: 0,
        inProgress: 0,
        closed: 0,
        overdue: 0,
        critical: 0,
        high: 0,
        pendingClosure: 0,
      },
      SSI: {
        total: 0,
        open: 0,
        inProgress: 0,
        closed: 0,
        overdue: 0,
        critical: 0,
        high: 0,
        pendingClosure: 0,
      },
      MNCR: {
        total: 0,
        open: 0,
        inProgress: 0,
        closed: 0,
        overdue: 0,
        critical: 0,
        high: 0,
        pendingClosure: 0,
      },
    } as any;

    store?.db?.observations?.map((obs: any) => {
      stats[obs.category].total += 1;
      if (obs.status === "Open") {
        stats[obs.category].open += 1;
      } else if (obs.status === "In Progress") {
        stats[obs.category].inProgress += 1;
      } else if (obs.status === "Closed") {
        stats[obs.category].closed += 1;
      } else if (obs.status === "Overdue") {
        stats[obs.category].overdue += 1;
      } else if (obs.status === "Pending Closure") {
        stats[obs.category].pendingClosure += 1;
      }

      if (obs.severity === "High") {
        stats[obs.category].high += 1;
      } else if (obs.severity === "Critical") {
        stats[obs.category].critical += 1;
      }
    });

    setCategoryStats(stats);
  };

  const poppulateDepartmentsStats = () => {
    let stats = {} as any;
    store?.db?.observations?.map((obs: any) => {
      let deptname = store?.tools?.getDepartmentNameFromId(obs.department);
      if (!Object.keys(stats).includes(deptname)) {
        stats[deptname] = {
          critical: obs.severity === "Critical" ? 1 : 0,
          high: obs.severity === "High" ? 1 : 0,
          overdue: obs.status === "Overdue" ? 1 : 0,
          closed: obs.status === "Closed" ? 1 : 0,
          progress: parseFloat(obs.progress) || 0,
          num: 1,
        };
      } else {
        if (obs.severity === "Critical") {
          stats[deptname].critical += 1;
        } else if (obs.severity === "High") {
          stats[deptname].high += 1;
        }
        if (obs.status === "Overdue") {
          stats[deptname].overdue += 1;
        } else if (obs.status === "Closed") {
          stats[deptname].closed += 1;
        }
        stats[deptname].progress += parseFloat(obs.progress) || 0;
        stats[deptname].num += 1;
      }
    });
    let statsArr = [] as any[];
    Object.keys(stats).map((key) => {
      statsArr.push({
        ...stats[key],
        department: key,
        avgProgress: (stats[key].progress / stats[key].num).toFixed(),
      });
    });

    setDepartmentStats(statsArr);
  };

  useEffect(() => {
    poppulateStats();
    poppulateDepartmentsStats();
  }, [store?.db?.observations]);
  return { categoryStats, departmentStats };
};

export default usestats;
