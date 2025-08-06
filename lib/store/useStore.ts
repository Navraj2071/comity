"use client";

import { useEffect, useState } from "react";

import useapi from "@/components/api/api";
import usestoretools from "./usestoretools";

const useStore = () => {
  const api = useapi();

  const [db, setDb] = useState<any>({
    user: null,
    allUsers: [],
    departments: [],
    regulatoryDepartments: [],
    checkpoints: [],
    sops: [],
    submissions: [],
    observations: [],
    notifications: [],
  });

  const [loading, setloading] = useState(false);

  const fetchFunctions = {
    user: api.getUserdata,
    allUsers: api.getAllUsersdata,
    departments: api.getDepartments,
    regulatoryDepartments: api.getRegulatoryDepartments,
    checkpoints: api.getCheckpoints,
    sops: api.getSops,
    submissions: api.getSubmission,
    observations: api.getObservation,
    notifications: api.getNotifications,
  } as any;

  const fetchDataFromAPI = async (table: string) => {
    fetchFunctions[table]()

      .then((res: any) => {
        setDb((prev: any) => {
          let newData = { ...prev };

          newData[table] = res[table];

          return newData;
        });

        localStorage.setItem(table, JSON.stringify(res?.user));
      })

      .catch((err: any) => console.log("Error fetching data: ", err));
  };

  const checkData = async (table: string) => {
    const data = localStorage.getItem(table);

    if (!data || data === "undefined") {
      fetchDataFromAPI(table);
    } else {
      setDb((prev: any) => {
        let newData = { ...prev };

        newData[table] = JSON.parse(data);

        return newData;
      });
    }
  };

  const poppulateAllData = async () => {
    setloading(true);

    await Promise.all(
      Object.keys(fetchFunctions).map(async (key) => {
        await fetchDataFromAPI(key);
      })
    );
    setloading(false);
  };

  useEffect(() => {
    Object.keys(fetchFunctions).map((key) => checkData(key));
  }, []);

  const update = (table: string) => {
    fetchDataFromAPI(table);
  };

  const tools = usestoretools(db);

  return { db, update, loading, poppulateAllData, tools };
};

export default useStore;
