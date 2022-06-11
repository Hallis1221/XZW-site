import type { SetStateAction, MutableRefObject } from "react";

export type DetailsPopupProps = {
    setCurrentModalContent: { (value: any): void; (arg0: null): void },
    currentModalContent: any,
    hanziRef: MutableRefObject<HTMLDivElement | null>,
    hanziQuizRef: MutableRefObject<HTMLDivElement | null>,
}