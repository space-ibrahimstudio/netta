import React, { Fragment, useState, useRef, useEffect } from "react";
import useGraph from "./graph";
import { Section } from "../layout/frames";
import { PortfolioMarker } from "./markers";
import Img from "../media/images";
import portcss from "./styles/portfolio-card.module.css";
import faqqcss from "./styles/faq-card.module.css";

export const IntroCard = ({ placement = "horizontal", title, desc, cta, icon }) => {
  const { H1, P, A } = useGraph();

  return (
    <Section flex="1" alignItems="center" justifyContent="flex-start" direction={placement === "vertical" ? "row" : "column"} padding="1.25em">
      <Section cwidth="3.75em" cheight="3.75em" alignItems="center" justifyContent="center" backgroundColor="var(--color-primary)" radius="50%">
        {icon}
      </Section>
      <Section gap="0.625em" flex={placement === "vertical" ? "1" : "unset"}>
        <H1 color="inherit" size="1.125em">
          {title}
        </H1>
        <P size="1em" opacity="0.7">
          {desc}
        </P>
        <P size="0.875em">
          <A>{cta}</A>
        </P>
      </Section>
    </Section>
  );
};

export const PortfolioCard = ({ placement = "center", flex = "unset", title, desc, image, label, onClick }) => {
  const { H1, P } = useGraph();

  const renderContent = () => {
    switch (placement) {
      case "start":
        return (
          <Fragment>
            <Section flex="1" alignItems="flex-end" justifyContent="flex-start" padding="1.875em">
              <PortfolioMarker>{label}</PortfolioMarker>
            </Section>
            <Section flex="1" direction="row" gap="unset" zIndex="2">
              <Section flex="1" justifyContent="flex-end" padding="1.875em" gap="0.625em" color="var(--color-foreground)">
                <H1 color="inherit" size="1.5625em">
                  {title}
                </H1>
                <P color="inherit" size="1em">
                  {desc}
                </P>
              </Section>
              <Section flex="1"></Section>
            </Section>
            <div className={`${portcss.shading} ${portcss.start}`}></div>
            <img className={`${portcss.portfolio} ${portcss.start}`} src={image} loading="lazy" alt={title} />
          </Fragment>
        );
      case "center":
        return (
          <Fragment>
            <Section flex="1" alignItems="flex-end" justifyContent="flex-start" padding="1.875em">
              <PortfolioMarker>{label}</PortfolioMarker>
            </Section>
            <Section flex="1" justifyContent="flex-end" padding="1.875em" gap="0.625em" color="var(--color-foreground)" zIndex="2">
              <H1 color="inherit" size="1.5625em">
                {title}
              </H1>
              <P color="inherit" size="1em">
                {desc}
              </P>
            </Section>
            <div className={portcss.shading}></div>
            <img className={`${portcss.portfolio} ${portcss.center}`} src={image} loading="lazy" alt={title} />
          </Fragment>
        );
      case "end":
        return (
          <Fragment>
            <Section flex="1" alignItems="flex-end" justifyContent="flex-start" padding="1.875em">
              <PortfolioMarker>{label}</PortfolioMarker>
            </Section>
            <Section flex="1" direction="row" gap="unset" zIndex="2">
              <Section flex="1" justifyContent="flex-end" padding="1.875em" gap="0.625em" color="var(--color-foreground)">
                <H1 color="inherit" size="1.5625em">
                  {title}
                </H1>
                <P color="inherit" size="1em">
                  {desc}
                </P>
              </Section>
              <Section flex="1"></Section>
            </Section>
            <div className={`${portcss.shading} ${portcss.end}`}></div>
            <img className={`${portcss.portfolio} ${portcss.end}`} src={image} loading="lazy" alt={title} />
          </Fragment>
        );
      default:
        return (
          <Fragment>
            <Section flex="1"></Section>
            <Section flex="1" justifyContent="flex-end" padding="1.875em" gap="0.625em" color="var(--color-foreground)" zIndex="2">
              <H1 color="inherit" size="1.5625em">
                {title}
              </H1>
              <P color="inherit" size="1em">
                {desc}
              </P>
            </Section>
            <div className={portcss.shading}></div>
            <img className={`${portcss.portfolio} ${portcss.center}`} src={image} loading="lazy" alt={title} />
          </Fragment>
        );
    }
  };

  return (
    <section className={portcss.portfoliocard} style={{ alignSelf: "stretch", display: "flex", flex, height: "25em", position: "relative", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", gap: "1.25em", borderRadius: "1.5625em", color: "var(--color-secondary)", backgroundColor: "transparent", zIndex: "1", overflow: "hidden" }} onClick={onClick}>
      {renderContent()}
    </section>
  );
};

export const FaqCard = ({ title, content }) => {
  const ref = useRef(null);
  const { H1, P } = useGraph();
  const [isOpened, setIsOpened] = useState(false);

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) setIsOpened(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section ref={ref} className={`${faqqcss.faqcard} ${isOpened ? faqqcss.opened : faqqcss.closed}`} onClick={() => setIsOpened(!isOpened)}>
      <Section flex="1" color="inherit" gap="0.9375em" justifyContent="center">
        <H1 color="inherit" size="1.125em">
          {title}
        </H1>
        {isOpened && <P size="1em">{content}</P>}
      </Section>
      <Img src="/svg/chevron.svg" alt={title} className={faqqcss.faqicon} />
    </section>
  );
};
