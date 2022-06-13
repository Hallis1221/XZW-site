/* Types */
import type { Glose } from "types/glose";
import type { GloseListe } from "types/gloseListe";
import type { NextPage, GetStaticPropsContext } from "next";
import type { MetaSeo } from "types/seo";
/* FLowbite components */
import { Button, Card } from "flowbite-react";
/* Hooks */
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
/* API calls */
import fetchAPI from "strapi/fetch";
import getListe from "src/lib/pages/getListe";
import {
  ArrowCircleLeftIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/solid";

const Page: NextPage<{ page: any; liste: GloseListe }> = ({ page, liste }) => {
  let [currentCardNumber, setCurrentCard] = useState<number>(0);
  let [cards, setCards] = useState<Glose[]>(liste.gloser);

  const glose: Glose = cards[currentCardNumber];

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentCardNumber > 0) setCurrentCard(currentCardNumber - 1);
    },
    onSwipedRight: () => {
      if (currentCardNumber < cards.length - 1)
        setCurrentCard(currentCardNumber + 1);
    },
  });

  if (cards.length === currentCardNumber) {
    if (cards.length <= 0) return <div>Ingen kort</div>;
    setCurrentCard(0);
    return <div>Loading...</div>;
  }

  return (
    <div
      className="absolute top-0 left-0 h-screen flex flex-col justify-center w-screen -z-50"
      {...handlers}
    >
      <div className="w-screen z-10 mt-20 text-center text-4xl sm:text-5xl font-semibold">
        {currentCardNumber + 1 + "/" + cards.length}
      </div>
      <div className="h-full flex sm:justify-start">
        <div
          className="bg-transparent w-1/6 hidden sm:flex justify-center"
          onClick={() => {
            if (currentCardNumber > 0) setCurrentCard(currentCardNumber - 1);
          }}
        >
          <div className="h-full flex flex-col justify-center">
            <ArrowLeftIcon className="h-24 mb-24" />
          </div>
        </div>

        <div className="h-full w-full flex flex-col">
          <div className="relative h-full flex justify-center w-full">
            <Card
              key={cards[currentCardNumber].Standard}
              className={` w-5/6 h-2/6 mt-[25%] sm:mt-[5%] sm:h-3/4 md:w-3/4 xl:mt-10  ${
                currentCardNumber === cards.indexOf(glose) ? "inline" : "hidden"
              }`}
            >
              <div className="flex flex-col justify-center items-center">
                <h1 className="m-24 text-center  w-full text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-semibold  tracking-wide text-gray-900 dark:text-white">
                  {glose.Standard}
                </h1>
              </div>
            </Card>
          </div>
          <div className="w-full flex justify-center">
            <div className="absolute bottom-0 h-1/6 w-full ">
              <div className="flex justify-evenly h-full mx-[21%]">
                <div className="flex justify-between w-full">
                  <Button
                    className="h-24 w-64 mx-5 mt-5"
                    color="green"
                    onClick={() => {
                      // Remove card from list
                      setCards(
                        cards.filter((card) => card.Standard !== glose.Standard)
                      );
                    }}
                  >
                    Got it!
                  </Button>
                  <Button className="h-24 w-64 mx-5 mt-5" color="red" onClick={
                    () => {
                      if (
                        currentCardNumber <= cards.length &&
                        currentCardNumber !== cards.length - 1
                      )
                        setCurrentCard(currentCardNumber + 1);
                    }
                  }>
                    Not yet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-transparent w-1/6 hidden sm:flex justify-center"
          onClick={() => {
            if (
              currentCardNumber <= cards.length &&
              currentCardNumber !== cards.length - 1
            )
              setCurrentCard(currentCardNumber + 1);
          }}
        >
          <div className="h-full flex flex-col justify-center">
            <ArrowRightIcon className="h-24 mb-24" />
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
