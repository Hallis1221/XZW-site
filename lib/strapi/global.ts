import fetchAPI from "./fetch";

async function getGlobal() {
  const res = await fetchAPI("/global", {
    populate: {
      Favicon: "*",
      ActionButton: {
        populate: "*"
      },
      SEO: {
        populate: "*",
      },
      Pages: {
        populate: "*",
      },
    },
  });

  return res?.data;
}

export default getGlobal;
