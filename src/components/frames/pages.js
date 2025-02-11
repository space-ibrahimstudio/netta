import React, { Fragment } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../navigations/navbar";
import BottomBar from "../navigations/bottom-bar";

const Pages = ({ title, access = "private", topmargin = "var(--pixel-70)", bottommargin = "var(--pixel-25)", bgImage, justify = "flex-start", loading, children }) => {
  const layoutstyles = {
    width: "100%",
    position: "relative",
    paddingTop: topmargin,
    paddingBottom: bottommargin,
    backgroundColor: bgImage ? "unset" : "var(--color-foreground)",
    backgroundImage: bgImage ? `url(${bgImage})` : "unset",
    backgroundPosition: bgImage ? "center" : "unset",
    backgroundSize: bgImage ? "cover" : "unset",
    backgroundRepeat: bgImage ? "no-repeat" : "unset",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: justify,
    minHeight: "100vh",
  };

  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <main style={layoutstyles}>
        {access === "private" && <Navbar />}
        {children}
        {access === "private" && <BottomBar loading={loading} />}
      </main>
    </Fragment>
  );
};

export default Pages;
