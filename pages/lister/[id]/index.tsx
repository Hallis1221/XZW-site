/* Types */
import type { Glose } from "types/glose";
import type { GloseListe } from "types/gloseListe";
import type { NextPage, GetStaticPropsContext } from "next";
import type { MetaSeo } from "types/seo";
/* FLowbite components */
import {  Card, Rating, Table } from "flowbite-react";
/* Hooks */
import {  useState } from "react";
/* API calls */
import fetchAPI from "strapi/fetch";
import getListe from "src/lib/pages/getListe";

const Page: NextPage<{ page: any; liste: GloseListe; id: string }> = ({
  page,
  liste,
  id,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentModalContent, setCurrentModalContent] = useState<Glose | any>();

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

        <div className="flex justify-between my-10  ">
          {/* Next.js Link doesn't work here, so we use an <a> */}
          <a href={`${id}/gjennomgang/flashcards`} className="w-1/2">
            <Card className="hover:shadow-blue-600 mr-10 hover:cursor-pointer">
              <>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Lær PĪNYĪN
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Pinyin (Hanzi: 拼音; pīnyīn) er den offisielle metode i Kina
                  for å transkribere mandarin, og har siden 1950-årene i
                  Folkerepublikken Kina, og siden senest 1980-årene i resten av
                  verden, vært den mest brukte metode for å skrive kinesisk som
                  lydskrift. Systemet ble utviklet av en regjeringsnedsatt
                  komite i 1950-årene, under ledelse av lingvisten Zhou
                  Youguang.
                </p>
              </>
            </Card>
          </a>

          <a href="gjennomgang" className="w-1/2">
            <Card className="hover:shadow-blue-600 ml-10 hover:cursor-pointer">
              <>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Lær HÀNZÌ
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Kinesiske skrifttegn eller Hanzi (tradisjonell kinesisk: 漢字
                  forenklet kinesisk: 汉字, pinyin: Hànzì; Hàn-folkets
                  skrifttegn, også kalt sinogrammer) er et sett på flere tusen
                  fonetisk-piktografiske tegn som brukes for å skrive kinesisk,
                  japansk, koreansk, og også eldre former for vietnamesisk.
                  Tegnsettet er i Taiwan, Korea og Japan kjent som henholdsvis
                  hancha, hanja, og kanji.
                </p>
              </>
            </Card>
          </a>
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
                      onClick={() => {
                        setCurrentModalContent(glose);
                        setModalIsOpen(true);
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
        </div>
        <div
          className={`absolute flex h-full w-full  ${
            modalIsOpen ? "inline" : "hidden"
          } `}
        >
          <div
            className="absolute flex h-full w-full bg-opacity-75 bg-white"
            onClick={() => {
              setModalIsOpen(false);
            }}
          />
          <div className="absolute flex justify-center items-center z-10 w-full">
            <div className="max-w-sm min-w-full w-full ">
              {typeof currentModalContent === "object" ? (
                <Card>
                  <h5 className="text-2xl font-bold tracking-tight  text-gray-900 dark:text-white">
                    {currentModalContent?.Standard}
                  </h5>
                  <p className="font-normal tracking-widest text-gray-700 dark:text-gray-400">
                    {currentModalContent?.Pinyin}
                  </p>
                  <p className="font-normal tracking-widest text-gray-700 dark:text-gray-400">
                    {currentModalContent?.Chinese.split("").map(
                      (letter: string, index: number) => {
                        return (
                          <span
                            key={index}
                            className="inline-block m-2 hover:underline hover:text-blue-600"
                          >
                            {letter}
                          </span>
                        );
                      }
                    )}
                  </p>
                </Card>
              ) : null}
            </div>
          </div>
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
