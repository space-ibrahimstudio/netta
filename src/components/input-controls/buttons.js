import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContent } from "@ibrahimstudio/react";
import { Chevron, Arrow } from "../contents/icons";
import tab from "./styles/tab-button.module.css";

export const DropDownButton = ({ buttonText, onClick }) => {
  return (
    <div className={tab.dropdownButton} onClick={onClick}>
      <b className={tab.dropdownButtonText}>{buttonText}</b>
      <div className={tab.dropdownButtonIcon}>
        <Arrow size="var(--pixel-20)" />
      </div>
    </div>
  );
};

export const TabButton = ({ isActive, hasSubMenu, buttonText, children }) => {
  const { toTitleCase } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef(null);
  const [activeTab, setActiveTab] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevOpen) => !prevOpen);
  };

  const TabClick = (tabName) => {
    setActiveTab(tabName);
    navigate(`/${tabName.toLowerCase()}`);
  };

  const handleClick = () => {
    if (hasSubMenu) {
      toggleDropdown();
    } else {
      TabClick(buttonText);
    }
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    const pathname = location.pathname;
    const paths = pathname.split("/");
    const parentTabName = paths[1]?.toUpperCase();
    setActiveTab(parentTabName);
  }, [location.pathname]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <button className={`${tab.navMenuTab} ${activeTab === isActive ? tab.active : ""}`} onClick={handleClick}>
      <b className={tab.navMenuTabText}>{toTitleCase(buttonText)}</b>
      {hasSubMenu && <Chevron isFlipped={dropdownOpen} />}
      {dropdownOpen && (
        <section ref={ref} className={`${tab.dropdown} ${dropdownOpen ? tab.opened : tab.closed}`}>
          {children}
        </section>
      )}
    </button>
  );
};

export const ButtonGroup = ({ children }) => {
  const groupstyles = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--pixel-15)",
    backgroundColor: "var(--color-light)",
    overflow: "hidden",
    padding: "var(--pixel-5)",
    gap: "var(--pixel-5)",
  };

  return <section style={groupstyles}>{children}</section>;
};
