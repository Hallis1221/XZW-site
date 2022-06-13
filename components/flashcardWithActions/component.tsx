import { FlashcardActionsProps } from "./props";

export function FlashcardWithActions({
  desktopButtons,
  mobileButtons,
}: FlashcardActionsProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="hidden md:inline md:absolute md:bottom-0 md:h-1/6 md:w-full ">
        <div className="flex justify-evenly h-full mx-[21%]">
          <div className="flex  justify-between w-full">{desktopButtons}</div>
        </div>
      </div>{" "}
      {mobileButtons}
    </div>
  );
}
