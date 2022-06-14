import { useState } from "react";
import { SwipeEventData, useSwipeable } from "react-swipeable";
import { Glose } from "types/glose";
import { Flashcard } from "components/flashcard";
import { SwipeAbleFlashcardProps } from "./props";

export function SwipeableFlashcard({flipped, setFlipped, glose, onLeft, onRight}: SwipeAbleFlashcardProps) {
    const [swipeData, setSwipeData] = useState<SwipeEventData | null>(null);
  
    const handlers = useSwipeable({
      onSwipedLeft: () => onLeft(),
      onSwipedRight: () => onRight(),
      onSwiping: (e) => {
        if (e == swipeData) console.log("swiping");
        setSwipeData(e);
      },
      onTouchEndOrOnMouseUp: () => {
        setSwipeData(null);
      },
    });
    return <div
    {...handlers}
      className="w-full h-full relative"
      style={swipeData
        ? {
          zIndex: 999999,
          position: "absolute",
          transform: `translateY(${swipeData?.deltaY}px) translateX(${swipeData?.deltaX}px)`,
          rotate: `${swipeData?.deltaX/15}deg`,
        }
        : {}}
    >
      <Flashcard
        flipped={flipped}
        onClick={() => setFlipped(!flipped)}
        front={glose.Standard}
        back={glose.Chinese} />
    </div>;
  }