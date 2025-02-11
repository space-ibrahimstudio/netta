import React, { Fragment, useRef, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useWindow } from "@ibrahimstudio/react";
import Navbar from "../navigation/navbar";
import Footer from "../navigation/footer";
import styles from "./styles/page.module.css";

export const Glass = ({ id, zIndex = "1", flex = "unset", cwidth = "unset", maxWidth = "unset", minWidth = "unset", cheight = "unset", maxHeight = "unset", minHeight = "unset", radius = "1.25em", position = "relative", top = "unset", bottom = "unset", left = "unset", right = "unset", alignSelf = "stretch", overflow = "hidden", padding = "1.25em", gap = "1.25em", direction = "column", alignItems = "flex-start", justifyContent = "flex-start", textAlign = "unset", margin = "unset", children }) => {
  const sectionid = `${id}-glass`;
  const sectionstyles = {
    zIndex,
    alignSelf,
    display: "flex",
    flex,
    width: cwidth,
    minWidth,
    maxWidth,
    height: cheight,
    minHeight,
    maxHeight,
    borderRadius: radius,
    position,
    top,
    bottom,
    left,
    right,
    flexDirection: direction,
    alignItems,
    justifyContent,
    padding,
    gap,
    overflow,
    backgroundColor: "rgba(248, 253, 255, 0.2)",
    backdropFilter: "blur(10px)",
    border: "0.0625em solid rgba(255, 255, 255, 8)",
    textAlign,
    margin,
  };

  return (
    <section id={sectionid} style={sectionstyles}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === Fragment) return <Fragment>{React.Children.map(child.props.children, (fragmentChild) => (React.isValidElement(fragmentChild) ? React.cloneElement(fragmentChild, { id: sectionid }) : fragmentChild))}</Fragment>;
          return React.cloneElement(child, { id: sectionid });
        }
        return child;
      })}
    </section>
  );
};

export const Section = ({
  id,
  display = "flex",
  flex = "unset",
  cwidth = "unset",
  maxWidth = "unset",
  minWidth = "unset",
  cheight = "unset",
  maxHeight = "unset",
  minHeight = "unset",
  position = "relative",
  alignSelf = "stretch",
  overflow = "hidden",
  padding = "unset",
  gap = "1.25em",
  radius = "0",
  direction = "column",
  alignItems = "flex-start",
  justifyContent = "flex-start",
  isWrap = false,
  isWrapReverse = false,
  color = "var(--color-secondary)",
  border = "unset",
  backgroundColor = "transparent",
  textAlign = "unset",
  margin = "unset",
  zIndex = "1",
  style,
  children,
}) => {
  const sectionid = `${id}-section`;
  const sectionstyles = { alignSelf, display, flex, width: cwidth, minWidth, maxWidth, height: cheight, minHeight, maxHeight, position, flexDirection: isWrap ? "row" : direction, flexWrap: isWrap ? (isWrapReverse ? "wrap-reverse" : "wrap") : "unset", alignItems, justifyContent, padding, gap, borderRadius: radius, color, border, backgroundColor, textAlign, margin, zIndex };
  const getOverflow = () => {
    let styles;
    switch (overflow) {
      case "x-open":
        styles = { overflowX: "auto" };
        break;
      case "y-open":
        styles = { overflowY: "auto" };
        break;
      case "xy-open":
        styles = { overflow: "auto" };
        break;
      case "hidden":
        styles = { overflow: "hidden" };
        break;
      default:
        break;
    }
    return styles;
  };

  return (
    <section id={sectionid} style={{ ...sectionstyles, ...getOverflow(), ...style }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === Fragment) return <Fragment>{React.Children.map(child.props.children, (fragmentChild) => (React.isValidElement(fragmentChild) ? React.cloneElement(fragmentChild, { id: sectionid }) : fragmentChild))}</Fragment>;
          return React.cloneElement(child, { id: sectionid });
        }
        return child;
      })}
    </section>
  );
};

