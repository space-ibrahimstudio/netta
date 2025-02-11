import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/notifications.module.css";

const Notification = ({ type, message, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const ref = useRef(null);

  const notifStyles = () => {
    let backgroundColor;
    switch (type) {
      case "danger":
        backgroundColor = "var(--color-red)";
        break;
      case "warning":
        backgroundColor = "var(--color-yellow)";
        break;
      case "success":
        backgroundColor = "var(--color-primary)";
        break;
      default:
        break;
    }

    return { backgroundColor };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsClosing(true);
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className={`${styles.notifFloat} ${isClosing ? styles.out : styles.in}`} ref={ref}>
      <main className={styles.notifFloatContent} style={notifStyles()}>
        <p className={styles.notifFloatContentText}>{message}</p>
      </main>
    </section>
  );
};

export default Notification;
