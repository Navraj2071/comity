"use client";

import { useRouter } from "next/navigation";

const useapi = () => {
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const data = await response.json();
      throw data.message;
    }
  };

  const logout = async (email: string, password: string) => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    router.push("/login");
  };

  const crud = async (endpoint: string, method: string, data?: {}) => {
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      router.push("/login");
      throw 401;
    }
    if (response.ok) {
      return await response.json();
    } else {
      throw await response.json();
    }
  };

  const fileUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      return await res.json();
    } else {
      throw await res.json();
    }
  };

  const getUserdata = async () => await crud("/api/user", "GET");
  const getAllUsersdata = async () => await crud("/api/allusers", "GET");
  const createUser = async (data: {}) =>
    await crud("/api/allusers", "POST", data);
  const deleteUser = async (data: {}) =>
    await crud("/api/allusers", "DELETE", data);

  const getDepartments = async () => await crud("/api/department", "GET");
  const createDepartment = async (data: {}) =>
    await crud("/api/department", "POST", data);
  const updateDepartment = async (data: {}) =>
    await crud("/api/department", "PUT", data);
  const deleteDepartment = async (data: {}) =>
    await crud("/api/department", "DELETE", data);

  const getRegulatoryDepartments = async () =>
    await crud("/api/regulatory-department", "GET");
  const createRegulatoryDepartment = async (data: {}) =>
    await crud("/api/regulatory-department", "POST", data);
  const updateRegulatoryDepartment = async (data: {}) =>
    await crud("/api/regulatory-department", "PUT", data);
  const deleteRegulatoryDepartment = async (data: {}) =>
    await crud("/api/regulatory-department", "DELETE", data);

  const getCheckpoints = async () => await crud("/api/checkpoint", "GET");
  const createCheckpoint = async (data: {}) =>
    await crud("/api/checkpoint", "POST", data);
  const updateCheckpoint = async (data: {}) =>
    await crud("/api/checkpoint", "PUT", data);
  const deleteCheckpoint = async (data: {}) =>
    await crud("/api/checkpoint", "DELETE", data);

  const updateSubCheckpoint = async (data: {}) =>
    await crud("/api/subcheckpoint", "PATCH", data);

  const getSops = async () => await crud("/api/sop", "GET");
  const createSop = async (data: {}) => await crud("/api/sop", "POST", data);
  const updateSop = async (data: {}) => await crud("/api/sop", "PUT", data);
  const deleteSop = async (data: {}) => await crud("/api/sop", "DELETE", data);

  return {
    login,
    logout,
    getUserdata,
    getAllUsersdata,
    createUser,
    deleteUser,

    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,

    getRegulatoryDepartments,
    createRegulatoryDepartment,
    updateRegulatoryDepartment,
    deleteRegulatoryDepartment,

    getCheckpoints,
    createCheckpoint,
    updateCheckpoint,
    deleteCheckpoint,

    fileUpload,

    updateSubCheckpoint,

    getSops,
    createSop,
    updateSop,
    deleteSop,
  };
};

export default useapi;
