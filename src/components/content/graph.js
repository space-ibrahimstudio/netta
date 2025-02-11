import React, { Fragment } from "react";

const useGraph = () => {
  const getStyles = (flex, size, align, color, type, weight, opacity, style, decoration, lineHeight, truncated, clamp, whiteSpace) => {
    return { flex, position: "relative", margin: "0", textAlign: align, color, fontFamily: type === "primary" ? "var(--font-primary)" : "var(--font-secondary)", fontSize: size, fontWeight: weight, fontStyle: style, textDecoration: decoration, opacity, lineHeight, margin: "0", textOverflow: truncated ? "ellipsis" : "unset", lineClamp: truncated ? clamp : "unset", whiteSpace: truncated && clamp === "1" ? "nowrap" : whiteSpace };
  };

  const H1 = ({ id, flex = "unset", size = "1.5625em", align = "left", color = "var(--color-primary)", weight = "700", style = "normal", decoration = "unset", type = "primary", opacity = "1", lineHeight = "120%", truncated = false, clamp, whiteSpace = "unset", children }) => {
    const compid = `${id}-h1`;
    return (
      <h1 id={compid} style={getStyles(flex, size, align, color, type, weight, opacity, style, decoration, lineHeight, truncated, clamp, whiteSpace)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === Fragment) return <Fragment>{React.Children.map(child.props.children, (fragmentChild) => (React.isValidElement(fragmentChild) ? React.cloneElement(fragmentChild, { id: compid }) : fragmentChild))}</Fragment>;
            return React.cloneElement(child, { id: compid });
          }
          return child;
        })}
      </h1>
    );
  };

  const Span = ({ id, flex = "unset", size = "inherit", align = "left", color = "inherit", weight = "inherit", style = "normal", decoration = "unset", type = "secondary", opacity = "1", lineHeight = "135%", truncated = false, clamp, whiteSpace, children }) => {
    const compid = `${id}-span`;
    return (
      <span id={compid} style={getStyles(flex, size, align, color, type, weight, opacity, style, decoration, lineHeight, truncated, clamp, whiteSpace)}>
        {children}
      </span>
    );
  };

  const P = ({ id, flex = "unset", size = "1.125em", align = "left", color = "var(--color-secondary)", weight = "500", style = "normal", decoration = "unset", type = "secondary", opacity = "1", lineHeight = "135%", truncated = false, clamp, whiteSpace, children }) => {
    const compid = `${id}-paragraph`;
    return (
      <p id={compid} style={getStyles(flex, size, align, color, type, weight, opacity, style, decoration, lineHeight, truncated, clamp, whiteSpace)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === Fragment) return <Fragment>{React.Children.map(child.props.children, (fragmentChild) => (React.isValidElement(fragmentChild) ? React.cloneElement(fragmentChild, { id: compid }) : fragmentChild))}</Fragment>;
            return React.cloneElement(child, { id: compid });
          }
          return child;
        })}
      </p>
    );
  };

  const A = ({ id, href = "https://nettacode.com", target = "_blank", flex = "unset", size = "inherit", align = "left", color = "inherit", weight = "inherit", style = "normal", type = "secondary", lineHeight = "135%", children }) => {
    const compid = `${id}-span`;
    return (
      <a id={compid} href={href} target={target} style={{ ...{ cursor: "pointer" }, ...getStyles(flex, size, align, color, type, weight, undefined, style, "underline", lineHeight, undefined) }}>
        {children}
      </a>
    );
  };

  return { H1, Span, P, A };
};

export default useGraph;
