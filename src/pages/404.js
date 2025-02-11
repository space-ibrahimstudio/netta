import React from "react";
import { Button } from "@ibrahimstudio/button";
import Pages from "../components/frames/pages";
import { Arrow } from "../components/contents/icons";
import styles from "./styles/404.module.css";

const ErrorPage = () => {
  return (
    <Pages title="404 | Page not found" access="public" topmargin="unset" bottommargin="unset">
      <section className={styles.errorSection}>
        <header className={styles.sectionHead}>
          <h1 className={styles.sectionTitle}>404</h1>
          <span className={styles.sectionDesc}>Halaman tujuan tidak ditemukan.</span>
        </header>
        <Button type="route" radius="md" buttonText="Ke Halaman Utama" to="/" startContent={<Arrow direction="left" />} />
      </section>
    </Pages>
  );
};

export default ErrorPage;
