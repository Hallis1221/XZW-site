import { Glose } from "types/glose";

export type SwipeAbleFlashcardProps = {flipped: boolean, setFlipped: (flipped: boolean) => void, glose: Glose, onLeft: () => void, onRight: () => void}