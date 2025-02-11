import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useDevmode } from "@ibrahimstudio/react";
import { useNotifications } from "../../components/feedbacks/context/notifications-context";
import LoadingScreen from "../../components/feedbacks/screens";

const AuthContext = createContext();
const apiURL = process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const { log } = useDevmode();
  const { showNotifications } = useNotifications();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (reqdata) => {
    try {
      const formData = new FormData();
      // const logFormData = new FormData();
      formData.append("data", JSON.stringify({ phone: reqdata.phone, otp: reqdata.otp }));
      const url = `${apiURL}/authapi/login`;
      // const logurl = `${apiURL}/authapi/loginlog`;
      const response = await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
      const loginresponse = response.data;
      if (!loginresponse.error) {
        const userdata = loginresponse.data[0];
        const { name, phone, otp, position, secret, akses } = userdata;
        const ipurl = "https://api.ipify.org?format=json";
        const ipresponse = await axios.get(ipurl);
        let ip_address;
        if (!ipresponse.data.error) {
          ip_address = ipresponse.data.ip;
        } else {
          ip_address = "0.0.0.0";
        }
        // logFormData.append("data", JSON.stringify({ username, level, activity: "login", ip: ip_address }));
        // const logresponse = await axios.post(logurl, logFormData, { headers: { "Content-Type": "multipart/form-data" } });
        sessionStorage.setItem("logged-in", "true");
        sessionStorage.setItem("secret", secret);
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("phone", phone);
        sessionStorage.setItem("OTP", otp);
        sessionStorage.setItem("position", position);
        sessionStorage.setItem("level", akses);
        sessionStorage.setItem("ip-address", ip_address);
        log("successfully logged in:", loginresponse);
        log("your current ip address:", ip_address);
        // log("logging your current activity:", logresponse.data);
        showNotifications("success", `Kamu berhasil login. Selamat datang kembali, ${name}!`);
        setIsLoggedin(true);
      } else if (!loginresponse.status) {
        log("invalid username or password!");
        showNotifications("danger", "Username atau Password yang kamu masukkan salah.");
        setIsLoggedin(false);
      } else {
        log("please check your internet connection and try again.");
        showNotifications("danger", "Ada kesalahan saat login. Periksa koneksi internet dan coba lagi.");
        setIsLoggedin(false);
      }
    } catch (error) {
      showNotifications("danger", "Permintaan tidak dapat di proses. Mohon coba sesaat lagi.");
      console.error("error occurred during login:", error);
      setIsLoggedin(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = (method = "manual") => {
    try {
      sessionStorage.removeItem("logged-in");
      sessionStorage.removeItem("secret");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("phone");
      sessionStorage.removeItem("OTP");
      sessionStorage.removeItem("position");
      sessionStorage.removeItem("level");
      sessionStorage.removeItem("ip-address");
      log("successfully logged out");
      if (method === "ipkick") {
        showNotifications("danger", "Alamat IP berubah. Mohon login ulang.");
      } else if (method === "secretkick") {
        showNotifications("danger", "Terdeteksi login di 2 sesi yang berbeda. Mohon login ulang.");
      } else {
        showNotifications("success", "Kamu berhasil logout. Mohon login ulang untuk mengakses Dashboard.");
      }
      setIsLoggedin(false);
    } catch (error) {
      console.error("error occurred during logout:", error);
      showNotifications("danger", "Permintaan tidak dapat di proses. Mohon coba sesaat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const auth = async () => {
    const formData = new FormData();
    try {
      const loggedin = sessionStorage.getItem("logged-in");
      const secret = sessionStorage.getItem("secret");
      const level = sessionStorage.getItem("level");
      const currentip = sessionStorage.getItem("ip-address");
      const ipurl = "https://api.ipify.org?format=json";
      const ipresponse = await axios.get(ipurl);
      let ip_address;
      if (!ipresponse.data.error) {
        ip_address = ipresponse.data.ip;
      } else {
        ip_address = "0.0.0.0";
      }
      if (loggedin === "true" && secret && level) {
        if (currentip === ip_address) {
          log("user logged in and ip-address matched", `${currentip} -> ${ip_address}`);
          setIsLoggedin(true);
        } else {
          logout("ipkick");
        }
        formData.append("secret", secret);
        const authurl = `${apiURL}/authapi/auth`;
        const authresponse = await axios.post(authurl, formData, { headers: { "Content-Type": "multipart/form-data" } });
        if (authresponse && authresponse.data.status === 202) {
          log("user logged in and secret session matched", authresponse);
          setIsLoggedin(true);
        } else {
          logout("secretkick");
        }
      } else {
        sessionStorage.removeItem("logged-in");
        sessionStorage.removeItem("secret");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("phone");
        sessionStorage.removeItem("OTP");
        sessionStorage.removeItem("position");
        sessionStorage.removeItem("level");
        sessionStorage.removeItem("ip-address");
        log("user is not logged in");
        setIsLoggedin(false);
      }
    } catch (error) {
      console.error("error occurred during authentication check:", error);
    } finally {
      setLoading(false);
    }
  };

  const username = sessionStorage.getItem("name");
  const secret = sessionStorage.getItem("secret");
  const level = sessionStorage.getItem("level");
  const ip_address = sessionStorage.getItem("ip-address");

  useEffect(() => {
    auth();
  }, [location]);

  if (isLoggedin === null || loading) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={{ loading, isLoggedin, login, logout, username, secret, level, ip_address }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
