import Head from "next/head";

import type { NextPage } from "next";
import fetchAPI from "strapi/fetch";
import { getStrapiMedia } from "strapi/media";

// TODO - type this
const Home: NextPage = ({ global }: any) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={global.attributes.Favicon} />

        {/* Meta title */}
        <title>{global.attributes.SEO.Title}</title>

        {/* Meta images */}
        <meta property="og:image" content={global.attributes.shareImage} />
        <meta name="twitter:image" content={global.attributes.shareImage} />
        <meta name="image" content={global.attributes.shareImage} />

        {/* Meta description */}
        <meta name="description" content={global.attributes.SEO.Description} />
        <meta property="og:description" content={global.attributes.SEO.Description} />
        <meta name="twitter:description" content={global.attributes.SEO.Description} />
      </Head>
      <div>
        
      </div>
    </>
  );
};

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

export default Home;
