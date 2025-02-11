import React, { useState, useEffect } from "react";
import { useAuth } from "../../libs/securities/auth";
import { User, NetOn, NetOff, Speed, Cached, Okay, Battery } from "../contents/icons";
import styles from "./styles/bottom-bar.module.css";

const BarContent = ({ content, startContent }) => {
  return (
    <div className={styles.barContent}>
      {startContent}
      <p className={styles.contentText}>{content}</p>
    </div>
  );
};

const BarContentWrap = ({ children }) => {
  return <section className={styles.barContentwrap}>{children}</section>;
};

const BottomBar = ({ loading }) => {
  const { ip_address, username } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryStatus, setBatteryStatus] = useState({ level: "N/A", charging: false });
  const [memoryUsage, setMemoryUsage] = useState({ jsHeapSizeLimit: "N/A", totalJSHeapSize: "N/A", usedJSHeapSize: "N/A" });

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const updateBatteryStatus = (battery) => {
      setBatteryStatus({ level: (battery.level * 100).toFixed(0), charging: battery.charging });
    };
    const getBatteryStatus = async () => {
      if ("getBattery" in navigator) {
        const battery = await navigator.getBattery();
        updateBatteryStatus(battery);
        battery.addEventListener("levelchange", () => updateBatteryStatus(battery));
        battery.addEventListener("chargingchange", () => updateBatteryStatus(battery));
      } else {
        console.warn("Battery Status API is not supported in this browser.");
        setBatteryStatus({ level: "N/A", charging: false });
      }
    };
    getBatteryStatus();
  }, []);

  useEffect(() => {
    const updateMemoryUsage = () => {
      if (performance.memory) {
        const { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } = performance.memory;
        setMemoryUsage({
          jsHeapSizeLimit: (jsHeapSizeLimit / 1048576).toFixed(2),
          totalJSHeapSize: (totalJSHeapSize / 1048576).toFixed(2),
          usedJSHeapSize: (usedJSHeapSize / 1048576).toFixed(2),
        });
      } else {
        console.warn("Memory API is not supported in this browser.");
        setMemoryUsage({
          jsHeapSizeLimit: "N/A",
          totalJSHeapSize: "N/A",
          usedJSHeapSize: "N/A",
        });
      }
    };
    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={`${styles.bottomBar} ${loading ? styles.loading : ""} ${isOnline ? "" : styles.offline}`}>
      <BarContentWrap>
        <BarContent content={username} startContent={<User />} />
        <BarContent content={loading ? "memuat data ..." : "siap digunakan"} startContent={loading ? <Cached animate /> : <Okay />} />
        <BarContent content={`${memoryUsage.usedJSHeapSize} MB`} startContent={<Speed />} />
      </BarContentWrap>
      <BarContentWrap>
        <BarContent content={`IP: ${ip_address}`} />
        <BarContent content={isOnline ? "online" : "offline"} startContent={isOnline ? <NetOn /> : <NetOff />} />
        <BarContent content={`${batteryStatus.level}%`} startContent={<Battery level={batteryStatus.level} charging={batteryStatus.charging} />} />
      </BarContentWrap>
    </footer>
  );
};

export default BottomBar;
