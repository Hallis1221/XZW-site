/* Types */
import type { Glose } from "types/glose";
import type { GloseListe } from "types/gloseListe";
import type { NextPage, GetStaticPropsContext } from "next";
import type { MetaSeo } from "types/seo";
/* FLowbite components */
import { Card } from "flowbite-react";
/* Hooks */
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
/* API calls */
import fetchAPI from "strapi/fetch";
import getListe from "src/lib/pages/getListe";
import { ArrowCircleLeftIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";

const Page: NextPage<{ page: any; liste: GloseListe }> = ({ page, liste }) => {
  let [currentCardNumber, setCurrentCard] = useState<number>(0);

  const glose: Glose = liste.gloser[currentCardNumber];

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentCardNumber > 0) setCurrentCard(currentCardNumber - 1);
    },
    onSwipedRight: () => {
      if (currentCardNumber < liste.gloser.length - 1)
        setCurrentCard(currentCardNumber + 1);
    },
  });

  return (
    <div
      className="absolute top-0 left-0 h-screen flex flex-col justify-center w-screen -z-50"
      {...handlers}
    >
      <div className="w-screen z-10 mt-20 text-center text-4xl sm:text-5xl font-semibold">
        {currentCardNumber + 1 + "/" + liste.gloser.length}
      </div>
      <div className="h-full flex justify-center sm:justify-start">
        <div
          className="bg-transparent w-1/6 hidden sm:flex justify-center"
          onClick={() => {
            if (currentCardNumber > 0) setCurrentCard(currentCardNumber - 1);
          }}
        
        >
              <div className="h-full flex flex-col justify-center">
          <ArrowLeftIcon className="h-24 mb-24"/>
          </div>
        </div>

        <Card
          key={liste.gloser[currentCardNumber].Standard}
          className={`relative w-5/6 h-2/6 mt-[25%] sm:mt-[5%] sm:h-3/4 md:w-3/4 xl:mt-10  ${
            currentCardNumber === liste.gloser.indexOf(glose)
              ? "inline"
              : "hidden"
          }`}
        >
          <div className="flex flex-col justify-center items-center">
            <h1 className="m-24 text-center  w-full text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-semibold  tracking-wide text-gray-900 dark:text-white">
              {glose.Standard}
            </h1>
          </div>
        </Card>

        <div
          className="bg-transparent w-1/6 hidden sm:flex justify-center"
          onClick={() => {
            if (
              currentCardNumber <= liste.gloser.length &&
              currentCardNumber !== liste.gloser.length - 1
            )
              setCurrentCard(currentCardNumber + 1);
          }}
         
        >
          <div className="h-full flex flex-col justify-center">
          <ArrowRightIcon className="h-24 mb-24"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps(ctx: GetStaticPropsContext) {
  // TODO: switch to /lister/flashcard
  const res = await fetchAPI("/lister", {
    populate: {
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
