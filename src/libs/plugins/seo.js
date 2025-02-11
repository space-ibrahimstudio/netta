import React from "react";
import { Helmet } from "react-helmet-async";
import { stripHtml } from "./helpers";

const sitename = process.env.REACT_APP_SITENAME;
const domain = process.env.REACT_APP_DOMAIN;
const author = process.env.REACT_APP_AUTHOR;

function SEO({ title, description, route, type, imageSrc, imageWidth = "920", imageHeight = "470", imageAlt, canonical, isNoIndex = false }) {
  const metatitle = `${title} | ${sitename}`;
  const metadesc = (description && stripHtml(description).substring(0, 160)) || "";
  const metaimage_alt = imageAlt || metadesc;
  const metarobots = isNoIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const metacanon = canonical || `${domain}${route}`;

  return (
    <Helmet>
      <title>{metatitle}</title>
      <meta property="og:title" content={metatitle} />
      <meta property="og:description" content={metadesc} />
      <meta property="og:image" content={imageSrc} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:image:alt" content={metaimage_alt} />
      <meta property="og:url" content={`${domain}${route}`} />
      <meta property="og:type" content={type} />
      <meta name="description" content={metadesc} />
      <meta name="twitter:title" content={metatitle} />
      <meta name="twitter:description" content={metadesc} />
      <meta name="twitter:image" content={imageSrc} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="author" content={author} />
      <meta name="robots" content={metarobots} />
      <link rel="canonical" href={metacanon} />
    </Helmet>
  );
}

export default SEO;
