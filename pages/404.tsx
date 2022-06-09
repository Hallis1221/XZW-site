import getGlobal from "strapi/global";

export default function Custom404() {
  return <h1>404 - Page Not Found</h1>;
}

export async function getStaticProps() {
  return {
    props: {
      global: await getGlobal(),
    },
    // TODO, make revalidation strapi dynamic
    revalidate: 3000,
  };
}
