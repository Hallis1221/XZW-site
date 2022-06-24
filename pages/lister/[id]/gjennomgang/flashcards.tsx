/* Types */
import type { Glose } from "types/glose";
import type { GloseListe } from "types/gloseListe";
import type { NextPage, GetStaticPropsContext } from "next";
import type { MetaSeo } from "types/seo";
import type { Card } from "types/card";
/* FLowbite components */
import { Button, Card as FRCard, Table } from "flowbite-react";
/* Components */
import { NavArrow } from "components/navArrow";
import { FlashcardWithActions } from "src/components/flashcard/withactions/component";
import { CardSettings } from "src/components/flashcard/settings";
/* Hooks */
import { useEffect, useRef, useState } from "react";
import useKeypress from "react-use-keypress";

/* API calls */
import fetchAPI from "strapi/fetch";
import getListe from "src/lib/pages/getListe";
import toast from "react-hot-toast";
import { SwipeableFlashcard } from "src/components/flashcard/swipeable";
import { CardSide } from "types/cardSide";
import { shuffle } from "src/lib/shuffle";
import { useStopwatch } from "react-timer-hook";
import { PrintCards } from "src/components/flashcard/print/component";
import { useSession } from "next-auth/react";
import md5 from "md5";
import ReactToPrint from "react-to-print";

// TODO use strapi texts

