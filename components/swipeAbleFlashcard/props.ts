import { Card } from "types/card";

export type SwipeAbleFlashcardProps = {flipped: boolean, setFlipped: (flipped: boolean) => void, card: Card, onLeft: () => void, onRight: () => void}