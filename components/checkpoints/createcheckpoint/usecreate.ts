import { useState, useEffect } from "react";
import useapi from "@/components/api/api";
import { getFinancialYears } from "@/lib/storage";
import { getSomeValueWithId } from "@/lib/tools";

const usecreate = (store: any, setIsCreateDialogOpen: any) => {
  const api = useapi();
  const users = store?.db?.allUsers;
  const departments = store?.db?.departments;
  const regulatoryDepartments = store?.db?.regulatoryDepartments || [];
  const [checkpointForm, setCheckpointForm] = useState({
    letterNumber: "",
    date: "",
    regulatory: "",
    title: "",
    details: "",
    type: "ad-hoc" as "recurring" | "ad-hoc",
    financialYear: "",
    frequency: "",
    subCheckpoints: [
      {
        title: "",
        department: "",
        deadline: "",
        isRemarksRequired: false,
        remarksType: "text",
        remarksPlaceholder: "",
        isAttachmentRequired: false,
        responseTemplate: null,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [createMode, setCreateMode] = useState("manual");
  const financialYears = getFinancialYears();
  const spocs = <any>[];

  const addSubCheckpoint = (index: number) => {
    setCheckpointForm((prev: any) => {
      let newFormData = { ...prev };
      newFormData.subCheckpoints[index] = {
        title: "",
        department: "",
        deadline: "",
        isRemarksRequired: false,
        remarksType: "text",
        remarksPlaceholder: "",
        isAttachmentRequired: false,
        responseTemplate: null,
      };

      return newFormData;
    });
  };

  const removeSubCheckpoint = (index: number) => {
    // setSubCheckpoints(subCheckpoints.filter((_, i) => i !== index));
    setCheckpointForm((prev) => {
      let newFormData = { ...prev };
      newFormData.subCheckpoints = newFormData.subCheckpoints.filter(
        (_, i) => i !== index
      );
      return newFormData;
    });
  };

  const updateSubCheckpoint = (index: number, field: string, value: any) => {
    setCheckpointForm((prev) => {
      let newData = { ...prev };
      newData.subCheckpoints[index] = {
        ...newData.subCheckpoints[index],
        [field]: value,
      };
      return newData;
    });
  };

  const handleBulkUpload = async (file: File) => {
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none"; // Hidden
    document.body.appendChild(input);

    // 2. Define the onchange handler
    input.onchange = async (event) => {
      const file = event.target.files[0];

      const text = await file.text();
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const mainCheckpointHeaders = lines[0]
        .split(",")
        .slice(0, 8)
        .map((h) => h.trim());

      const mainCheckpointValues = lines[1]
        .split(",")
        .slice(0, 8)
        .map((v) => v.trim());

      let regDept = "";
      try {
        regulatoryDepartments.map((dept: any) => {
          if (dept.name === mainCheckpointValues[2]) regDept = dept._id;
        });
      } catch {}

      const checkpointData = {
        letterNumber: mainCheckpointValues[0],
        date: mainCheckpointValues[1],
        regulatory: regDept,
        // regulatory: mainCheckpointValues[2],
        title: mainCheckpointValues[3],
        details: mainCheckpointValues[4],
        type: mainCheckpointValues[5],
        financialYear: mainCheckpointValues[6],
        frequency: mainCheckpointValues[7],
        subCheckpoints: [],
      };

      const subCheckpointHeaders = lines[0]
        .split(",")
        .slice(8)
        .join(",")
        .split(",")
        .map((h) => h.trim());

      for (let i = 2; i < lines.length; i++) {
        const row = lines[i].split(",").map((v) => v.trim());
        const subRow = row.slice(8);

        let department = "";
        try {
          departments.map((dept: any) => {
            if (dept.name === subRow[2]) department = dept._id;
          });
        } catch {}

        const subCheckpoint = {
          title: subRow[1],
          department: department,
          deadline: subRow[3],
          isRemarksRequired: subRow[4].toLowerCase() === "true",
          remarksType: subRow[5],
          remarksPlaceholder: subRow[6],
          isAttachmentRequired: subRow[7].toLowerCase() === "true",
          responseTemplate: null,
        };

        checkpointData.subCheckpoints.push(subCheckpoint);
      }

      setCheckpointForm(checkpointData);
      setCreateMode("manual");

      document.body.removeChild(input);
    };

    input.click();
  };

  const downloadBulkTemplate = () => {
    try {
      window.open("/checkpoint_template.csv");
    } catch {
      alert("Unable to download!");
    }
  };

  const handleCreateCheckpoint = async () => {
    setStatus("");
    setLoading(true);
    let apiData = { ...checkpointForm };
    await Promise.all(
      apiData.subCheckpoints?.map(async (spoint) => {
        if (spoint.responseTemplate) {
          await api
            .fileUpload(spoint.responseTemplate)
            .then((res) => {
              if (res.url) {
                spoint.responseTemplate = res.url;
              } else {
                spoint.responseTemplate = "";
              }
            })
            .catch((err) => console.log(err));
        }
      })
    );

    await api
      .createCheckpoint({ ...checkpointForm })
      .then((res) => {
        console.log(res);
        setIsCreateDialogOpen(false);
        store.update("checkpoints");
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  const getUpcomingDeadline = () => {
    const frequency = checkpointForm.frequency;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    let deadline = now;

    if (frequency === "monthly") {
      deadline = new Date(year, month + 1, 0);
    }
    if (frequency === "quarterly") {
      if (month <= 2) deadline = new Date(year, 3, 0);
      else if (month <= 5) deadline = new Date(year, 6, 0);
      else if (month <= 8) deadline = new Date(year, 9, 0);
      else deadline = new Date(year + 1, 1, 0);
    }
    if (frequency === "half-yearly") {
      if (month <= 5) deadline = new Date(year, 6, 0);
      else deadline = new Date(year, 11, 31);
    }
    if (frequency === "annually") deadline = new Date(year, 11, 31);

    return `${deadline.toLocaleDateString()}, recurring ${frequency}`;
  };

  const getSpoc = (departmentId: string) => {
    let userId = getSomeValueWithId(
      "spoc",
      store?.db?.departments || [],
      departmentId
    );
    let username = store.tools.getUserNameFromId(userId);
    return username;
  };

  return {
    loading,
    status,
    createMode,
    setCreateMode,
    checkpointForm,
    setCheckpointForm,
    regulatoryDepartments,
    financialYears,
    handleCreateCheckpoint,
    updateSubCheckpoint,
    removeSubCheckpoint,
    spocs,
    getUpcomingDeadline,
    addSubCheckpoint,
    downloadBulkTemplate,
    handleBulkUpload,
    getSpoc,
  };
};

export default usecreate;
