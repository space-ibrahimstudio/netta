import React from "react";
import styles from "./styles/markers.module.css";

export const PortfolioMarker = ({ children }) => {
  return <section className={`${styles.marker} ${styles.portfolio}`}>{children}</section>;
};

const SectionMarker = ({ children }) => {
  return <section className={`${styles.marker} ${styles.section}`}>{children}</section>;
};

export default SectionMarker;
