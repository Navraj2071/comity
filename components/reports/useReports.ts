import useStore from "@/lib/store/useStore";

const useReports = () => {
  const store = useStore();
  const user = store?.db?.user;
  const checkpoints = store?.db?.checkpoints;

  const getComplianceData = () => {
    if (checkpoints) {
      const total = checkpoints.length;
      const submitted = checkpoints.filter(
        (cp) => cp.status === "submitted"
      ).length;
      let data = {
        overview: {
          totalCheckpoints: total,
          compliant: submitted,
          pending: total - submitted,
          overdue: 0,
          nonCompliant: 4,
          complianceRate: ((submitted / total) * 100).toFixed(),
        },
        byRegulatory: [],
      };
    } else {
      return {};
    }
  };

  const complianceData = getComplianceData();

  return { user, complianceData };
};

export default useReports;
