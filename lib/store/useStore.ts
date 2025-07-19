"use client";

import { useEffect, useState } from "react";
import useapi from "@/components/api/api";

const useStore = () => {
  const api = useapi();
  const [user, setUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any>(null);

  const checkUserData = async () => {
    const data = localStorage.getItem("user");
    if (!data || data === "undefined") {
      api
        .getUserdata()
        .then((res) => {
          setUser(res?.user);
          localStorage.setItem("user", JSON.stringify(res?.user));
        })
        .catch((err) => console.log("Error fetching user: ", err));
    } else {
      setUser(JSON.parse(data));
    }
  };
  const checkAllUsersData = async () => {
    const data = localStorage.getItem("alluser");
    if (!data || data === "undefined") {
      api
        .getAllUsersdata()
        .then((res) => {
          setAllUsers(res?.users);
          localStorage.setItem("alluser", JSON.stringify(res?.users));
        })
        .catch((err) => console.log("Error fetching user: ", err));
    } else {
      setAllUsers(JSON.parse(data));
    }
  };

  useEffect(() => {
    checkUserData();
    checkAllUsersData();
  }, []);

  return { user, allUsers };
};

export default useStore;
