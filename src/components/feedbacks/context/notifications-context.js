import React, { createContext, useContext, useState, useEffect } from "react";
import Notification from "../notifications";

const NotificationsContext = createContext();

export function useNotifications() {
  return useContext(NotificationsContext);
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(null);

  const showNotifications = (type, message, onClose) => {
    const newNotification = { type, message, onClose };
    setNotifications(newNotification);
    sessionStorage.setItem("notifications", JSON.stringify(newNotification));
  };

  const hideNotifications = () => {
    setNotifications(null);
    sessionStorage.removeItem("notifications");
  };

  useEffect(() => {
    const savedNotifications = JSON.parse(sessionStorage.getItem("notifications"));
    if (savedNotifications) {
      setNotifications(savedNotifications);
    }
  }, []);

  return (
    <NotificationsContext.Provider value={{ showNotifications, hideNotifications }}>
      {children}
      {notifications && (
        <Notification
          type={notifications.type}
          message={notifications.message}
          onClose={() => {
            hideNotifications();
            if (notifications.onClose) {
              notifications.onClose();
            }
          }}
        />
      )}
    </NotificationsContext.Provider>
  );
}
