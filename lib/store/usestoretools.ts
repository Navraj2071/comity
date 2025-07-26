import React from "react";

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

    db?.regulatoryDepartments?.map((user: any) => {
      if (user._id === deptId) {
        name = user.name;
      }
    });
    return name;
  };
  return {
    getUserDepartment,
    getDepartmentUserCount,
    getUserNameFromId,
    getDepartmentNameFromId,
    getRegBodyNameFromId,
    getSubCheckpointStatus,
  };
};

export default usestoretools;
