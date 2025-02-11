import { useState, useEffect } from "react";
import { useApi } from "../apis/office";
import { useAuth } from "../securities/auth";
import { getNestedValue } from "./controller";

export const useSearch = (data, fields, minLengthToShow = 1) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDataShown, setIsDataShown] = useState(true);
  const handleSearch = (term) => setSearchTerm(term);
  const filteredData = data.filter((item) => fields.some((field) => getNestedValue(item, field)?.toString().toLowerCase().includes(searchTerm.toLowerCase())));

  useEffect(() => {
    setIsDataShown(filteredData.length >= minLengthToShow);
  }, [filteredData, minLengthToShow]);

  return { searchTerm, handleSearch, filteredData, isDataShown };
};

export const useAbsence = () => {
  const { apiRead, apiCrud } = useApi();
  const { secret, level } = useAuth();
  const [isAbsence, setIsAbsence] = useState(false);
  const [lastAbsence, setLastAbsence] = useState({});

  const getCurrentDate = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" });
    const formattedDateParts = formatter.formatToParts(now);
    const year = formattedDateParts.find((part) => part.type === "year")?.value;
    const month = formattedDateParts.find((part) => part.type === "month")?.value;
    const day = formattedDateParts.find((part) => part.type === "day")?.value;
    return `${year}-${month}-${day}`;
  };

  const fetchAbsence = async () => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ secret }));
    try {
      const response = await apiRead(formData, "kpi", "viewabsence");
      if (!response.error) {
        const absence = response.data;
        if (absence && absence.length > 0) {
          const today = getCurrentDate();
          const lastabsence = absence[absence.length - 1];
          if (lastabsence.endtime === null && lastabsence.startdate === today) setIsAbsence(true);
          else setIsAbsence(false);
          setLastAbsence(lastabsence);
        } else setIsAbsence(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const absenceIn = async () => {
    const formData = new FormData();
    const confirm = window.confirm(`Anda akan absen masuk pada ${new Date().toLocaleString()}`);
    formData.append("data", JSON.stringify({ secret }));
    if (!confirm) return;
    try {
      const response = await apiCrud(formData, "kpi", "addabsence");
      if (!response.error) setIsAbsence(true);
      else console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const absenceOut = async () => {
    const formData = new FormData();
    const confirm = window.confirm(`Anda akan absen keluar pada ${new Date().toLocaleString()}`);
    formData.append("data", JSON.stringify({ secret }));
    formData.append("idedit", lastAbsence.idabsence);
    if (!confirm) return;
    try {
      const response = await apiCrud(formData, "kpi", "addabsence");
      if (!response.error) setIsAbsence(false);
      else console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (level === "STAFF") fetchAbsence();
  }, [isAbsence, level]);

  return { isAbsence, absenceIn, absenceOut };
};
