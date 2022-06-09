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

      <div></div>
    </>
  );
};

export async function getStaticProps() {
  const res = await fetchAPI("/lister", {
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
    // TODO, make revalidation strapi dynamic?
    revalidate: 60 * 30, // In seconds, here it is 30 minutes
  };
}

export default Page;
