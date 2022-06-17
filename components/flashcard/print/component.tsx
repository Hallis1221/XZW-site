import { Card } from "flowbite-react";
import { GloseListe } from "types/gloseListe";
import { Flashside } from "..";

export function PrintCards({printRef, liste}) {
    return <div className="h-0 w-0">
      <div ref={printRef} className="grid grid-cols-3">
        {liste.gloser.map((glose, index) => {
          return (
            <div
              key={index}
              className="w-screen flex flex-row "
            >
              <Card
                className="mb-2 mt-0 w-2/4 max-h-64"
              >
                <Flashside text={glose.Chinese} />
              </Card>
            </div>
          );
        })}
  
        {liste.gloser.map((glose, index) => {
          return (
            <div
              key={index}
              className="w-screen flex flex-row "
            >
              <Card
                className="mb-2 mt-0 w-2/4 max-h-64"
              >
                <Flashside text={glose.Pinyin} />
              </Card>
            </div>
          );
        })}
  
        {liste.gloser.map((glose, index) => {
          return (
            <div
              key={index}
              className="w-screen flex flex-row "
            >
              <Card
                className="m-2 mt-0 w-2/4 max-h-64"
              >
                <Flashside text={glose.Standard} />
              </Card>
            </div>
          );
        })}
      </div>
    </div>;
  }