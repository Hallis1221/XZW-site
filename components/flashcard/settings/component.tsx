import { Button, Dropdown } from "flowbite-react";
import toast from "react-hot-toast";
import ReactToPrint from "react-to-print";
import { CardSettingsProps } from "./props";

export function CardSettings({
  setBack,
  setFront,
  shuffleCards,
  halfStock,
  printRef,
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
      <Button onClick={() => shuffleCards()}>
        {page.attributes.ReshuffleCards || "Stokk kortene"}
      </Button>{" "}

      <Button onClick={() => halfStock()}>
        {page.attributes.HalfStock || "Halver stokken"}
      </Button>{" "}
      <ReactToPrint
        onBeforePrint={async () => {
          toast.loading("Skriver ut, husk å velge å printe på begge sider!");
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setTimeout(() => toast.remove(), 500);
        }}
        trigger={() => {
          // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
          // to the root node of the returned component as it will be overwritten.
          return <Button className="hidden sm:inline">Print</Button>;
        }}
        content={() => printRef.current}
      />
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
