import type { NextPage } from "next";
import fetchAPI from "strapi/fetch";
import getGlobal from "strapi/global";
import { Seo } from "components/seo";

// TODO - type this
const Home: NextPage = ({ home }: any) => {
  return (
    <>
      <Seo
        pageSeo={{
          title: home.attributes.SEO.Title,
        }}
      ></Seo>

      <div>
      </div>
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
      home: res.data,
    },
    // TODO, make revalidation strapi dynamic?
    revalidate: 60 * 30, // In seconds, here it is 30 minutes
  };
}

export default Home;


/*

import type { NextPage } from "next";
import fetchAPI from "strapi/fetch";
import getGlobal from "strapi/global";
import { Seo } from "components/seo";

// TODO - type this
const Page: NextPage = ({ page }: any) => {
  return (
    <>
      <Seo
        pageSeo={{
          title: page.attributes.SEO.Title,
        }}
      ></Seo>

      <div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const res = await fetchAPI("/page", {
    populate: {
      SEO: {
        populate: "*",
      },
    },
  });

  return {
    props: {
      page: res.data,
    },
    // TODO, make revalidation strapi dynamic
    revalidate: 3000,
  };
}

export default Page;

*/
