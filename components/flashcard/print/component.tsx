import { Card } from "flowbite-react";
import { ReactNode } from "react";
import { CardSide } from "types/cardSide";
import { Glose } from "types/glose";
import { Flashside } from "..";

export function PrintCards({
  printRef,
  liste,
  frontSide,
  backSide,
}: {
  printRef: React.RefObject<HTMLDivElement>;
  liste: { gloser: Glose[] };
  frontSide: CardSide;
  backSide: CardSide;
}) {
  let cardsPerPage = 18;

  // Sort the list so the same glose are in the same "position" on the print
  let gloseListe: Glose[] = Array.from(liste.gloser);
  gloseListe.sort((a, b) => {
    if (a.Chinese.length < b.Chinese.length) return -1;
    if (a.Chinese.length > b.Chinese.length) return 1;
    return 0;
  });

  let hanzis: Array<ReactNode> = [];

  if (frontSide === "hanzi" || backSide === "hanzi")
    hanzis = gloseListe.map((glose, index) => {
      return (
        <div
          key={glose.Chinese + "-" + index.toString()}
          className="w-screen flex flex-row "
        >
          <Card className="my-1 w-2/4 max-h-64">
            <Flashside text={glose.Chinese} />
          </Card>
        </div>
      );
    });

  let pinyins: Array<ReactNode> = [];

  if (frontSide === "pinyin" || backSide === "pinyin")
    pinyins = gloseListe.map((glose, index) => {
      return (
        <div
          key={glose.Pinyin + "-" + index.toString()}
          className="w-screen flex flex-row "
        >
          <Card className="my-1 w-2/4 max-h-64">
            <Flashside text={glose.Pinyin} />
          </Card>
        </div>
      );
    });

  let standards: Array<ReactNode> = [];
  if (frontSide === "standard" || backSide === "standard")
    standards = gloseListe.map((glose, index) => {
      return (
        <div
          key={glose.Standard + "-" + index.toString()}
          className="w-screen flex flex-row "
        >
          <Card className="my-1 w-2/4 max-h-64">
            <Flashside text={glose.Standard} />
          </Card>
        </div>
      );
    });

  let pinhanzis: Array<ReactNode> = [];
  if (frontSide === "pinyin_hanzi" || backSide === "pinyin_hanzi")
    pinhanzis = gloseListe.map((glose, index) => {
      return (
        <div
          key={glose.Pinyin + "-" + index.toString()}
          className="w-screen flex flex-row "
        >
          <Card className="my-1 w-2/4 max-h-64">
            <Flashside text={glose.Pinyin + " (" + glose.Chinese +")"} />
          </Card>
        </div>
      );
    });

  let pagesPerType = Math.ceil(gloseListe.length / cardsPerPage);

  // Each array in this list is a page of cards.
  let printableCardlists: Array<Array<ReactNode>> = [];
  for (let i = 0; i < pagesPerType; i++) {
    printableCardlists.push(
      getSide(frontSide, cardsPerPage, i, hanzis, pinyins, standards, pinhanzis)
    );
    printableCardlists.push(
      getSide(backSide, cardsPerPage, i, hanzis, pinyins, standards, pinhanzis)
    );
  }

  return (
    <div className="h-0 w-0">
      <div ref={printRef} className="">
        {printableCardlists.map((cardlist, index) => {
          return (
            <div key={index} className="h-full mb-24">
              <div className="grid grid-cols-3">{cardlist}</div>
            </div>
          );
        })}{" "}
      </div>
    </div>
  );
}

function getSide(
  side: CardSide,
  cardsPerPage: number,
  i: number,
  hanzis,
  pinyins,
  standards,
  pinhanzis
) {
  switch (side) {
    case "hanzi":
      return hanzis.slice(i * cardsPerPage, (i + 1) * cardsPerPage);

    case "pinyin":
      return pinyins.slice(i * cardsPerPage, (i + 1) * cardsPerPage);

    case "standard":
      return standards.slice(i * cardsPerPage, (i + 1) * cardsPerPage);

    case "pinyin_hanzi":
      return pinhanzis.slice(i * cardsPerPage, (i + 1) * cardsPerPage);

    default:
      throw new Error("Unknown frontSide");
  }
}
