/* Types */
import type { Glose } from "types/glose";
import type { GloseListe } from "types/gloseListe";
import type { NextPage, GetStaticPropsContext } from "next";
import type { MetaSeo } from "types/seo";
/* FLowbite components */
import { Button } from "flowbite-react";
/* Components */
import { NavArrow } from "src/components/navArrow";
import { Flashcard } from "src/components/flashcard";
import { FlashcardWithActions } from "src/components/flashcardWithActions/component";
/* Hooks */
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import useKeypress from "react-use-keypress";

/* API calls */
import fetchAPI from "strapi/fetch";
import getListe from "src/lib/pages/getListe";

const Page: NextPage<{ page: any; liste: GloseListe }> = ({ page, liste }) => {
  let [currentCardNumber, setCurrentCard] = useState<number>(0);
  let [cards, setCards] = useState<Glose[]>(liste.gloser);

  const [flipped, setFlipped] = useState<boolean>(false);

  const glose: Glose = cards[currentCardNumber];

  useKeypress(" ", () => setFlipped(!flipped));

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setFlipped(false);
      if (currentCardNumber > 0) setCurrentCard(currentCardNumber - 1);
    },
    onSwipedRight: () => {
      setFlipped(false);
      if (
        currentCardNumber <= cards.length &&
        currentCardNumber !== cards.length - 1
      )
        setCurrentCard(currentCardNumber + 1);
      else if (currentCardNumber === cards.length - 1) setCurrentCard(0);
    },
  });

  if (cards.length === currentCardNumber) {
    if (cards.length <= 0) return <div>Ingen kort</div>;
    setCurrentCard(0);
    return <div>Loading...</div>;
  }

  return (
    <div
      className="absolute top-0 left-0 h-screen flex flex-col justify-center w-screen -z-50 overflow-hidden"
      {...handlers}
    >
      <div className="w-screen z-10 mt-20 text-center text-4xl sm:text-5xl font-semibold">
        {currentCardNumber + 1 + "/" + cards.length}
      </div>
      <div className="h-full flex sm:justify-start">
        <NavArrow
          left
          onClick={() => {
            setFlipped(false);
            if (currentCardNumber > 0) setCurrentCard(currentCardNumber - 1);
          }}
        />

        <div className="h-full w-full flex flex-col">
          <Flashcard
            flipped={flipped}
            onClick={() => setFlipped(!flipped)}
            front={glose.Standard}
            back={glose.Chinese}
          />
          <FlashcardWithActions
            desktopButtons={
              <Button
                className="h-24 w-full mx-5 mt-5"
                color="green"
                onClick={() => {
                  setFlipped(false);

                  // Remove card from list
                  setCards(
                    cards.filter((card) => card.Standard !== glose.Standard)
                  );
                }}
              >
                Got it!
              </Button>
            }
            mobileButtons={
              <Button
                className="inline md:hidden h-24 w-full mx-5 mb-5"
                color="green"
                onClick={() => {
                  setFlipped(false);

                  // Remove card from list
                  setCards(
                    cards.filter((card) => card.Standard !== glose.Standard)
                  );
                }}
              >
                Got it!
              </Button>
            }
          />
        </div>

        <NavArrow
          right
          onClick={() => {
            setFlipped(false);
            if (
              currentCardNumber <= cards.length &&
              currentCardNumber !== cards.length - 1
            )
              setCurrentCard(currentCardNumber + 1);
            else if (currentCardNumber === cards.length - 1) setCurrentCard(0);
          }}
        />
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
