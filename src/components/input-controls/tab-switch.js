import React from "react";
import styles from "./styles/tab-switch.module.css";

const TabButton = ({ buttonText, onClick, isActive }) => {
  return (
    <button type="button" className={`${styles.tabButton} ${isActive ? styles.active : ""}`} onClick={onClick}>
      <b className={styles.buttonText}>{buttonText}</b>
    </button>
  );
};

const TabSwitch = ({ buttons }) => {
  return (
    <nav className={styles.tabSwitch}>
      <section className={styles.tabScroll}>
        {buttons.map((button, index) => (
          <TabButton key={index} buttonText={button.label} onClick={button.onClick} isActive={button.active} />
        ))}
      </section>
    </nav>
  );
};

export default TabSwitch;
