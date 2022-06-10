import type { Glose } from "types/glose";
import type { GloseListe } from "types/gloseListe";
import type { NextPage, GetStaticPropsContext } from "next";

import fetchAPI from "strapi/fetch";
import { MetaSeo } from "types/seo";

// TODO - type this
const Page: NextPage<{ page: any; liste: GloseListe }> = ({ page, liste }) => {
  return (
    <>
    <div>
        {liste.title}
    </div>
    </>
  )
};

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const res = await fetchAPI("/lister", {
    populate: {
      SEO: {
        populate: "*",
      },
    },
  });

  const listeID: string | undefined = ctx.params?.id?.toString().split("-")[1];
  let liste = await fetchAPI(`/glose-listes/${listeID}`, {
    populate: {
      Title: "*",
      Description: "*",
      Gloser: {
        populate: "*",
      },
    },
  }).then((res) => res.data.attributes);

  res.data.attributes.seo = {
    metaTitle: liste.Title,
    metaDescription: liste.Description,
    keywords: liste.Gloser.map((glose: Glose) => glose.Standard).toString(),
  } as MetaSeo;

  // Remove each glose where Aktiv is false or undefined
  liste.Gloser = liste.Gloser.filter((glose: Glose) => {
    return glose.Aktiv === true;
  });

  return {
    props: {
      liste: {
        title: liste.Title,
        description: liste.Description,
        gloser: liste.Gloser,
      },
      page: res.data,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "1" } }],
    fallback: "blocking",
  };
}

export default Page;
