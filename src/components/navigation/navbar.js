import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Img from "../media/images";
import PrimButton, { NavButton } from "../formel/buttons";
import { Arrow } from "../content/icons";
import styles from "./styles/navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(location.pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setCurrentTab(location.pathname);
  }, [location]);

  return (
    <header className={styles.navbar}>
      <section className={`${styles.wrap} ${scrolled ? styles.scrolled : ""}`}>
        <Img className={styles.logo} src="/png/logo.webp" alt="Logo Netta Code Indonesia" onClick={() => navigate("/")} />
        <section className={styles.menuwrap}>
          <nav className={styles.menu}>
            <NavButton active={currentTab === "/"} onClick={() => navigate("/")}>
              Home
            </NavButton>
            <NavButton active={currentTab === "/about"} onClick={() => navigate("/about")}>
              About Us
            </NavButton>
            <NavButton active={currentTab === "/services"} onClick={() => navigate("/services")}>
              Services
            </NavButton>
            <NavButton active={currentTab === "/programs"} onClick={() => navigate("/programs")}>
              Programs
            </NavButton>
            <NavButton active={currentTab === "/portfolios"} onClick={() => navigate("/portfolios")}>
              Portfolios
            </NavButton>
            <NavButton active={currentTab === "/pricing"} onClick={() => navigate("/pricing")}>
              Pricing
            </NavButton>
            <NavButton active={currentTab === "/faq"} onClick={() => navigate("/faq")}>
              FAQ
            </NavButton>
            <NavButton active={currentTab === "/blog"} onClick={() => navigate("/blog")}>
              Blog
            </NavButton>
          </nav>
          <PrimButton icon={<Arrow />}>Contact Us</PrimButton>
        </section>
      </section>
    </header>
  );
};

export default Navbar;
