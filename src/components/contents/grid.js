import React from "react";
import styles from "./styles/grid.module.css";

export const GridItem = ({ type = "contain", src, label, children }) => {
  const imageClick = () => window.open(src, "_blank");
  return <div className={styles.galleryImage}>{type === "contain" ? children : <img className={styles.galleryImageIcon} loading="lazy" alt={label} src={src} onClick={imageClick} />}</div>;
};

const Grid = ({ children }) => {
  return <section className={styles.galleryBody}>{children}</section>;
};

export default Grid;
