import React from "react";
import styles from "./styles/buttons.module.css";

export const NavButton = ({ active = false, onClick = () => {}, children }) => {
  return (
    <button className={`${styles.navButton} ${active ? styles.active : ""}`} onClick={onClick}>
      {children}
    </button>
  );
};

const PrimButton = ({ onClick = () => {}, icon, children }) => {
  return (
    <button className={styles.primButton} onClick={onClick}>
      {children}
      <div className={styles.icon}>{icon}</div>
    </button>
  );
};

export default PrimButton;
