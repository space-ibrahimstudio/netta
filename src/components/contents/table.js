import React, { Fragment, useRef, useState, useEffect } from "react";
import { Expand, Edit, Trash, Copy, Sort, Cancel, Print, Contact, Excel, SatuSehat } from "./icons";
import styles from "./styles/table.module.css";

const AtnIcon = ({ children, onClick }) => {
  return (
    <div className={styles.atnIcon} onClick={onClick}>
      {children}
    </div>
  );
};

export const TD = ({ type = "reg", isCopy, isClickable, onClick, children }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    const el = document.createElement("textarea");
    el.value = children;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const tdstyle = () => {
    let width;
    let color;
    let justifyContent;
    let fontWeight;
    switch (type) {
      case "num":
        width = "var(--pixel-100)";
        color = "var(--color-secondary)";
        justifyContent = "center";
        fontWeight = "600";
        break;
      case "atn":
        width = "var(--pixel-120)";
        color = "var(--color-primary)";
        justifyContent = "center";
        fontWeight = "600";
        break;
      case "link":
        width = "var(--pixel-300)";
        color = "var(--color-primary)";
        justifyContent = "space-between";
        fontWeight = "600";
        break;
      case "reg":
        width = "var(--pixel-300)";
        color = "var(--color-secondary)";
        justifyContent = "space-between";
        fontWeight = "600";
        break;
      case "custom":
        width = "var(--pixel-150)";
        color = "var(--color-secondary)";
        justifyContent = "center";
        fontWeight = "600";
        break;
      default:
        width = "var(--pixel-300)";
        color = "var(--color-secondary)";
        justifyContent = "space-between";
        fontWeight = "600";
        break;
    }

    return { width, color, justifyContent, fontWeight };
  };

  const handleClick = () => {
    if (isClickable && onClick) {
      if (type === "atn") {
        return;
      } else if (type === "link") {
        return;
      } else if (isCopy) {
        return;
      } else if (type === "custom") {
        return;
      } else {
        onClick();
      }
    } else {
      return;
    }
  };

  return (
    <Fragment>
      <div className={`${styles.thReg} ${type === "custom" ? styles.custom : ""} ${isClickable ? (type === "atn" ? "" : styles.click) : ""}`} style={tdstyle()} onClick={handleClick}>
        {type === "atn" || type === "custom" ? (
          children
        ) : (
          <Fragment>
            {type === "link" ? (
              <Fragment>
                <a className={`${styles.linkText} ${copied ? styles.copied : ""}`} href={children} target="_blank" rel="noreferrer">
                  {copied ? "Link Copied!" : children}
                </a>
                <AtnIcon onClick={copyToClipboard}>
                  <Copy color="var(--color-secondary-20)" />
                </AtnIcon>
              </Fragment>
            ) : type === "code" ? (
              <Fragment>
                <code className={`${styles.regText} ${styles.code} ${copied ? styles.copied : ""}`} style={copied ? { opacity: "0.5" } : { opacity: "1" }}>
                  {copied ? "Copied!" : children}
                </code>
                <AtnIcon onClick={copyToClipboard}>
                  <Copy color="var(--color-primary-20)" />
                </AtnIcon>
              </Fragment>
            ) : type === "number" ? (
              <Fragment>
                <h5 className={`${styles.regText} ${styles.number} ${copied ? styles.copied : ""}`} style={copied ? { opacity: "0.5" } : { opacity: "1" }}>
                  {copied ? "Copied!" : children}
                </h5>
                {isCopy && (
                  <AtnIcon onClick={copyToClipboard}>
                    <Copy color="var(--color-secondary-20)" />
                  </AtnIcon>
                )}
              </Fragment>
            ) : (
              <Fragment>
                <h5 className={styles.regText} style={copied ? { opacity: "0.5" } : { opacity: "1" }}>
                  {copied ? "Copied!" : children}
                </h5>
                {isCopy && (
                  <AtnIcon onClick={copyToClipboard}>
                    <Copy color="var(--color-secondary-20)" />
                  </AtnIcon>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
      <div className={styles.tdLine} />
    </Fragment>
  );
};

export const TH = ({ type = "reg", isSorted, onSort, children }) => {
  const thstyle = () => {
    let width;
    let color;
    let justifyContent;
    let fontWeight;
    switch (type) {
      case "num":
        width = "var(--pixel-100)";
        color = "var(--color-foreground)";
        justifyContent = "center";
        fontWeight = "700";
        break;
      case "atn":
        width = "var(--pixel-120)";
        color = "var(--color-foreground)";
        justifyContent = "center";
        fontWeight = "700";
        break;
      case "reg":
        width = "var(--pixel-300)";
        color = "var(--color-foreground)";
        justifyContent = "space-between";
        fontWeight = "700";
        break;
      case "custom":
        width = "var(--pixel-150)";
        color = "var(--color-foreground)";
        justifyContent = "center";
        fontWeight = "700";
        break;
      default:
        width = "var(--pixel-300)";
        color = "var(--color-foreground)";
        justifyContent = "space-between";
        fontWeight = "700";
        break;
    }

    return { width, color, justifyContent, fontWeight };
  };

  return (
    <Fragment>
      <div className={styles.thReg} style={thstyle()}>
        <h3 className={styles.regText}>{children}</h3>
        {isSorted && (
          <AtnIcon onClick={onSort}>
            <Sort width="100%" height="100%" color="var(--color-light-50)" />
          </AtnIcon>
        )}
      </div>
      <div className={styles.thLine} />
    </Fragment>
  );
};

export const TR = ({ children, byNumber, rowIndex, isComplete, isWarning, isDanger, isDeletable, onDelete, isEditable, onEdit, isExpandable, onExpand = () => {}, isCancelable, onCancel, isPrintable, onPrint, isXlsxble, onXlsx, isContactable, onContact, isSSable, onSS, expandContent, isClickable, onClick }) => {
  const ref = useRef();
  const [expanded, setExpanded] = useState(false);

  const renderNumCell = () => {
    if (byNumber) {
      if (React.Children.toArray(children).some((child) => child.type === TD)) {
        return <TD type="num">{rowIndex}</TD>;
      } else {
        return <TH type="num">NO</TH>;
      }
    } else {
      return null;
    }
  };

  const expandClick = () => {
    if (isExpandable && onExpand) {
      onExpand();
      setExpanded(!expanded);
    }
  };

  const renderAtnCell = () => {
    if (isDeletable || isEditable || isExpandable || isCancelable || isPrintable || isXlsxble || isContactable || isSSable) {
      if (React.Children.toArray(children).some((child) => child.type === TD)) {
        return (
          <TD type="atn">
            {isExpandable && (
              <AtnIcon onClick={expandClick}>
                <Expand />
              </AtnIcon>
            )}
            {isEditable && (
              <AtnIcon onClick={onEdit}>
                <Edit />
              </AtnIcon>
            )}
            {isDeletable && (
              <AtnIcon onClick={onDelete}>
                <Trash color="var(--color-red)" />
              </AtnIcon>
            )}
            {isCancelable && (
              <AtnIcon onClick={onCancel}>
                <Cancel color="var(--color-red)" />
              </AtnIcon>
            )}
            {isPrintable && (
              <AtnIcon onClick={onPrint}>
                <Print />
              </AtnIcon>
            )}
            {isXlsxble && (
              <AtnIcon onClick={onXlsx}>
                <Excel color="var(--color-green)" />
              </AtnIcon>
            )}
            {isContactable && (
              <AtnIcon onClick={onContact}>
                <Contact color="var(--color-green)" />
              </AtnIcon>
            )}
            {isSSable && (
              <AtnIcon onClick={onSS}>
                <SatuSehat />
              </AtnIcon>
            )}
          </TD>
        );
      } else {
        return <TH type="atn">Action</TH>;
      }
    } else {
      return null;
    }
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section ref={ref} className={`${styles.rowWrap} ${isComplete ? styles.complete : isWarning ? styles.warning : isDanger ? styles.danger : ""}`}>
      <div className={`${styles.bodyRow} ${isComplete ? styles.complete : isWarning ? styles.warning : isDanger ? styles.danger : ""}`}>
        {renderNumCell()}
        {renderAtnCell()}
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { isClickable, onClick });
        })}
      </div>
      {expanded && (
        <div className={styles.tdExpand}>
          <div className={styles.expandContent}>{expandContent}</div>
        </div>
      )}
    </section>
  );
};

export const TBody = ({ children, byNumber, page, limit, isDeletable, isEditable, isExpandable, isClickable, isCancelable, isPrintable, isXlsxble, isContactable, isSSable }) => {
  return (
    <main className={styles.tableBody}>
      {React.Children.map(children, (child, index) => {
        const rowIndex = page !== undefined && limit !== undefined ? (page - 1) * limit + index + 1 : index + 1;
        return React.cloneElement(child, { byNumber, rowIndex, isDeletable, isEditable, isExpandable, isClickable, isCancelable, isPrintable, isXlsxble, isContactable, isSSable });
      })}
    </main>
  );
};

export const THead = ({ children, byNumber, isDeletable, isEditable, isExpandable, isCancelable, isPrintable, isXlsxble, isContactable, isSSable }) => {
  return (
    <header className={styles.tableHead}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { byNumber, isDeletable, isEditable, isExpandable, isCancelable, isPrintable, isXlsxble, isContactable, isSSable });
      })}
    </header>
  );
};

const Table = ({ id, byNumber, page, limit, isLoading, loadingPlacholder, isNoData, noDataPlaceholder, isDeletable, isEditable, isExpandable, isClickable, isCancelable, isPrintable, isXlsxble, isContactable, isSSable, children }) => {
  const isDataPaging = page !== undefined && limit !== undefined;

  return (
    <section id={id} className={styles.tableWrapper}>
      {isLoading ? (
        <div className={styles.tableNodata}>{loadingPlacholder ? loadingPlacholder : <b className={styles.nodataText}>Loading ...</b>}</div>
      ) : isNoData ? (
        <div className={styles.tableNodata}>{noDataPlaceholder ? noDataPlaceholder : <b className={styles.nodataText}>Tidak ada Data.</b>}</div>
      ) : (
        <div className={styles.table}>
          {React.Children.map(children, (child) => {
            return React.cloneElement(child, { byNumber, page: isDataPaging ? page : undefined, limit: isDataPaging ? limit : undefined, isDeletable, isEditable, isExpandable, isClickable, isCancelable, isPrintable, isXlsxble, isContactable, isSSable });
          })}
        </div>
      )}
    </section>
  );
};

export default Table;
