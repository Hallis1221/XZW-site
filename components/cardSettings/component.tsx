import { Button, Dropdown } from "flowbite-react";
import { CardSettingsProps } from "./props";

export function CardSettings({
    setBack,
    setFront,
    shuffleCards,
    page,
    isAbove = false,
  }: CardSettingsProps) {
    return (
      <div
        className={`flex flex-row w-full justify-between ${
          isAbove ? "mb-2" : "mt-2"
        }`}
      >
        <Dropdown label="Front" placement="top">
          <Dropdown.Item onClick={() => setFront("hanzi")}>
            {page.attributes.Hanzi || "hànzì"}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setFront("pinyin")}>
            {page.attributes.Pinyin || "pīnyīn"}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setFront("standard")}>
            {page.attributes.Standard || "norsk"}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setFront("pinyin_hanzi")}>
            {page.attributes.Hanzi || "hànzì"} og{" "}
            {page.attributes.Pinyin || "pīnyīn"}
          </Dropdown.Item>
        </Dropdown>
        <Button 
        onClick={()=>shuffleCards()}
        >
           {page.attributes.ReshuffleCards || "Stokk kortene"}
        </Button>
        <Dropdown label="Bak" placement="top">
          <Dropdown.Item onClick={() => setBack("hanzi")}>
            {page.attributes.Hanzi || "hànzì"}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setBack("pinyin")}>
            {page.attributes.Pinyin || "pīnyīn"}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setBack("standard")}>
            {page.attributes.Standard || "norsk"}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setBack("pinyin_hanzi")}>
            {page.attributes.Hanzi || "hànzì"} og{" "}
            {page.attributes.Pinyin || "pīnyīn"}
          </Dropdown.Item>
        </Dropdown>
      </div>
    );
  }