import React from "react";
import styles from "./styles/tab-group.module.css";

const GroupButton = ({ buttonText, onClick, isActive }) => {
  return (
    <button type="button" className={`${styles.tabButton} ${isActive ? styles.active : ""}`} onClick={onClick}>
      <b className={styles.buttonText}>{buttonText}</b>
    </button>
  );
};

const TabGroup = ({ buttons }) => {
  return (
    <nav className={styles.tabGroup}>
      <section className={styles.tabScroll}>
        {buttons.map((button, index) => (
          <GroupButton key={index} buttonText={button.label} onClick={button.onClick} isActive={button.active} />
        ))}
      </section>
    </nav>
  );
};

export default TabGroup;
