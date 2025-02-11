import React, { Fragment } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./styles/loading-screen.module.css";

export const WarningScreen = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Version on Build</title>
      </Helmet>
      <div className={styles.homeReplace}>
        <section className={styles.homeReplaceContent}>
          <h1 className={styles.homeReplaceTitle}>Version on Build</h1>
          <h4 className={styles.homeReplaceBody}>Dimensi perangkat anda saat ini belum didukung oleh web versi ini (v0.1.0).</h4>
          <h4 className={styles.homeReplaceBody}>Mohon gunakan perangkat dengan dimensi yang lebih besar (tablet atau desktop) untuk pengalaman yang lebih baik.</h4>
        </section>
      </div>
    </Fragment>
  );
};

export const LoadingContent = ({ color = "var(--color-light)" }) => {
  const circlestyles = { backgroundColor: color };

  return (
    <div className={styles.loadingCircle}>
      <div className={styles.loadingCircleBody} style={{ padding: "0", gap: "var(--pixel-5)" }}>
        <div className={styles.circleBodySm} style={circlestyles} />
        <div className={styles.circleBodySm} style={circlestyles} />
        <div className={styles.circleBodySm} style={circlestyles} />
      </div>
    </div>
  );
};

const LoadingScreen = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Loading ...</title>
      </Helmet>
      <div className={styles.loadingScreen}>
        <div className={styles.boxes}>
          <div className={styles.box}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={styles.box}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={styles.box}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={styles.box}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoadingScreen;
