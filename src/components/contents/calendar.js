import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@ibrahimstudio/button";
import { useAlias } from "../../libs/plugins/helper";
import { Close, Badge, Clock, ShopBag, Note } from "./icons";
import styles from "./styles/calendar.module.css";

const modalRoot = document.getElementById("modal-root") || document.body;

export const EventModal = ({ events, onClose }) => {
  const ref = useRef(null);
  const { typeAlias } = useAlias();
  const [isClosing, setIsClosing] = useState(false);

  const badgecolor = (status) => (status === "1" ? "var(--color-green)" : status === "2" ? "var(--color-yellow)" : status === "3" ? "var(--color-red)" : "var(--color-primary)");
  const handleClose = () => setIsClosing(true);
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) setIsClosing(true);
  };

  useEffect(() => {
    if (isClosing) {
      const animationDuration = 500;
      setTimeout(() => {
        onClose();
      }, animationDuration);
    }
  }, [isClosing, onClose]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let modalCount = 0;
    const popupModals = document.querySelectorAll(`.${styles.formScreen}`);
    popupModals.forEach((modal) => {
      if (!modal.classList.contains(`.${styles.close}`)) modalCount++;
    });
    document.documentElement.style.overflow = modalCount > 0 ? "hidden" : "auto";
    return () => (document.documentElement.style.overflow = "auto");
  }, [isClosing]);

  const modalElement = (
    <main className={styles.modalScroll}>
      <section className={`${styles.modalScreen} ${isClosing ? styles.close : ""}`}>
        <div ref={ref} className={`${styles.eventModal} ${isClosing ? styles.close : ""}`}>
          <div className={styles.modalContent}>
            {events.map((event, index) => (
              <div className={styles.modalContentWrap} key={index}>
                <header className={styles.modalNav}>
                  <Badge color={badgecolor(event.status)} />
                  <header className={styles.modalHead}>
                    <h1 className={styles.modalTitle}>{`${event.progname} - ${event.channel}`}</h1>
                    <span className={styles.modalDesc}>{`tipe: ${typeAlias(event.type)}`}</span>
                  </header>
                </header>
                <div className={styles.modalBody}>
                  <div className={styles.modalItem}>
                    <Clock />
                    <p className={styles.itemText}>{`${event.starttime} - ${event.endtime}`}</p>
                  </div>
                  <div className={styles.modalItem}>
                    <ShopBag />
                    <p className={styles.itemText}>{`Target: ${event.target} | Bobot: ${event.bobot}`}</p>
                  </div>
                  {event.info && (
                    <div className={styles.modalItem}>
                      <Note />
                      <p className={styles.itemText}>{event.info}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button radius="full" variant="hollow" subVariant="icon" color="var(--color-secondary-50)" iconContent={<Close size="var(--pixel-25)" />} onClick={handleClose} />
        </div>
      </section>
    </main>
  );

  return createPortal(modalElement, modalRoot);
};

export const DateEvent = ({ label, status, isDisabled }) => {
  const compstyle = {
    color: status === "1" ? "var(--color-green)" : status === "2" ? "var(--color-yellow)" : status === "3" ? "var(--color-red)" : "var(--color-primary)",
    backgroundColor: status === "1" ? "var(--color-green-20)" : status === "2" ? "var(--color-yellow-20)" : status === "3" ? "var(--color-red-20)" : "var(--color-primary-20)",
  };

  return (
    <div className={`${styles.dateEvent} ${isDisabled ? styles.disabled : styles.active}`} style={compstyle}>
      <span className={styles.eventText}>{label}</span>
    </div>
  );
};

export const CalendarDay = ({ children }) => {
  return (
    <div className={styles.calendarDays}>
      <span className={styles.daysText}>{children}</span>
    </div>
  );
};

export const CalendarDate = ({ date, isDisabled, hasEvent = true, children, onClick = () => {} }) => {
  return (
    <div className={`${styles.calendarDate} ${hasEvent ? styles.clickable : ""}`} onClick={hasEvent ? (isDisabled ? () => {} : onClick) : () => {}}>
      <div className={`${styles.dateEventUl} ${isDisabled ? styles.disabled : ""}`}>
        <span className={styles.dateText}>{date}</span>
        {children}
      </div>
    </div>
  );
};

const Calendar = ({ children }) => {
  return (
    <section className={styles.calendar}>
      <div className={styles.calendarHscroll}>
        <div className={styles.calendarGrid}>{children}</div>
      </div>
    </section>
  );
};

export default Calendar;
