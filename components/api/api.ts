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
      try {
        throw await response.json();
      } catch (e) {
        throw "Server error";
      }
    }
  };

  const endpoints = { user: "/api/user", allusers: "/api/" };

  const getUserdata = async () => await crud("/api/user", "GET");
  const getAllUsersdata = async () => await crud("/api/allusers", "GET");
  const createUser = async (data: {}) => await crud("/api/users", "POST", data);

  return { login, logout, getUserdata, getAllUsersdata, createUser };
};

export default useapi;
