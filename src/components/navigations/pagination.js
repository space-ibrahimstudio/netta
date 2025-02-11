import React from "react";
import { HChevron } from "../contents/icons";
import styles from "./styles/pagination.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pagesToShow = [];
    const maxPages = 4;

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
    } else {
      const leftBound = Math.max(2, currentPage - 2);
      const rightBound = Math.min(currentPage + 2, totalPages - 1);
      pagesToShow.push(1);
      if (leftBound > 2) {
        pagesToShow.push("ellipsis");
      }
      for (let i = leftBound; i <= rightBound; i++) {
        pagesToShow.push(i);
      }
      if (rightBound < totalPages - 1) {
        pagesToShow.push("ellipsis");
      }
      pagesToShow.push(totalPages);
    }

    return pagesToShow.map((pageNumber, index) => (
      <button key={index} className={`${styles.paginationArrow} ${pageNumber === "ellipsis" ? styles.ellipsis : ""} ${currentPage === pageNumber ? styles.active : ""}`} onClick={() => onPageChange(pageNumber)}>
        {pageNumber === "ellipsis" ? <b className={styles.paginationNumText}>...</b> : <b className={styles.paginationNumText}>{pageNumber}</b>}
      </button>
    ));
  };

  return (
    <div className={styles.pagination}>
      <button className={`${styles.paginationArrow} ${currentPage === 1 ? styles.disable : ""}`} onClick={prevPage}>
        <HChevron size="var(--pixel-25)" direction="left" />
      </button>
      {renderPageNumbers()}
      <button className={`${styles.paginationArrow} ${currentPage === totalPages ? styles.disable : ""}`} onClick={nextPage}>
        <HChevron size="var(--pixel-25)" />
      </button>
    </div>
  );
};

export default Pagination;
