"use client";

import { useEffect, useState } from "react";

import useapi from "@/components/api/api";

const useStore = () => {
  const api = useapi();

  const [db, setDb] = useState({
    user: null,
    allUsers: null,
    departments: null,
    regulatoryDepartments: null,
    checkpoints: null,
  });

  const fetchFunctions = {
    user: api.getUserdata,
    allUsers: api.getAllUsersdata,
    departments: api.getDepartments,
    regulatoryDepartments: api.getRegulatoryDepartments,
    checkpoints: api.getCheckpoints,
  };

  const fetchDataFromAPI = async (table: string) => {
    fetchFunctions[table]()

      .then((res: any) => {
        setDb((prev: {}) => {
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
      setDb((prev: {}) => {
        let newData = { ...prev };

        newData[table] = JSON.parse(data);

        return newData;
      });
    }
  };

  useEffect(() => {
    Object.keys(fetchFunctions).map((key) => checkData(key));
  }, []);

  const update = (table: string) => {
    fetchDataFromAPI(table);
  };

  return { db, update };
};

export default useStore;
