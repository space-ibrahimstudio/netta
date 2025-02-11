import React from "react";
import styles from "./styles/summary-set.module.css";
import cardcss from "./styles/summary-card.module.css";

export const SummaryCard = ({ summaryValue, summaryLabel }) => {
  return (
    <section className={cardcss.summaryCard}>
      <b className={cardcss.summaryValue}>{summaryValue}</b>
      <span className={cardcss.summaryLabel}>{summaryLabel}</span>
    </section>
  );
};

const SummarySet = ({ title, count = "0", row = "3", children }) => {
  return (
    <section className={styles.summarySet}>
      <h1 className={styles.setTitle}>
        {`${title} `}
        <span style={{ color: "var(--color-primary)" }}>{count}</span>
      </h1>
      <section className={styles.setContent} style={{ gridTemplateColumns: `repeat(${row}, 1fr)` }}>
        {children}
      </section>
    </section>
  );
};

export default SummarySet;
