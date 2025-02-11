import React from "react";
import styles from "./styles/fieldset.module.css";
import tglcss from "./styles/toggle-switch.module.css";

export const ToggleSwitch = ({ id, isChecked, isLoading, onToggle }) => {
  return (
    <div id={id} className={`${tglcss.checkboxWrapper} ${isLoading ? tglcss.loading : ""}`}>
      <input id={`cbx-${id}`} type="checkbox" checked={isChecked} onChange={onToggle} />
      <label className={tglcss.toggle} htmlFor={`cbx-${id}`}>
        <span>
          <div className={tglcss.toggleIcon}>
            <svg viewBox="0 0 10 10" height="100%" width="100%">
              <path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z"></path>
            </svg>
          </div>
        </span>
      </label>
    </div>
  );
};

const Fieldset = ({ type = "reg", gap = "var(--pixel-10)", markers, children, startContent, endContent }) => {
  const fieldsetstyles = { gap: gap };

  return (
    <section className={styles.inputWrap} style={fieldsetstyles}>
      {type === "row" && startContent}
      {type === "row" && markers && <b className={styles.wrapMarkers}>{markers}</b>}
      <div className={`${styles.wrapBody} ${type === "row" ? styles.row : ""}`} style={fieldsetstyles}>
        {children}
      </div>
      {type === "row" && <div className={styles.wrapEndContent}>{endContent}</div>}
    </section>
  );
};

export default Fieldset;