const Page: NextPage<{
  page: any;
  liste: GloseListe;
  id: string;
  scores: UserScore[];
}> = ({ page, liste, id, scores }) => {
  console.log(scores);
  const { data: session } = useSession();

  let [currentCardNumber, setCurrentCardNumber] = useState<number>(0);
  let [cards, setCards] = useState<Glose[]>(liste.gloser);
  let [frontSide, setFrontSide] = useState<CardSide>("standard");
  let [backSide, setBackSide] = useState<CardSide>("pinyin_hanzi");
  let [glose, setGlose] = useState<Glose>(cards[currentCardNumber]);
  let [dbSynced, setDbSynced] = useState<boolean>(false);

  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: true });

  const printRef = useRef<HTMLDivElement>(null);

  const [flipped, setFlipped] = useState<boolean>(false);
  const [card, setCard] = useState<Card>({
    front: glose?.Standard || "",
    back: glose?.Chinese || "",
  });

  useEffect(() => {
    if (cards.length > 0) setGlose(cards[currentCardNumber]);
  }, [currentCardNumber, cards]);
  useEffect(() => {
    if (glose)
      setCard({
        front:
          frontSide == "hanzi"
            ? glose.Chinese
            : frontSide == "pinyin"
            ? glose.Pinyin
            : frontSide == "standard"
            ? glose.Standard
            : glose.Pinyin + " (" + glose.Chinese + ")",
        back:
          backSide == "hanzi"
            ? glose.Chinese
            : backSide == "pinyin"
            ? glose.Pinyin
            : backSide == "standard"
            ? glose.Standard
            : glose.Pinyin + " (" + glose.Chinese + ")",
      });
  }, [frontSide, backSide, glose, cards.length]);

  useEffect(() => {
    if (!isRunning && cards.length > 0) {
      console.log("Starting timer");
      start();
    }
  }, [isRunning, start, cards.length]);

  useKeypress(" ", () => setFlipped(!flipped));
  useKeypress("ArrowRight", () => nextCard());
  useKeypress("ArrowLeft", () => lastCard());
  useKeypress("Enter", () => removeCard());

  if (
    cards.length === currentCardNumber ||
    card.back === "" ||
    card.front === ""
  ) {
    if (cards.length <= 0) {
      if (isRunning) pause();
      if (!dbSynced) {
        let time = ((days * 24 + hours) * 60 + minutes) * 60 + seconds;
        console.log(dbSynced);
        if (session)
          toast.promise(
            fetch("/api/scores/flashcards", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                gameID: id,
                time: time.toFixed(0),
                session: md5(
                  JSON.stringify(session + time.toFixed(0).toString())
                ),
              }),
            }).then(async (res) => {
              toast.remove();
              if (res.status !== 201)
                throw new Error(
                  "Prøv igjen! Highscoren din er " +
                    (await res.json()).highScore +
                    " sekund(er)."
                );
              else return "Ny highscore!";
            }),
            {
              loading: "Lagrer...",
              success: (data) => `${data}`,
              error: (error) => `${error}`,
            },
            {
              style: {
                minWidth: "250px",
              },
            }
          );
        else {
          toast.remove();
          toast.custom("Logg inn for å lagre beste tid!", {});
        }
        setDbSynced(true);
      }
      return (
        <>
          <div className="h-screen w-full absolute top-0 left-0 -z-50 justify-center">
            <div
              className="hover:cursor-pointer h-full w-full flex flex-col justify-center text-center"
              onClick={() => {
                setDbSynced(false);
                setCards(liste.gloser);
                reset();
                setCurrentCardNumber(0);
              }}
            >
              <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl">
                {page.attributes.OutOfCards ||
                  "Ingen flere kort. Trykk hvorsomhelst for å starte på nytt."}
              </h1>
              <h2 className="mt-5 text-xl sm:text-2xl md:text-3xl ">
                Tiden din var;{" "}
                <span className="inline font-medium">
                  {days > 0
                    ? `${days} dager, ${hours} timer, ${minutes} minutter og ${seconds} sekunder`
                    : hours > 0
                    ? `${hours} timer, ${minutes} minutter og ${seconds} sekunder`
                    : minutes > 0
                    ? `${minutes} minutter og ${seconds} sekunder`
                    : seconds > 0
                    ? `${seconds} sekunder`
                    : "0 sekunder"}
                </span>
              </h2>
              <div className="flex flex-row justify-center">
                <div className="mt-10 w-2/4 ">
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Spiller</Table.HeadCell>
                      <Table.HeadCell>Tid</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {scores?.map((score: UserScore) => (
                        <Table.Row
                          key={score.id + score.name + score.tid}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {score.name}
                          </Table.Cell>
                          <Table.Cell>{score.tid}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    setCurrentCardNumber(0);
    return <div>Loading...</div>;
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
            card={card}
            setFlipped={setFlipped}
            onLeft={() => nextCard()}
            onRight={() => removeCard()}
          />

          <div className="hidden">
            <PrintCards
              printRef={printRef}
              liste={liste}
              frontSide={frontSide}
              backSide={backSide}
            />
          </div>
          <FlashcardWithActions
            desktopButtons={
              <div className="w-full mx-2 mt-5">
                <CardSettings
                  isAbove
                  printRef={printRef}
                  page={page}
                  setFront={setFrontSide}
                  setBack={setBackSide}
                  shuffleCards={() => {
                    setCards(shuffle(cards));
                    setGlose(cards[currentCardNumber]);
                    setCurrentCardNumber(currentCardNumber);
                    toast.remove();
                    toast.success(
                      page.attributes.CardsShuffled || "Kortete ble stokket"
                    );
                  }}
                />
                <Button
                  className="h-24 w-full mb-2"
                  color="green"
                  onClick={() => removeCard()}
                >
                  {page.attributes.Success || "Klarte det!"}
                </Button>
              </div>
            }
            mobileButtons={
              <div className="flex md:hidden absolute bottom-0 w-full mx-5 justify-center">
                <div className="h-full w-11/12 flex flex-col mb-5">
                  <CardSettings
                    isAbove
                    printRef={printRef}
                    setFront={setFrontSide}
                    setBack={setBackSide}
                    page={page}
                    shuffleCards={() => {
                      setCards(shuffle(cards));
                      setGlose(cards[currentCardNumber]);
                      setCurrentCardNumber(currentCardNumber);
                      toast.remove();
                      toast.success(
                        page.attributes.CardsShuffled || "Kortete ble stokket"
                      );
                    }}
                  />
                  <Button
                    className="h-24 w-full my-1"
                    color="green"
                    onClick={() => removeCard()}
                  >
                    {page.attributes.Success || "Klarte det!"}
                  </Button>
                  <Button
                    className="h-24 w-full mt-1"
                    color="red"
                    onClick={() => nextCard()}
                  >
                    {page.attributes.Failure || "Klarte det ikke"}
                  </Button>
                  <ReactToPrint
                    onBeforePrint={async () => {
                      toast.loading(
                        "Skriver ut, husk å velge å printe på begge sider!"
                      );
                      await new Promise((resolve) => setTimeout(resolve, 1500));
                      setTimeout(() => toast.remove(), 500);
                    }}
                    trigger={() => {
                      // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                      // to the root node of the returned component as it will be overwritten.
                      return (
                        <Button className="inline sm:hidden h-24 w-full mt-1">Print</Button>
                      );
                    }}
                    content={() => printRef.current}
                  />
                </div>
              </div>
            }
          />
        </div>

        <NavArrow right onClick={() => nextCard()} />
      </div>
    </div>
  );

  function nextCard() {
    toast.remove();
    toast.success(page.attributes.NextCard || "Neste kort");
    if (cards.length <= 0) return;

    if (flipped) {
      setFlipped(false);
      setTimeout(() => {
        if (
          currentCardNumber <= cards.length &&
          currentCardNumber !== cards.length - 1
        )
          setCurrentCardNumber(currentCardNumber + 1);
        else if (currentCardNumber === cards.length - 1)
          setCurrentCardNumber(0);
      }, 250);
    } else if (
      currentCardNumber <= cards.length &&
      currentCardNumber !== cards.length - 1
    )
      setCurrentCardNumber(currentCardNumber + 1);
    else if (currentCardNumber === cards.length - 1) setCurrentCardNumber(0);
  }

  function lastCard() {
    if (cards.length <= 0) return;

    if (flipped) {
      setFlipped(false);
      setTimeout(() => {
        if (currentCardNumber > 0) setCurrentCardNumber(currentCardNumber - 1);
      }, 250);
    } else if (currentCardNumber > 0)
      setCurrentCardNumber(currentCardNumber - 1);
  }

  function removeCard() {
    if (cards.length <= 0) return;

    if (flipped) {
      setFlipped(false);
      // Remove card from list
      setTimeout(() => {
        setCards(cards.filter((card) => card.Standard !== glose.Standard));
        toast.remove();
        toast.success(page.attributes.CardRemoved || "Kort fjernet");
      }, 400);
    } else {
      setCards(cards.filter((card) => card.Standard !== glose.Standard));
      toast.remove();
      toast.success(page.attributes.CardRemoved || "Kort fjernet");
    }
  }
};

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const listeRes = await fetchAPI("/lister", {
    populate: {
      SEO: {
        populate: "*",
      },
    },
  });

  const pageRes = await fetchAPI("/flashcard", {
    populate: {
      Flashcard: {
        populate: "*",
      },
    },
  });

  let { liste } = await getListe({ id: ctx.params?.id?.toString() });

  if (!liste) return { notFound: true };

  let globalLeaderboard = (
    await (
      await fetch(
        process.env.NODE_ENV === "production"
          ? process.env.VERCEL_URL + "/lister"
          : "http://localhost:3000/" +
              "api/scores/flashcards/global/" +
              ctx.params?.id
      )
    ).json()
  ).data;
  listeRes.data.attributes.seo = {
    metaTitle: liste.title,
    metaDescription: liste.description,
    keywords: liste.gloser.map((glose: Glose) => glose.Standard).toString(),
  } as MetaSeo;

  let res: any = { data: {} };
  res.data = {
    ...listeRes.data,
    ...pageRes.data,
  };

  return {
    props: {
      id: ctx.params?.id || null,
      page: res.data,
      scores: globalLeaderboard,
      liste: {
        title: liste.title,
        description: liste.description,
        gloser: liste.gloser,
      },
    },
    revalidate: 60 * 5,
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

type UserScore = {
  id: string;
  name: string;
  tid: number;
};
