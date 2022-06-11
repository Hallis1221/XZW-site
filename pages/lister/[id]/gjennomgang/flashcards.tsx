import type { GetStaticPropsContext, NextPage } from "next";
import type { GloseListe } from "types/gloseListe";
import type { Glose } from "types/glose";
import type { MetaSeo } from "types/seo";

import { Card } from "flowbite-react";

import fetchAPI from "strapi/fetch";
import getListe from "src/lib/pages/getListe";

const Page: NextPage<{ page: any; liste: GloseListe }> = ({ page, liste }) => {
  
    return (
        <Card>
            <h1>{page.title}</h1>
        </Card>
    )
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
    // TODO: switch to /lister/flashcard
    const res = await fetchAPI("/lister", {
      populate: {
        SEO: {
          populate: "*",
        },
      },
    });
  
    let {liste } = await getListe({ id: ctx.params?.id?.toString() });
  
    if (!liste) return { notFound: true };
  
    res.data.attributes.seo = {
      metaTitle: liste.title,
      metaDescription: liste.description,
      keywords: liste.gloser.map((glose: Glose) => glose.Standard).toString(),
    } as MetaSeo;
  
    return {
      props: {
        id: ctx.params?.id || null,
        liste: {
          title: liste.title,
          description: liste.description,
          gloser: liste.gloser,
        },
        page: res.data,
      },
    };
  }

export async function getStaticPaths() {
    const gloserRes = await fetchAPI("/glose-listes");
    gloserRes.attributes = undefined;
  
    let paths: { params: { id: string } }[] = [];
  
    gloserRes.data.forEach(
      (element: {
        id: number;
        attributes: {
          Title: string;
        };
      }) => {
        paths.push({
          params: {
            id: `${element.attributes.Title}-${element.id}`,
          },
        });
      }
    );
    return {
      paths,
      fallback: "blocking",
    };
  }

  export default Page;