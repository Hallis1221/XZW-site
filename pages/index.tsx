/* Import types */
import type { NextPage } from "next";
/* Import API calls */
import fetchAPI from "strapi/fetch";

// TODO - type this
const Home: NextPage = ({ home }: any) => {
  return (
    <>
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

