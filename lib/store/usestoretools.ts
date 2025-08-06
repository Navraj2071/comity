import { getNextDeadline } from "../tools";

const usestoretools = (db: any) => {
  const getUserDepartment = (userId: string) => {
    if (!db || !userId) return "";
    let dep = "---";
    db?.departments?.map((dept: any) => {
      if (dept.head === userId || dept.spoc === userId) {
        dep = dept.name;
      }
    });
    return dep;
  };

  const getDepartmentUserCount = (deptId: string) => {
    let count = 0;

    db?.allUsers?.map((user: any) => {
      if (user.department === deptId) {
        count = count + 1;
      }
    });

    return count;
  };

  const getSubCheckpointStatus = (subpointId: string) => {
    let status = "pending";
    db?.submissions?.map((sub: any) => {
      if (sub.subCheckpoint === subpointId) {
        status = sub.status;
      }
    });
    return status;
  };

  const getUserNameFromId = (userId: string) => {
    let username = "";

    db?.allUsers?.map((user: any) => {
      if (user._id === userId) {
        username = user.name;
      }
    });
    return username;
  };

  const getDepartmentNameFromId = (deptId: string) => {
    let deptname = "";

    db?.departments?.map((user: any) => {
      if (user._id === deptId) {
        deptname = user.name;
      }
    });
    return deptname;
  };
  const getRegBodyNameFromId = (deptId: string) => {
    let name = "";

    db?.regulatoryDepartments?.map((regbody: any) => {
      if (regbody._id === deptId) {
        name = regbody.name;
      }
    });
    return name;
  };

  const getlatestSopVersion = (sop: any) => {
    let latest = {} as any;
    sop?.versions?.map((version: any) => {
      if (latest.createdAt) {
        if (new Date(version.createdAt) > new Date(latest.createdAt)) {
          latest = version;
        }
      } else {
        latest = version;
      }
    });
    return latest;
  };

  const getLatestSubmission = (subpointId: string) => {
    let submission = null as any;
    db?.submissions?.map((sub: any) => {
      if (sub.subCheckpoint === subpointId) {
        try {
          if (!submission) {
            submission = { ...sub };
          } else if (new Date(sub.createdAt) > new Date(submission.createdAt)) {
            submission = { ...sub };
          }
        } catch {}
      }
    });
    return submission;
  };

  const getCheckpointStatus = (subpointId: string) => {
    let status = "pending";
    // pending, pending_review, approved, rejected, submitted, overdue;

    const submission = getLatestSubmission(subpointId);

    if (submission) {
      if (submission.status === "closed") status = "submitted";
      else status = submission.status;
    }

    let deadline = new Date();

    db?.checkpoints?.map((cpoint: any) => {
      cpoint?.subCheckpoints?.map((subpoint: any) => {
        if (subpoint._id === subpointId) {
          if (cpoint.type === "recurring") {
            deadline = getNextDeadline(cpoint.frequency);
          } else {
            deadline = new Date(subpoint.deadline);
          }
        }
      });
    });

    if (!submission) {
      if (new Date() > deadline) {
        status = "overdue";
      }
    } else if (
      !(submission.status === "submitted" || submission.status === "closed") &&
      new Date() > deadline
    ) {
      status = "overdue";
    }

    return status;
  };

  return {
    getUserDepartment,
    getDepartmentUserCount,
    getUserNameFromId,
    getDepartmentNameFromId,
    getRegBodyNameFromId,
    getSubCheckpointStatus,
    getlatestSopVersion,
    getLatestSubmission,
    getCheckpointStatus,
  };
};

export default usestoretools;
