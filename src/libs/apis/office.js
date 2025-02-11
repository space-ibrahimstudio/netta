import React, { createContext, useContext } from "react";
import axios from "axios";
import { useDevmode } from "@ibrahimstudio/react";

const ApiContext = createContext();
const apiURL = process.env.REACT_APP_API_URL;

export const ApiProvider = ({ children }) => {
  const { log } = useDevmode();
  const apiCrud = async (formData, scope, endpoint, config = {}) => {
    try {
      const url = `${apiURL}/${scope}/${endpoint}`;
      const res = await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" }, ...config });
      const apires = res.data;
      if (!apires.error) {
        log(`crud ${endpoint} response:`, apires);
        return apires;
      } else {
        log(`failed to crud ${endpoint}`);
        return null;
      }
    } catch (error) {
      console.error(`error during crud ${endpoint}:`, error);
    }
  };

  const apiRead = async (formData, scope, endpoint, config = {}) => {
    try {
      const url = `${apiURL}/${scope}/${endpoint}`;
      const res = await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" }, ...config });
      const apires = res.data;
      if (!apires.error) {
        log(`reading ${endpoint} data:`, apires);
        return apires;
      } else {
        log(`failed to read ${endpoint} data`);
        return null;
      }
    } catch (error) {
      console.error(`error reading ${endpoint} data:`, error);
    }
  };

  const apiGet = async (scope, endpoint, formData = {}, config = {}) => {
    try {
      const params = new URLSearchParams(formData).toString();
      const url = `${apiURL}/${scope}/${endpoint}?${params}`;
      const res = await axios.get(url, { ...config });
      const apires = res.data;
      if (!apires.error) {
        log(`reading ${endpoint} data:`, apires);
        return apires.data;
      } else {
        log(`failed to read ${endpoint} data`);
        return null;
      }
    } catch (error) {
      console.error(`error reading ${endpoint} data:`, error);
    }
  };

  return <ApiContext.Provider value={{ apiCrud, apiRead, apiGet }}>{children}</ApiContext.Provider>;
};

export const useApi = () => useContext(ApiContext);
