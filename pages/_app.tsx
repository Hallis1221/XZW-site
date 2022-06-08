import "../styles/globals.css";
import type { AppProps } from "next/app";
import fetchAPI from "strapi/fetch";
import Head from "next/head";
import { getStrapiMedia } from "strapi/media";
import GlobalContext from "context/global";

function MyApp({ Component, pageProps }: AppProps) {
  const { global } = pageProps;
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          href={getStrapiMedia(global.attributes.Favicon)}
        />

        {/* Meta title */}
        <title>{global.attributes.SEO.Title}</title>

        {/* Meta images */}
        <meta
          property="og:image"
          content={getStrapiMedia(global.attributes.SEO.ShareImage)}
        />
        <meta
          name="twitter:image"
          content={getStrapiMedia(global.attributes.SEO.ShareImage)}
        />
        <meta
          name="image"
          content={getStrapiMedia(global.attributes.SEO.ShareImage)}
        />

        {/* Meta description */}
        <meta name="description" content={global.attributes.SEO.Description} />
        <meta
          property="og:description"
          content={global.attributes.SEO.Description}
        />
        <meta
          name="twitter:description"
          content={global.attributes.SEO.Description}
        />
      </Head>
      
      <GlobalContext.Provider value={global.attributes}>
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </>
  );
}

export async function getStaticProps() {
  const res = await fetchAPI("/global", {
    populate: {
      Favicon: "*",
      SEO: {
        populate: "*",
      },
    },
  });

  return {
    props: {
      global: res.data,
    },
    // TODO, make revalidation strapi dynamic
    revalidate: 1,
  };
}

export default MyApp;
