import React, { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContent, useWindow } from "@ibrahimstudio/react";
import { Button } from "@ibrahimstudio/button";
import { useAuth } from "../../libs/securities/auth";
import { useApi } from "../../libs/apis/office";
import { useAbsence } from "../../libs/plugins/handler";
import { useNotifications } from "../feedbacks/context/notifications-context";
import { TabButton, DropDownButton } from "../input-controls/buttons";
import { Power, Close, Burger } from "../contents/icons";
import styles from "./styles/navbar.module.css";
import menu from "./styles/mobile-menu.module.css";

const MobileMenu = ({ tabMenus, onClose }) => {
  const navigate = useNavigate();
  const { toPathname, toTitleCase } = useContent();
  const [isClosing, setIsClosing] = useState(false);
  const ref = useRef(null);

  const handleClose = () => setIsClosing(true);
  const SubTabClick = (menuName, submenuName) => {
    const formattedmenu = toPathname(menuName);
    const formattedsubmenu = toPathname(submenuName);
    const url = `/${formattedmenu}/${formattedsubmenu}`;
    navigate(url);
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
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsClosing(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setIsClosing]);

  return (
    <Fragment>
      <section ref={ref} className={`${menu.mobileMenu} ${isClosing ? menu.close : ""}`}>
        <div className={menu.menuHeader}>
          <img className={styles.navLogoIcon} loading="lazy" alt="" src="/svg/logo-primary.svg" />
          <button className={menu.closeButton} onClick={handleClose}>
            <Close color="var(--color-secondary)" />
          </button>
        </div>
        <div className={menu.menuNav}>
          {Array.isArray(tabMenus) &&
            tabMenus.map((menu, index) => (
              <TabButton key={index} isActive={menu["Menu Utama"].menu} hasSubMenu={menu["Sub Menu"] && menu["Sub Menu"].length > 0} buttonText={menu["Menu Utama"].menu}>
                {menu["Sub Menu"] && menu["Sub Menu"].map((submenu, index) => <DropDownButton key={index} buttonText={toTitleCase(submenu.submenu)} onClick={() => SubTabClick(menu["Menu Utama"].menu, submenu.submenu)} />)}
              </TabButton>
            ))}
        </div>
      </section>
      <div className={`${menu.mobileMenuBg} ${isClosing ? menu.close : ""}`} style={{ content: "''", position: "fixed", top: "0", right: "0", bottom: "0", left: "0", zIndex: "1001", backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>
    </Fragment>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const { toPathname, toTitleCase } = useContent();
  const { width } = useWindow();
  const { secret, level, logout } = useAuth();
  const { apiRead } = useApi();
  const { isAbsence, absenceIn, absenceOut } = useAbsence();
  const { showNotifications } = useNotifications();
  const [tabMenus, setTabMenus] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutClick = () => logout();
  const SubTabClick = (menuName, submenuName) => {
    const formattedmenu = toPathname(menuName);
    const formattedsubmenu = toPathname(submenuName);
    const url = `/${formattedmenu}/${formattedsubmenu}`;
    navigate(url);
  };

  const absenceClick = () => {
    if (isAbsence) absenceOut();
    else absenceIn();
  };

  const fetchData = async () => {
    const errormsg = `Terjadi kesalahan saat memuat Dashboard. Mohon periksa koneksi internet anda dan coba lagi.`;
    const menuFormData = new FormData();
    try {
      menuFormData.append("data", JSON.stringify({ secret, level }));
      const menudata = await apiRead(menuFormData, "kpi", "viewmenu");
      const menuparams = menudata.data;
      if (menuparams && menuparams.length > 0) setTabMenus(menuparams);
      else setTabMenus([]);
    } catch (error) {
      showNotifications("danger", errormsg);
      console.error(errormsg, error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <nav className={styles.nav}>
      <section className={styles.navBody}>
        <img className={styles.navLogo} loading="lazy" alt="Navbar Logo" src="/png/logo.webp" onClick={() => navigate("/")} />
        {/* prettier-ignore */}
        <div className={styles.navMenu}>
          {Array.isArray(tabMenus) && tabMenus.map((menu, index) => (
            <TabButton key={index} isActive={menu["Menu Utama"].menu} hasSubMenu={menu["Sub Menu"] && menu["Sub Menu"].length > 0} buttonText={menu["Menu Utama"].menu}>
              {menu["Sub Menu"] && menu["Sub Menu"].map((submenu, index) => (
                <DropDownButton key={index} buttonText={toTitleCase(submenu.submenu)} onClick={() => SubTabClick(menu["Menu Utama"].menu, submenu.submenu)} />
              ))}
            </TabButton>
          ))}
        </div>
      </section>
      <section className={styles.navToggle}>
        {level === "STAFF" && <Button id={isAbsence ? "absence-out" : "absence-in"} size="sm" radius="md" buttonText={isAbsence ? "Absen Keluar" : "Absen Masuk"} onClick={absenceClick} />}
        <Button id="logout" size="sm" radius="md" bgColor="var(--color-red-20)" color="var(--color-red)" buttonText="Keluar" onClick={logoutClick} startContent={<Power />} />
        {width < 880 && <Button id="menu-drawer" size="sm" variant="hollow" subVariant="icon" radius="md" iconContent={<Burger color="var(--color-secondary)" />} onClick={() => setMenuOpen(true)} />}
      </section>
      {menuOpen && <MobileMenu tabMenus={tabMenus} onClose={() => setMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;
