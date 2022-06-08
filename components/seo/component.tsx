import { useContext } from "react";
import { FunctionComponent } from "react";
import { SeoProps } from "./props";
import GlobalContext from "context/global";
import { getStrapiMedia } from "strapi/media";
import Head from "next/head";

const Seo: FunctionComponent<SeoProps> = ({ pageSeo }) => {
  const { SEO, siteName } = useContext(GlobalContext) as any;

  const fullSeo = {
    ...SEO,
    ...pageSeo,
    metaTitle: `${SEO.Title} | ${siteName}`,
    shareImage: getStrapiMedia(SEO.ShareImage),
  };
  return (
    <Head>
      {fullSeo.metaTitle && (
        <>
          <title>{fullSeo.metaTitle}</title>
          <meta property="og:title" content={fullSeo.metaTitle} />
          <meta name="twitter:title" content={fullSeo.metaTitle} />
        </>
      )}
      {fullSeo.metaDescription && (
        <>
          <meta name="description" content={fullSeo.metaDescription} />
          <meta property="og:description" content={fullSeo.metaDescription} />
          <meta name="twitter:description" content={fullSeo.metaDescription} />
        </>
      )}
      {fullSeo.shareImage && (
        <>
          <meta property="og:image" content={fullSeo.shareImage} />
          <meta name="twitter:image" content={fullSeo.shareImage} />
          <meta name="image" content={fullSeo.shareImage} />
        </>
      )}
      {fullSeo.article && <meta property="og:type" content="article" />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default Seo;
