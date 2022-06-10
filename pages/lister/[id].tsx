import type { DBGlose, Glose } from "types/glose";
import type { GloseListe } from "types/gloseListe";
import type { NextPage, GetStaticPropsContext } from "next";

import fetchAPI from "strapi/fetch";
import { MetaSeo } from "types/seo";
import { Button, Card, Rating, Table } from "flowbite-react";
import React from "react";

// TODO - type this
const Page: NextPage<{ page: any; liste: GloseListe }> = ({ page, liste }) => {
  return (
    <div className="relative">
      <div className="hidden md:inline">
        <Rating className=" absolute right-0 mt-3 mr-3 ">
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



        <div className="mt-10 ">
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
                  <Table.Row
                    key={glose.Standard}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {glose.Standard}
                    </Table.Cell>
                    <Table.Cell>{glose.Pinyin}</Table.Cell>
                    <Table.Cell>{glose.Chinese}</Table.Cell>
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
              })}
            </Table.Body>
          </Table>
        </div>

        <div className="flex justify-between my-10 ">
          <Card className="w-1/2">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Lær PĪNYĪN
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Occaecat consectetur proident tempor cupidatat proident sint ipsum elit ad dolor ad id commodo. Ad cillum id proident reprehenderit et veniam. Sit ut quis est cupidatat exercitation eiusmod dolor magna ad est id est mollit. Nostrud sint labore incididunt id dolor non.
            </p>
            <Button>
              Start nå
              <svg
                className="ml-2 -mr-1 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </Card>
   
          <Card className="w-1/2">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Lær HÀNZÌ
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Occaecat consectetur proident tempor cupidatat proident sint ipsum elit ad dolor ad id commodo. Ad cillum id proident reprehenderit et veniam. Sit ut quis est cupidatat exercitation eiusmod dolor magna ad est id est mollit. Nostrud sint labore incididunt id dolor non.
            </p>
            <Button>
              Start nå
              <svg
                className="ml-2 -mr-1 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </Card>

          
        </div>
      </div>

      <div className="mt-10 md:hidden flex justify-center">
        <div className="max-w-sm">
          <Card>
            <div className="mb-4 flex flex-col items-center justify-between">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                {liste.title}
              </h5>
              <h4 className="mt-3 leading-none text-gray-900 dark:text-white">
                Lær {liste.gloser.length} gloser om {liste.title.toLowerCase()}.
              </h4>
            </div>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {liste.gloser.map((glose: Glose) => {
                  return (
                    <li
                      key={glose.Standard}
                      className="py-3 sm:py-4"
                      onClick={() => {}}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {glose.Standard}
                          </p>
                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            {glose.Pinyin}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          {glose.Chinese}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Card>
        </div>
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
