/* Types */
import type { MutableRefObject } from "react";
import type { HanziWriterOptions } from "hanzi-writer";

import HanziWriter from "hanzi-writer";

let writer;
export default function getStrokeRef({
  animationOptions,
  forcePause = false,
  quiz = false,
  options,
  word,
  ref
}: {
  ref: MutableRefObject<string | HTMLElement | null>;
  options?: Partial<HanziWriterOptions> | undefined;
  animationOptions?: Partial<HanziWriterOptions> | undefined;
  forcePause?: boolean ;
  word: string;
  quiz?: boolean;
}) {
  if (!ref || !ref.current) throw new Error("getStrokeRef: ref is not valid");
  else
  {
    if (writer && forcePause) writer.pauseAnimation();
      writer = HanziWriter.create(ref.current, word, {
      ...options,
    });

    if (quiz) writer.quiz();
    else {writer.animateCharacter(
      {
        ...animationOptions,
      }
    );}
  }
}
