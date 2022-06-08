import fetchAPI from "./fetch";

async function getGlobal() {
  const res = await fetchAPI("/global", {
    populate: {
      Favicon: "*",
      SEO: {
        populate: "*",
      },
    },
  });

  return res.data;
}

export default getGlobal;
