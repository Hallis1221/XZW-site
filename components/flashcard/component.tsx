/* Components */
import { Card } from "flowbite-react";
/* Props */
import { FlashcardProps } from "./props";

export function Flashcard({ flipped, onClick, front, back }: FlashcardProps) {
  return (
    <div className={`flex justify-center flip ${flipped ? "flipped" : ""}`}>
      <div
        className="flex justify-center flip-content"
        onClick={() => onClick()}
      >
        <Card
          className={`flip-front flashcard sm:mt-[5%] sm:h-3/4 md:w-3/4 xl:mt-10`}
        >
          <Flashside text={front} />
        </Card>

        <Card
          className={`flip-back flashcard sm:mt-[5%] sm:h-3/4 md:w-3/4 xl:mt-10`}
        >
          <Flashside text={back} />
        </Card>
      </div>
    </div>
  );
}

export function Flashside({ text }: { text: string }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="m-24 text-center  w-full text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-semibold  tracking-wide text-gray-900 dark:text-white">
        <div>{text}</div>
      </h1>
    </div>
  );
}
