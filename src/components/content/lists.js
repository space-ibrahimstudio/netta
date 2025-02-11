import React from "react";
import useGraph from "./graph";
import { Section } from "../layout/frames";
import Img from "../media/images";

export const ContactLi = ({ icon, title, text }) => {
  const { P, H1 } = useGraph();

  return (
    <Section direction="row" alignItems="flex-start" justifyContent="flex-start" gap="0.625em">
      <Img style={{ position: "relative", width: "auto", height: "1.25em" }} src={icon} alt={text} />
      <Section gap="0">
        <H1 size="1em">{title}</H1>
        <P size="1em" opacity="0.7">
          {text}
        </P>
      </Section>
    </Section>
  );
};

const FeatureLi = ({ icon, text }) => {
  const { P } = useGraph();

  return (
    <Section direction="row" alignItems="center" justifyContent="flex-start" gap="0.3125em">
      <Img style={{ position: "relative", width: "1.25em", height: "1.25em" }} src={icon} alt={text} />
      <P size="1em" opacity="0.7">
        {text}
      </P>
    </Section>
  );
};

export default FeatureLi;
