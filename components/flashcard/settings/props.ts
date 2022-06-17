import { Dispatch, SetStateAction } from "react";
import { CardSide } from "types/cardSide";

export type CardSettingsProps = {
    setBack: Dispatch<SetStateAction<CardSide>>;
    setFront: Dispatch<SetStateAction<CardSide>>;
    printRef: React.RefObject<HTMLDivElement>;
    page: any;
    shuffleCards: () => void;
    isAbove?: boolean;
  }