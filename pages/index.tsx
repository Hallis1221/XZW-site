import Head from "next/head";

import type { NextPage } from "next";
import fetchAPI from "strapi/fetch";
import { getStrapiMedia } from "strapi/media";
import getGlobal from "strapi/global";
import { Seo } from "../components/seo";

// TODO - type this
const Home: NextPage = ({ home }: any) => {
  return (
    <>
      <Seo
        pageSeo={{
          title: home.attributes.SEO.Title,
        }}
      ></Seo>
    </>
  );
};

export async function getStaticProps() {
  const res = await fetchAPI("/home", {
    populate: {
      SEO: {
        populate: "*",
      },
    },
  });

  return {
    props: {
      global: await getGlobal(),
      home: res.data,
    },
    // TODO, make revalidation strapi dynamic
    revalidate: 1,
  };
}

export default Home;
