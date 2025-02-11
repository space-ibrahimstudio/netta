import React from "react";

const ContactForm = ({ onSubmit, children }) => {
  const styles = { margin: "0", width: "100%", borderRadius: "1.5625em", backgroundColor: "var(--color-foreground)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-start", padding: "0.9375em", boxSizing: "border-box", gap: "0.625em" };

  return (
    <form style={styles} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default ContactForm;
