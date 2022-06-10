import type { NextPage } from "next";
import fetchAPI from "strapi/fetch";
import getGlobal from "strapi/global";
import { Seo } from "components/seo";

// TODO - type this
const Home: NextPage = ({ home }: any) => {
  return (
    <>
    

      <div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const res = await fetchAPI("/home", {
    populate: {
      seo: {
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

export default Home;