export const Container = ({ id, display = "flex", flex = "unset", cwidth = "unset", maxWidth = "unset", minWidth = "unset", cheight = "unset", maxHeight = "unset", minHeight = "unset", position = "relative", alignSelf = "stretch", overflow = "hidden", padding = "unset", gap = "1.25em", direction = "column", alignItems = "flex-start", justifyContent = "flex-start", isWrap = false, isWrapReverse = false, backgroundColor = "transparent", textAlign = "unset", children }) => {
  const { width } = useWindow();
  const sectionid = `${id}-container`;
  const sectionstyles = { alignSelf, overflow, display, flex, width: cwidth, minWidth, maxWidth, height: cheight, minHeight, maxHeight, position, flexDirection: isWrap ? "row" : direction, flexWrap: isWrap ? (isWrapReverse ? "wrap-reverse" : "wrap") : "unset", alignItems, justifyContent, padding: padding !== "unset" ? padding : width <= 910 ? (width > 700 ? "1.25em 2.5em" : "1.25em") : "1.25em 9.375em", gap, backgroundColor, textAlign };

  return (
    <section id={sectionid} style={sectionstyles}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === Fragment) return <Fragment>{React.Children.map(child.props.children, (fragmentChild) => (React.isValidElement(fragmentChild) ? React.cloneElement(fragmentChild, { id: sectionid }) : fragmentChild))}</Fragment>;
          return React.cloneElement(child, { id: sectionid });
        }
        return child;
      })}
    </section>
  );
};

const ornaments = [
  { src: "/png/ornament1.png", width: 4.9, position: "left", offset: -1 },
  { src: "/png/ornament2.png", width: 14.7, position: "right", offset: -5.5 },
  { src: "/png/ornament3.png", width: 15.6, position: "left", offset: -9.3 },
  { src: "/png/ornament4.png", width: 21.8, position: "right", offset: -10.5 },
  { src: "/png/ornament2.png", width: 14.7, position: "left", offset: -5.5 },
  { src: "/png/ornament1.png", width: 4.9, position: "right", offset: -1 },
  { src: "/png/ornament4.png", width: 21.8, position: "left", offset: -10.5 },
  { src: "/png/ornament3.png", width: 15.6, position: "right", offset: -9.3 },
];

const Ornament = ({ src, width, position, offset, style }) => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const pxwidth = width * fontSize;
  const pxoffset = offset * fontSize;
  return <img ref={ref} src={src} alt="" loading="lazy" className={`${styles.ornament} ${position === "left" ? styles.left : styles.right} ${inView ? styles.revealed : ""}`} style={{ width: `${pxwidth}px`, height: "auto", [position]: `${pxoffset}px`, ...style }} />;
};

const Page = ({ pageid, isFullscreen = false, type = "public", children }) => {
  const ref = useRef(null);
  const [pageHeight, setPageHeight] = useState(0);
  const pagestyles = { width: "100%", minHeight: "100vh", position: "relative", paddingTop: isFullscreen ? "unset" : "5.625em", backgroundColor: "var(--color-foreground)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" };
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const ornSpacing = 12 * fontSize;
  const ornPositions = Array.from({ length: Math.ceil(pageHeight / ornSpacing) }, (_, index) => index * ornSpacing);

  useEffect(() => {
    if (ref.current) {
      setPageHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <main ref={ref} id={pageid} style={pagestyles}>
      {!isFullscreen && <Navbar id={pageid} parentType={type} />}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === Fragment) return <Fragment>{React.Children.map(child.props.children, (fragmentChild) => (React.isValidElement(fragmentChild) ? React.cloneElement(fragmentChild, { id: pageid }) : fragmentChild))}</Fragment>;
          return React.cloneElement(child, { id: pageid });
        }
        return child;
      })}
      {ornPositions.map((position, index) => {
        const { src, width, position: side, offset } = ornaments[index % ornaments.length];
        return <Ornament key={index} src={src} width={width} position={side} offset={offset} style={{ marginTop: index === 0 ? "5.625em" : "unset", position: "absolute", zIndex: "0", top: `${position}px` }} />;
      })}
      {!isFullscreen && <Footer id={pageid} />}
    </main>
  );
};

export default Page;
