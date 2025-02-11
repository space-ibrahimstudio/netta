import React, { useState } from "react";
import { Button } from "@ibrahimstudio/button";
import { Input } from "@ibrahimstudio/input";
import { Textarea } from "@ibrahimstudio/textarea";
import useGraph from "../components/content/graph";
import Page, { Container, Section, Glass } from "../components/layout/frames";
import PrimButton from "../components/formel/buttons";
import SectionMarker from "../components/content/markers";
import Img from "../components/media/images";
import FeatureLi, { ContactLi } from "../components/content/lists";
import { IntroCard, PortfolioCard, FaqCard } from "../components/content/cards";
import ContactForm from "../components/formel/forms";
import { Send } from "../components/content/icons";
import styles from "./styles/home.module.css";

const HomePage = () => {
  const { H1, P, A } = useGraph();
  const [inputData, setInputData] = useState({ name: "", phone: "", email: "", message: "" });
  const [inputErr, setInputErr] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevState) => ({ ...prevState, [name]: value }));
    setInputErr((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const clearInputState = () => {
    setInputData({ name: "", phone: "", email: "", message: "" });
    setInputErr({ name: "", phone: "", email: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      console.log("data submitted:", inputData);
      clearInputState();
    } catch (error) {
      console.error("error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page pageid="nettacode-home">
      <Container>
        <Section direction="row" isWrap isWrapReverse>
          <Section flex="1" minWidth="25em">
            <Section maxWidth="18.75em">
              <H1 size="3.125em">100%</H1>
              <P size="1em">We are here to assist you in providing IT solutions for various fields of work.</P>
            </Section>
            <Section direction="row" gap="0.625em" alignItems="center">
              <Img style={{ width: "auto", height: "1.875em" }} src="/svg/call.svg" alt="Call Us Today" />
              <P size="1em" flex="1">
                Call Us Today: <A>+62 811 569 992</A>
              </P>
            </Section>
          </Section>
          <Section flex="2" minWidth="25em">
            <SectionMarker>BUSINESS</SectionMarker>
            <H1 color="var(--color-secondary)" size="3.125em">
              Your Best Solution For All You Need.
            </H1>
          </Section>
        </Section>
        <Section direction="row" isWrap>
          <Section flex="1" minWidth="25em" alignItems="flex-end">
            <Glass position="absolute" bottom="2.5em" right="1.25em" zIndex="3" padding="0.9375em" gap="0.625em" maxWidth="11.875em">
              <H1 color="var(--color-secondary)" size="1.125em">
                Who We Are?
              </H1>
              <P size="1em">Learn how to become a sales machine.</P>
              <P size="1em">
                <A>Learn more</A>
              </P>
            </Glass>
            <Img style={{ width: "auto", height: "21.875em", zIndex: "2", borderRadius: "1.5625em" }} src="/png/bot-hand.png" alt="Who We Are" />
            <div className={`${styles.folder} ${styles.leftLine}`} style={{ zIndex: "1", height: "18.75em" }}></div>
            <div className={`${styles.folder} ${styles.left}`} style={{ height: "18.75em" }}></div>
          </Section>
          <Section flex="2" minWidth="25em" direction="row" alignItems="flex-end" justifyContent="flex-end" gap="unset">
            <Section alignSelf="flex-end" justifyContent="center" alignItems="flex-start" flex="1" cheight="14.0625em" zIndex="2" padding="1.875em" gap="0.625em" color="var(--color-foreground)">
              <H1 color="inherit" size="1.5625em">
                Our Best Service For You
              </H1>
              <P color="inherit" size="1em">
                See how can we help you with our Service
              </P>
              <P color="inherit" size="1em">
                <A>Learn more</A>
              </P>
            </Section>
            <Img style={{ width: "auto", height: "21.875em", marginRight: "2.8125em", zIndex: "1" }} src="/png/person-1.png" alt="Our Best Service For You" />
            <div className={`${styles.folder} ${styles.right}`} style={{ height: "18.75em" }}></div>
          </Section>
        </Section>
      </Container>
      <Container>
        <Section padding="1.25em">
          <Section direction="row" zIndex="2">
            <Section flex="2" padding="1.25em">
              <SectionMarker>INTRO</SectionMarker>
              <H1 size="1.5625em" color="inherit" whiteSpace="pre-line">
                {`Grow Up,
                Digitalize Your Business.`}
              </H1>
              <P>Grow your business with the support of our information system, enjoy doing business with all the ease and efficiency of using the system. Monitoring your business anywhere and anytime.</P>
            </Section>
            <Section flex="1"></Section>
          </Section>
          <Section direction="row" zIndex="2">
            <IntroCard title="About Us" icon={<Img style={{ height: "1.5625em", width: "auto" }} src="/svg/about.svg" />} desc="Nettacode boasts a visually striking and modern design" cta="Learn more" />
            <IntroCard title="Our Services" icon={<Img style={{ height: "1.5625em", width: "auto" }} src="/svg/service.svg" />} desc="Top Digital Services to Enhance Your Business" cta="Learn more" />
            <IntroCard title="Contact Us" icon={<Img style={{ height: "auto", width: "1.5625em" }} src="/svg/contact.svg" />} desc="Consult Your Business to Discover Online Market Opportunities" cta="Learn more" />
          </Section>
          <div className={`${styles.folder} ${styles.centerLine}`} style={{ zIndex: "1", height: "100%" }}></div>
          <div className={`${styles.folder} ${styles.center}`} style={{ height: "100%" }}></div>
        </Section>
      </Container>
      <Container>
        <Section direction="row" isWrap>
          <Section flex="2" minWidth="21.875em" gap="unset">
            <Section direction="row" gap="unset" zIndex="2">
              <Section flex="1" gap="0.625em">
                <SectionMarker>OVERVIEW</SectionMarker>
                <Section gap="0.3125em">
                  <H1 size="1.5625em" color="inherit" whiteSpace="pre-line">
                    Welcome to Nettacode
                  </H1>
                  <P size="1em" opacity="0.7">
                    An overview of Nettacode benefits.
                  </P>
                </Section>
              </Section>
              <Section flex="1"></Section>
            </Section>
            <Section direction="row" alignItems="center" justifyContent="center" gap="unset" zIndex="2">
              <Section alignItems="flex-start" justifyContent="center" flex="1" zIndex="2" padding="1.875em" gap="0.625em">
                <H1 size="3.125em" color="var(--color-secondary)">
                  97%
                </H1>
                <P>Focus on what is more important to you and be more productive.</P>
              </Section>
              <Img style={{ width: "auto", height: "18.75em", marginRight: "2.8125em", zIndex: "1" }} src="/png/person-2.png" alt="97%" />
            </Section>
            <div className={`${styles.folder} ${styles.sharpLine}`} style={{ zIndex: "1", height: "100%" }}></div>
            <div className={`${styles.folder} ${styles.sharp}`} style={{ height: "100%" }}></div>
          </Section>
          <Section flex="1" minWidth="21.875em" justifyContent="center" alignItems="flex-start" padding="1.875em" backgroundColor="var(--color-primary)" radius="1.5625em">
            <Img style={{ width: "100%", height: "auto", zIndex: "1" }} src="/png/monitor-1.png" alt="97%" />
            <Section gap="0.625em" color="var(--color-foreground)">
              <P color="inherit" size="0.75em" weight="700">
                BENEFITS
              </P>
              <P weight="600" color="inherit" size="1.5625em">
                With Nettacode you save time, money and stress.
              </P>
            </Section>
            <Button variant="line" buttonText="Learn More" radius="full" />
          </Section>
        </Section>
        <Section direction="row" isWrap>
          <Section flex="1" minWidth="21.875em" justifyContent="center" alignItems="flex-start" padding="1.875em" backgroundColor="var(--color-primary)" radius="1.5625em">
            <Section cwidth="3.75em" cheight="3.75em" alignItems="center" justifyContent="center" backgroundColor="var(--color-secondary)" radius="50%">
              <Img style={{ height: "1.5625em", width: "auto" }} src="/svg/spark.svg" />
            </Section>
            <Section gap="0.625em" color="var(--color-foreground)">
              <P color="inherit" size="0.75em" weight="700">
                FEATURE
              </P>
              <P weight="600" color="inherit" size="1.5625em">
                Maximize the return over your investments with our Team.
              </P>
            </Section>
          </Section>
          <Section flex="2" minWidth="21.875em" direction="row" alignItems="flex-end" justifyContent="center" gap="unset" border="0.125em solid var(--color-primary)" backgroundColor="rgba(33, 163, 217, 0.2)" radius="1.5625em" style={{ backdropFilter: "blur(20px)" }}>
            <Section alignItems="flex-start" justifyContent="center" flex="1" zIndex="2" padding="1.875em" gap="0.625em">
              <P color="inherit" size="0.75em" weight="700">
                MOBILE
              </P>
              <P weight="600" size="1.5625em">
                Fast and supreme support 24/7 all year around for your company.
              </P>
            </Section>
            <Img style={{ width: "auto", height: "14.375em", marginTop: "1.25em", marginRight: "2.8125em", zIndex: "1" }} src="/png/mobile.png" alt="Mobile" />
          </Section>
        </Section>
      </Container>
      <Container>
        <Section gap="0.625em">
          <SectionMarker>BENEFITS</SectionMarker>
          <Section gap="0.3125em">
            <H1 size="2.1875em" color="inherit" whiteSpace="pre-line">
              Our Rock and Roll
            </H1>
            <P size="1em" opacity="0.7">
              We bring ideas to life by combining years of
            </P>
          </Section>
        </Section>
        <Section direction="row" isWrap overflow="visible">
          <Section flex="1" minWidth="21.875em" justifyContent="center" alignItems="flex-start" padding="1.875em" gap="0" backgroundColor="var(--color-primary)" radius="1.5625em" overflow="visible">
            <Section alignSelf="center" cwidth="14.375em" cheight="18.75em" alignItems="flex-start" justifyContent="flex-end" overflow="unset">
              <Img style={{ width: "auto", height: "21.875em" }} src="/png/person-3.png" alt="Mobile" />
            </Section>
            <Section gap="0.3125em">
              <Section direction="row" alignItems="center" backgroundColor="var(--color-secondary)" padding="0.9375em 1.25em" radius="1.5625em">
                <Img style={{ height: "2.5em", width: "auto" }} src="/svg/fire.svg" />
                <Section color="var(--color-foreground)" gap="0.3125em">
                  <H1 size="1.125em" color="inherit">
                    Expert Team
                  </H1>
                  <P size="1em" color="inherit">
                    Start free while you learn!
                  </P>
                </Section>
              </Section>
              <Button buttonText="Try Our Services" bgColor="var(--color-secondary)" radius="full" isFullwidth />
            </Section>
          </Section>
          <Section flex="2" minWidth="21.875em" alignItems="flex-start" justifyContent="center">
            <Section padding="1.875em">
              <Section gap="0.625em">
                <H1 size="1.5625em" color="inherit">
                  Seamless Responsiveness Nettacode is fully responsive
                </H1>
                <P opacity="0.7">Request your design for Creatives like you.</P>
                <P opacity="0.7">With its clean layouts, sleek, typography, and engaging animations, this template ensures a memorable user experience.</P>
              </Section>
              <Button buttonText="Try This Plan" radius="full" />
            </Section>
          </Section>
        </Section>
      </Container>
      <Container>
        <Section gap="0.625em">
          <SectionMarker>WORKS</SectionMarker>
          <Section gap="0.3125em">
            <H1 size="2.1875em" color="inherit" whiteSpace="pre-line">
              Portfolios
            </H1>
            <P size="1em" opacity="0.7">
              Take a look at our client! Find our latest works here
            </P>
          </Section>
        </Section>
        <Section>
          <PortfolioCard placement="start" title="UI/UX & Web Development" desc="See how can we help you with our Service" image="/img/uiux-design.jpg" label="UI/UX" />
          <Section direction="row">
            <PortfolioCard flex="1" title="Social Media Strategy for Your Business" desc="See how can we help you with our Service" image="/img/social-marketing.jpg" label="SOCIAL MEDIA" />
            <PortfolioCard flex="1" title="Branding a New Startup" desc="See how can we help you with our Service" image="/img/startup-branding.jpg" label="STARTUP" />
          </Section>
          <PortfolioCard placement="end" title="Branding a Local Business" desc="See how can we help you with our Service" image="/img/local-branding.jpg" label="BUSINESS" />
        </Section>
      </Container>
      <Container direction="row" isWrap isWrapReverse>
        <Section flex="1" alignSelf="center" minWidth="18.75em">
          <Section gap="0.625em">
            <SectionMarker>FEATURES</SectionMarker>
            <Section gap="0.3125em">
              <H1 size="1.5625em" color="inherit" whiteSpace="pre-line">
                With a sleek design Nettacode ensures a memorable user experience.
              </H1>
              <P size="1em" opacity="0.7">
                Your website will look flawless on all devices
              </P>
            </Section>
          </Section>
          <Section gap="0.625em" direction="row">
            <Section gap="0.625em" flex="1">
              <FeatureLi icon="/svg/check.svg" text="No credit card required" />
              <FeatureLi icon="/svg/check.svg" text="Easy customization" />
            </Section>
            <Section gap="0.625em" flex="1">
              <FeatureLi icon="/svg/check.svg" text="Instant access" />
              <FeatureLi icon="/svg/check.svg" text="Fast support" />
            </Section>
          </Section>
        </Section>
        <Section flex="1" radius="1.5625em" minWidth="18.75em">
          <Img src="/img/features.jpg" style={{ position: "relative", width: "100%", height: "auto" }} />
        </Section>
      </Container>
      <Container>
        <Section gap="0.3125em">
          <H1 size="1.5625em" color="inherit" whiteSpace="pre-line">
            Frequently Asked Questions
          </H1>
        </Section>
        <Section gap="0.3125em">
          <FaqCard title="1. Lorem ipsum dolor sit amet, consectetur adipiscing elit." content="Aenean ut lectus dui. Nullam vulputate commodo euismod. In sodales imperdiet nisl vel scelerisque. Duis venenatis fermentum lacinia. Quisque in porta dui, vel dictum odio." />
          <FaqCard title="2. Phasellus ac tellus non neque pellentesque laoreet." content="Aenean ut lectus dui. Nullam vulputate commodo euismod. In sodales imperdiet nisl vel scelerisque. Duis venenatis fermentum lacinia. Quisque in porta dui, vel dictum odio." />
          <FaqCard title="3. Aenean sit amet elit sit amet sem ornare blandit." content="Aenean ut lectus dui. Nullam vulputate commodo euismod. In sodales imperdiet nisl vel scelerisque. Duis venenatis fermentum lacinia. Quisque in porta dui, vel dictum odio." />
          <FaqCard title="4. Quisque in augue id ligula auctor mattis at at diam. Sed at rutrum nisl." content="Aenean ut lectus dui. Nullam vulputate commodo euismod. In sodales imperdiet nisl vel scelerisque. Duis venenatis fermentum lacinia. Quisque in porta dui, vel dictum odio." />
          <FaqCard title="5. Quisque tempus, arcu vel molestie aliquam, augue enim tempor odio, eu malesuada tortor lacus quis nisi." content="Aenean ut lectus dui. Nullam vulputate commodo euismod. In sodales imperdiet nisl vel scelerisque. Duis venenatis fermentum lacinia. Quisque in porta dui, vel dictum odio." />
        </Section>
      </Container>
      <Container direction="row" isWrap>
        <Section flex="1" alignSelf="center" minWidth="18.75em">
          <Section gap="0.625em">
            <SectionMarker>CONTACT</SectionMarker>
            <Section gap="0.3125em">
              <H1 size="1.5625em" color="inherit" whiteSpace="pre-line">
                Get in Touch with Us!
              </H1>
              <P size="1em" opacity="0.7">
                We are waiting for your message
              </P>
            </Section>
          </Section>
          <Section gap="0.625em">
            <ContactLi title="Address" text="Jl. Professor Doktor H. Hadari Nawawi Bansir Darat, Pontianak" icon="/svg/map.svg" />
            <ContactLi title="Phone" text="(+62) 811-569-992" icon="/svg/phone.svg" />
            <ContactLi title="Email" text="nettacodeindonesia@gmail.com" icon="/svg/mail.svg" />
          </Section>
        </Section>
        <Section flex="1" radius="1.5625em" minWidth="18.75em">
          <ContactForm onSubmit={handleSubmit}>
            <Input type="text" label="Your Name" name="name" placeholder="John Doe" radius="full" value={inputData.name} onChange={handleInputChange} errormsg={inputErr.name} required disabled={submitting} />
            <Section direction="row" isWrap gap="0.625em">
              <Input type="tel" label="Phone Number" name="phone" placeholder="0881xxxx" radius="full" value={inputData.phone} onChange={handleInputChange} errormsg={inputErr.phone} required disabled={submitting} />
              <Input type="email" label="Email" name="email" placeholder="example@mail.com" radius="full" value={inputData.email} onChange={handleInputChange} errormsg={inputErr.email} required disabled={submitting} />
            </Section>
            <Textarea label="Your Message" name="message" placeholder="Type your message here ..." radius="full" value={inputData.message} onChange={handleInputChange} errormsg={inputErr.message} required disabled={submitting} />
            <PrimButton icon={<Send />}>Send Message</PrimButton>
          </ContactForm>
        </Section>
      </Container>
      <Container>
        <Section gap="0.3125em">
          <H1 size="1.5625em" color="inherit" whiteSpace="pre-line">
            News & Updates
          </H1>
        </Section>
      </Container>
    </Page>
  );
};

export default HomePage;
