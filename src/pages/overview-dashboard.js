import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@ibrahimstudio/button";
import { useAuth } from "../libs/securities/auth";
import { useApi } from "../libs/apis/office";
import { useNotifications } from "../components/feedbacks/context/notifications-context";
import Pages from "../components/frames/pages";
import Calendar, { CalendarDay, CalendarDate, DateEvent, EventModal } from "../components/contents/calendar";
import styles from "./styles/dashboard.module.css";

export const DashboardBody = ({ children }) => {
  return <div className={styles.sectionBody}>{children}</div>;
};

export const DashboardTool = ({ children }) => {
  return <div className={styles.sectionTool}>{children}</div>;
};

export const DashboardToolbar = ({ children }) => {
  return <nav className={styles.sectionNav}>{children}</nav>;
};

export const DashboardHead = ({ title, desc }) => {
  return (
    <header className={styles.sectionHead}>
      <h1 className={styles.sectionTitle}>{title}</h1>
      {desc && <p className={styles.sectionDesc}>{desc}</p>}
    </header>
  );
};

export const DashboardContainer = ({ children }) => {
  return <section className={styles.section}>{children}</section>;
};

const DashboardOverviewPage = () => {
  const { isLoggedin, level, secret } = useAuth();
  const { apiRead } = useApi();
  const { showNotifications } = useNotifications();

  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventsData, setEventsData] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);

  const fetchData = async () => {
    const errormsg = "Terjadi kesalahan saat memuat kalendar. Mohon periksa koneksi internet anda dan coba lagi.";
    const formData = new FormData();
    setIsFetching(true);
    try {
      formData.append("data", JSON.stringify({ secret }));
      const data = await apiRead(formData, "kpi", "viewjobcalendar");
      if (data && data.data && data.data.length > 0) {
        const eventsdata = data.data;
        const mutatedevents = eventsdata.reduce((acc, event) => {
          let dateKey = "";
          const type = event.type;
          const day = event.day;
          const date = event.date;
          if (type === "1") dateKey = "daily";
          else if (type === "2") dateKey = `weekly-${day}`;
          else if (type === "3") dateKey = `monthly-${date}`;
          const label = event.progname;
          const time = `${event.starttime} - ${event.endtime}`;
          const status = event.status;
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push({ ...event, label, time, status });
          acc[dateKey].sort((a, b) => a.starttime.localeCompare(b.starttime));
          return acc;
        }, {});
        setEventsData(mutatedevents);
      } else setEventsData([]);
    } catch (error) {
      showNotifications("danger", errormsg);
      console.error(errormsg, error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isLoggedin) fetchData();
  }, [isLoggedin]);

  if (!isLoggedin) return <Navigate to="/login" />;
  if (level === "STAFF") {
    const daysofweek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const getDaysMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };
    const getFirstDayMonth = (year, month) => {
      return new Date(year, month, 1).getDay();
    };
    const formatDate = (year, month, day) => {
      return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    };

    const generateCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysmonth = getDaysMonth(year, month);
      const firstdaymonth = getFirstDayMonth(year, month);
      const daysprevmonth = getDaysMonth(year, month - 1);
      const calendardays = [];
      let dayCounter = 1;

      const padDay = (day) => (day < 10 ? `0${day}` : `${day}`);

      const getEventsForDate = (day, month, year) => {
        const dayOfWeek = new Date(year, month, day).getDay();
        const formattedDay = padDay(day);
        const dateKey = formatDate(year, month, day);
        const dailyEvents = eventsData["daily"] || [];
        const weeklyEvents = eventsData[`weekly-${dayOfWeek}`] || [];
        const monthlyEvents = eventsData[`monthly-${formattedDay}`] || [];
        const dateSpecificEvents = eventsData[dateKey] || [];
        return [...dailyEvents, ...weeklyEvents, ...monthlyEvents, ...dateSpecificEvents];
      };

      for (let i = firstdaymonth - 1; i >= 0; i--) {
        const day = daysprevmonth - i;
        const date = formatDate(year, month - 1, day);
        const events = getEventsForDate(day, month - 1, year);
        calendardays.push({ day, events, isCurrentMonth: false, date });
      }
      while (dayCounter <= daysmonth) {
        const date = formatDate(year, month, dayCounter);
        const events = getEventsForDate(dayCounter, month, year);
        calendardays.push({ day: dayCounter, events, isCurrentMonth: true, date });
        dayCounter++;
      }
      const anotherdaysmonth = 42 - calendardays.length;
      for (let i = 1; i <= anotherdaysmonth; i++) {
        const date = formatDate(year, month + 1, i);
        const events = getEventsForDate(i, month + 1, year);
        calendardays.push({ day: i, events, isCurrentMonth: false, date });
      }

      const openEvent = (dayObj) => {
        if (dayObj) {
          setSelectedDayEvents(dayObj.events);
          setIsModalOpen(true);
        }
      };

      return calendardays.map((dayObj, index) => (
        <CalendarDate key={index} date={dayObj.day} isDisabled={!dayObj.isCurrentMonth} hasEvent={dayObj.events.length > 0} onClick={() => openEvent(dayObj)}>
          {dayObj.events.slice(0, 3).map((event, i) => (
            <DateEvent key={i} label={event.label} status={event.status} isDisabled={!dayObj.isCurrentMonth} />
          ))}
          {dayObj.events.length > 3 && <DateEvent label={`+${dayObj.events.length - 3} more jobs`} />}
        </CalendarDate>
      ));
    };

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    const handleToday = () => {
      const todayWIB = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
      setCurrentDate(new Date(todayWIB));
    };

    const closeEvent = () => {
      setIsModalOpen(false);
      setSelectedDayEvents([]);
    };

    return (
      <Pages title="Overview - Dashboard">
        <DashboardContainer>
          <DashboardHead title="Program Calendar" />
          <DashboardToolbar>
            <DashboardTool>
              <Button id="today" radius="full" buttonText="Hari Ini" onClick={handleToday} />
            </DashboardTool>
            <DashboardTool>
              <Button id="prev-month" radius="full" variant="line" color="var(--color-primary)" buttonText="Prev Month" onClick={handlePrevMonth} />
              <Button id="next-month" radius="full" buttonText="Next Month" onClick={handleNextMonth} />
            </DashboardTool>
          </DashboardToolbar>
          <DashboardBody>
            <Calendar>
              {daysofweek.map((day) => (
                <CalendarDay key={day}>{day}</CalendarDay>
              ))}
              {generateCalendar()}
            </Calendar>
          </DashboardBody>
          {isModalOpen && <EventModal events={selectedDayEvents} onClose={closeEvent} />}
        </DashboardContainer>
      </Pages>
    );
  } else return <Navigate to="/master/pegawai" />;
};

export default DashboardOverviewPage;
