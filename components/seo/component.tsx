import { useContext } from "react";
import { FunctionComponent } from "react";
import { SeoProps } from "./props";
import GlobalContext from "context/global";
import { getStrapiMedia } from "strapi/media";
import Head from "next/head";
import { MetaSeo, MetaSocial } from "types/seo";

export const Seo: FunctionComponent<SeoProps> = ({ pageSeo, global }) => {
  const seo: MetaSeo = {
    ...global.seo,
    ...pageSeo,
    metaTitle:
      pageSeo.metaTitle || global.seo.metaTitle 
        ? `${pageSeo.metaTitle || global.seo.metaTitle} | ${global.Sitename}`
        : global.Sitename,
    metaImage:
      pageSeo.metaImage || global.seo.metaImage
        ? getStrapiMedia(pageSeo.metaImage || global.seo.metaImage)
        : null,
  };

  let metaTwitter: MetaSocial | undefined;
  let metaFacebook: MetaSocial | undefined;

  seo?.metaSocial?.forEach((element) => {
    if (element.socialNetwork == "Twitter") metaTwitter = element;
    if (element.socialNetwork == "Facebook") metaFacebook = element;
  });

  return (
    <Head>
      {/* Title tags */}
      <>
        <title>{seo.metaTitle || "" }</title>
        <meta name="title" content={seo.metaTitle || ""} />
        <meta property="og:title" content={seo.metaTitle || ""} />
        <meta name="twitter:title" content={seo.metaTitle || ""} />
      </>

      {/* Description tags */}
      <>
        <meta name="description" content={seo.metaDescription} />
        <meta property="og:description" content={seo.metaDescription} />
        <meta name="twitter:description" content={seo.metaDescription} />
      </>

      {/* Image tags */}
      <>
        <meta
          property="og:image"
          content={seo.metaImage ? getStrapiMedia(seo.metaImage) : ""}
        />
        <meta property="og:image:alt" content={seo.metaTitle || ""} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </>

      {/* Canonical tags */}
      <>
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:url" content={seo.canonical} />
      </>

      {/* OpenGraph tags */}
      <>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={global.Sitename} />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:locale:alternate" content="en_US" />
      </>

      {/* Icon tags */}
      <>
        <link rel="icon" href={getStrapiMedia(global.Favicon)} />
        <link rel="apple-touch-icon" href={getStrapiMedia(global.Favicon)} />
        <link rel="shortcut icon" href={getStrapiMedia(global.Favicon)} />
      </>

      {/* Twitter tags */}
      {metaTwitter && (
        <>
          {metaTwitter.image ? (
            <>
              <meta name="twitter:card" content="summary_large_image" />
              <meta
                name="twitter:image"
                content={getStrapiMedia(metaTwitter.image)}
              />
            </>
          ) : (
            <>
              <meta name="twitter:card" content="summary" />
            </>
          )}

          <meta name="twitter:creator" content="@justhallis" />
          <meta name="twitter:site" content={global.Sitename} />
          <meta name="twitter:title" content={metaTwitter.title} />
          <meta name="twitter:description" content={metaTwitter.description} />
        </>
      )}

      {/* Facebook tags */}
    </Head>
  );
};
