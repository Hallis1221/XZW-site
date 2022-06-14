/* Types */
import type { Glose } from "types/glose";
import type { GloseListe } from "types/gloseListe";
import type { NextPage, GetStaticPropsContext } from "next";
import type { MetaSeo } from "types/seo";
/* FLowbite components */
import { Button } from "flowbite-react";
/* Components */
import { NavArrow } from "components/navArrow";
import { FlashcardWithActions } from "components/flashcardWithActions/component";
/* Hooks */
import { useState } from "react";
import { SwipeEventData, useSwipeable } from "react-swipeable";
import useKeypress from "react-use-keypress";

/* API calls */
import fetchAPI from "strapi/fetch";
import getListe from "src/lib/pages/getListe";
import toast from "react-hot-toast";
import { SwipeableFlashcard } from "src/components/swipeAbleFlashcard";

const Page: NextPage<{ page: any; liste: GloseListe }> = ({ page, liste }) => {
  let [currentCardNumber, setCurrentCard] = useState<number>(0);
  let [cards, setCards] = useState<Glose[]>(liste.gloser);

  const [flipped, setFlipped] = useState<boolean>(false);
  const glose: Glose = cards[currentCardNumber];

  useKeypress(" ", () => setFlipped(!flipped));
  useKeypress("ArrowRight", () => nextCard());
  useKeypress("ArrowLeft", () => lastCard());
  useKeypress("Enter", () => removeCard());

  /*
  return (
    <div
    className="h-96 w-96 bg-blue-200 relative flex justify-center" 
    {...handlers}>
      <div
      className=" w-24 h-24 bg-red-500"
        style={
          swipeData ?
          {
            position: "absolute",
          transform: `translateY(${swipeData?.deltaY }px) translateX(${swipeData?.deltaX }px)`,
          } : 
          {
            backgroundColor: "blue",
          }
        }
      ></div>
    </div>
  );*/

  if (cards.length === currentCardNumber) {
    if (cards.length <= 0)
      return (
        <>
          <div className="h-screen w-full absolute top-0 left-0 -z-50">
            <div
              className="hover:cursor-pointer h-full w-full flex flex-col justify-center text-center"
              onClick={() => {
                setCards(liste.gloser);
                setCurrentCard(0);
              }}
            >
              <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl lg">
                {" "}
                Ingen kort igjen. Trykk hvor som helst for å starte på nytt
              </h1>
            </div>
          </div>
        </>
      );
    setCurrentCard(0);
    return <div>Loading...</div>;
  }

  function nextCard() {
    toast.remove();
    toast.success("Neste kort");
    if (cards.length <= 0) return;

    if (flipped) {
      setFlipped(false);
      setTimeout(() => {
        if (
          currentCardNumber <= cards.length &&
          currentCardNumber !== cards.length - 1
        )
          setCurrentCard(currentCardNumber + 1);
        else if (currentCardNumber === cards.length - 1) setCurrentCard(0);
      }, 400);
    } else if (
      currentCardNumber <= cards.length &&
      currentCardNumber !== cards.length - 1
    )
      setCurrentCard(currentCardNumber + 1);
    else if (currentCardNumber === cards.length - 1) setCurrentCard(0);
  }

  function lastCard() {
    if (cards.length <= 0) return;

    if (flipped) {
      setFlipped(false);
      setTimeout(() => {
        if (currentCardNumber > 0) setCurrentCard(currentCardNumber - 1);
      }, 400);
    } else if (currentCardNumber > 0) setCurrentCard(currentCardNumber - 1);
  }

  function removeCard() {
    if (cards.length <= 0) return;

    if (flipped) {
      setFlipped(false);
      // Remove card from list
      setTimeout(() => {
        setCards(cards.filter((card) => card.Standard !== glose.Standard));
        toast.remove();
        toast.success("Kort fjernet");
      }, 400);
    } else {
      setCards(cards.filter((card) => card.Standard !== glose.Standard));
      toast.remove();
      toast.success("Kort fjernet");
    }
  }

  return (
    <div className="absolute top-0 left-0 h-screen flex flex-col justify-center w-screen -z-50 overflow-hidden">
      <div className="w-screen z-10 mt-20 text-center text-4xl sm:text-5xl font-semibold">
        {currentCardNumber + 1 + "/" + cards.length}
      </div>
      <div className="h-full flex sm:justify-start">
        <NavArrow left onClick={() => lastCard()} />

        <div className="h-full w-full flex flex-col">
          <SwipeableFlashcard
            flipped={flipped}
            glose={glose}
            setFlipped={setFlipped}
            onLeft={() => nextCard()}
            onRight={() => removeCard()}
          />
          <FlashcardWithActions
            desktopButtons={
              <Button
                className="h-24 w-full mx-5 mt-5"
                color="green"
                onClick={() => removeCard()}
              >
                Got it!
              </Button>
            }
            mobileButtons={
              <div className="absolute bottom-0 w-full mx-5 flex justify-center">
                <div className="h-full w-11/12 flex flex-col mb-5">
                  <Button
                    className="inline md:hidden h-24 w-full mb-1"
                    color="green"
                    onClick={() => removeCard()}
                  >
                    Got it!
                  </Button>
                  <Button
                    className="inline md:hidden h-24 w-full mt-1"
                    color="red"
                    onClick={() => removeCard()}
                  >
                    Not yet
                  </Button>
                </div>
              </div>
            }
          />
        </div>

        <NavArrow right onClick={() => nextCard()} />
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
