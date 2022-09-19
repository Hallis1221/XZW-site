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
      return <PrintableFlashcard key={index} text={glose.Chinese} />;
    });

  let pinyins: Array<ReactNode> = [];

  if (frontSide === "pinyin" || backSide === "pinyin")
    pinyins = gloseListe.map((glose, index) => {
      return <PrintableFlashcard key={index} text={glose.Pinyin} />;
    });

  let standards: Array<ReactNode> = [];
  if (frontSide === "standard" || backSide === "standard")
    standards = gloseListe.map((glose, index) => {
      return <PrintableFlashcard key={index} text={glose.Standard} />;
    });

  let pinhanzis: Array<ReactNode> = [];
  if (frontSide === "pinyin_hanzi" || backSide === "pinyin_hanzi")
    pinhanzis = gloseListe.map((glose, index) => {
      return (
        <PrintableFlashcard
          key={index}
          text={glose.Pinyin + " (" + glose.Chinese + ")"}
        />
      );
    });

  let pagesPerType = Math.ceil(gloseListe.length / cardsPerPage);

  // Each array in this list is a page of cards.
  let printableCardlists: Array<Array<ReactNode>> = [];
  for (let i = 0; i < pagesPerType; i++) {
    printableCardlists.push(
      getSide(frontSide, cardsPerPage, i, hanzis, pinyins, standards, pinhanzis)
    );

    // Getting the backside to be printing behind the corresponding frontside is a bit tricky.
    // The reason is that printers "flip" the backside when printing. Therefore, we need to
    // split the backside cards into groups of three and then place the first element of each
    // group last in the group, the third element first, and the second element second.
    printableCardlists.push(
      divideToGroups(
        getSide(
          backSide,
          cardsPerPage,
          i,
          hanzis,
          pinyins,
          standards,
          pinhanzis
        ),
        3
      )
        .map((chunk) => {
          return chunk.sort((a, b) => {
            // If a card is in the middle row, it should stay in the middle row.
            // If a card is in the first row, it should move up to the third row
            // If a card is in the third row, it should move down to the first row

            let aSecondRow = (parseInt(a.key) / 3) % 1 === 0;
            let aFirstRow = !aSecondRow && (parseInt(a.key) / 3) % 1 === 0;
            let aThirdRow = !aFirstRow && !aSecondRow;

            if (aFirstRow) return 1;
            if (aSecondRow) return 0;
            if (aThirdRow) return -1;
          });
        })
        .concat()
    );
  }

  return (
    <div className="h-0 w-0">
      <div ref={printRef} className="">
        {printableCardlists.map((cardlist, index) => {
          return (
            <div key={index} className="h-full">
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
  hanzis: any[],
  pinyins: any[],
  standards: any[],
  pinhanzis: any[]
): any[] {
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

function divideToGroups(array: any[], chunkSize: number) {
  var groups: any[] = [];

  if (array.length <= chunkSize) {
    groups.push(array);
  } else {
    for (var i = 0; i < array.length; i += chunkSize) {
      let group = array.slice(i, i + chunkSize);
      while (group.length !== chunkSize)
        for (let j = 2; j > group.length - 1; j--)
          group.push(<PrintableFlashcard key={j} text=" " />);

      groups.push(group);
    }
  }
  return groups;
}

function PrintableFlashcard({ text }: { text: string }) {
  return (
    <div className="w-screen flex flex-row ">
      <Card className="my-1 w-2/4 h-[192px]">
        <Flashside text={text} />
      </Card>
    </div>
  );
}
