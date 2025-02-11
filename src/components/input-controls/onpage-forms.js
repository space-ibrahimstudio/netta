import React from "react";
import styles from "./styles/onpage-forms.module.css";

export const FormFooter = ({ children }) => {
  return <footer className={styles.formFooter}>{children}</footer>;
};

export const FormHead = ({ title }) => {
  return (
    <header className={styles.formHead}>
      <h1 className={styles.formTitle}>{title}</h1>
    </header>
  );
};

const OnpageForm = ({ loading, children, onSubmit }) => {
  return (
    <form className={styles.onpageForm} onSubmit={onSubmit}>
      {loading ? null : children}
    </form>
  );
};

export default OnpageForm;
