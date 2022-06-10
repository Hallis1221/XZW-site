import type { DBGlose, Glose } from "types/glose";
import type { GloseListe } from "types/gloseListe";
import type { NextPage, GetStaticPropsContext } from "next";

import fetchAPI from "strapi/fetch";
import { MetaSeo } from "types/seo";
import { Rating, Table } from "flowbite-react";

// TODO - type this
const Page: NextPage<{ page: any; liste: GloseListe }> = ({ page, liste }) => {
  return (
    <div className="relative">
      <Rating className="hidden md:inline-flex absolute right-0 mt-3 mr-3 ">
        <Rating.Star />
        <Rating.Star />
        <Rating.Star />
        <Rating.Star />
        <Rating.Star filled={false} />
      </Rating>

      <div className="flex flex-row justify-center">
        <h1 className="text-center text-5xl font-semibold  tracking-wide text-gray-900 dark:text-white">
          {liste.title}
        </h1>
      </div>

      <div className="w-full flex justify-center mt-4 text">
        <p className="w-10/12 font-normal text-gray-700 dark:text-gray-400">
          {liste.description.substring(0, 500)}
          {liste.description.length > 500 ? "..." : ""}
        </p>
      </div>

      <div className="mt-10">
        <Table>
          <Table.Head>
            <Table.HeadCell>Norsk</Table.HeadCell>
            <Table.HeadCell>Pīnyīn</Table.HeadCell>
            <Table.HeadCell>Hànzì</Table.HeadCell>
            <Table.HeadCell>
              <div className="sr-only">Stroke-order</div>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {liste.gloser.map((glose: Glose) => {
                return (
                    <Table.Row key={glose.Standard} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {glose.Standard}
                    </Table.Cell>
                    <Table.Cell>
                        {glose.Pinyin}
                    </Table.Cell>
                    <Table.Cell>
                        {glose.Chinese}
                    </Table.Cell>
                    <Table.Cell>
                      <div
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500 cursor-pointer"
                        onClick={() => {}}
                      >
                        Stroke-order
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
                }
            )}
           
          </Table.Body>
        </Table>
      </div>
    </div>
  );
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
  liste.Gloser = liste.Gloser.filter((glose: DBGlose) => {
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
    // TODO
  return {
    paths: [{ params: { id: "tid-1" } }, { params: { id: "tid-2" } }, { params: { id: "tid-3" } }, { params: { id: "tid-4" } }],
    fallback: "blocking",
  };
}

export default Page;
