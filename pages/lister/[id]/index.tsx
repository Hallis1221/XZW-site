/* Types */
import type { Glose } from "types/glose";
import type { GloseListe } from "types/gloseListe";
import type { NextPage, GetStaticPropsContext } from "next";
import type { MetaSeo } from "types/seo";
/* FLowbite components */
import { Card, Rating, Table } from "flowbite-react";
/* Hooks */
import { MutableRefObject, useState, useRef, SetStateAction } from "react";
/* API calls */
import fetchAPI from "strapi/fetch";
import getListe from "src/lib/pages/getListe";
import { GloseDetailsPopup } from "src/components/glose/details";

const Page: NextPage<{ page: any; liste: GloseListe; id: string }> = ({
  page,
  liste,
  id,
}) => {
  const [currentModalContent, setCurrentModalContent] = useState<Glose | any>();

  const hanziRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  const hanziQuizRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

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
              <Table.HeadCell>
                {page.attributes.Standard || "Norsk"}
              </Table.HeadCell>
              <Table.HeadCell>
                {page.attributes.Pinyin || "Pīnyīn"}
              </Table.HeadCell>
              <Table.HeadCell>
                {page.attributes.Hanzi || "Hànzì"}
              </Table.HeadCell>
              <Table.HeadCell>
                <div className="sr-only">
                  {page.attributes.Details || "Se mer"}
                </div>
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
                        onClick={() => {
                          setCurrentModalContent(glose);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {page.attributes.Details || "Se mer"}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>

        <div className="my-10 w-full">
          {/* Next.js Link doesn't work here, so we use an <a> */}
          <a
            href={`${id.replace(["http", "https", "/", "://"], "")}/spill`}
            className="w-full flex justify-center"
          >
            <Card className="hover:shadow-blue-600 hover:cursor-pointer">
              <>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {page.attributes.ActionCard.title || "Start å lære"}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {page.attributes.ActionCard.Description ||
                    "Lær hva du skal gjøre"}
                </p>
              </>
            </Card>
          </a>
        </div>
        <div
          className={`absolute flex top-0 h-full w-full ${
            currentModalContent ? "z-10 " : " -z-10"
          } 
      `}
        >
          <div className="relative flex justify-self-center w-full">
            <GloseDetailsPopup
              currentModalContent={currentModalContent}
              setCurrentModalContent={setCurrentModalContent}
              hanziQuizRef={hanziQuizRef}
              hanziRef={hanziRef}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 md:hidden md:-z-50  flex justify-center ">
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
                      className="py-3 sm:py-4 hover:cursor-pointer"
                      onClick={() => {
                        setCurrentModalContent(glose);
                        window.scrollTo(0, 0);
                      }}
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
          <div className="my-10 w-full">
            {/* Next.js Link doesn't work here, so we use an <a> */}
            <a
              href={`${id.replace(["http", "https", "/", "://"], "")}/spill`}
              className="w-full flex justify-center"
            >
              <Card className="hover:shadow-blue-600 hover:cursor-pointer w-full text-center">
                <>
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {page.attributes.ActionCard.title || "Start å lære"}
                  </h5>
                </>
              </Card>
            </a>
          </div>
        </div>
        <GloseDetailsPopup
          currentModalContent={currentModalContent}
          setCurrentModalContent={setCurrentModalContent}
          hanziQuizRef={hanziQuizRef}
          hanziRef={hanziRef}
        />
      </div>
    </div>
  );
};

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const res = await fetchAPI("/liste", {
    populate: {
      ActionCard: {
        populate: "*",
      },
      SEO: {
        populate: "*",
      },
    },
  });

  let { liste } = await getListe({ id: ctx.params?.id?.toString() });

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
      revalidate: 60 * 5,
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
