import { FunctionComponent } from "react";
import { Alternative } from "components/choice";
import type { Choice } from "types/mchoice";
import { MultiChoiceAlternativeProps } from "./props";

export const MultiChoiceAlternatives: FunctionComponent<MultiChoiceAlternativeProps> = ({
  setChoiceManager,
  choiceManager,
  currentChoiceIndex,
  setCurrentChoiceIndex,
  gloser,
  setGloser,
  currentChoice,
}) => (
  <div className={`w-fit min-w-full max-w-6xl h-3/5 grid grid-cols-2`}>
    {currentChoice?.alternatives.map((answer: Choice) => {
      let id = answer.text;
      return (
        <div
          className={`flex flex-grid justify-center h-full w-full`}
          key={id}
          onContextMenu={(e) => {
            if (choiceManager.submitted) return;
            e.preventDefault();
            if (answer.isCorrect) {
              setChoiceManager({ key: id, style: "text-green-500" });
            } else {
              setChoiceManager({ key: id, style: "text-red-500" });
            }
          }}
          onClick={async (e) => {
            if (choiceManager.submitted) return;
            if (answer.isCorrect) {
              setChoiceManager({
                key: id,
                style: "bg-green-500",
                submitted: true,
              });
              await new Promise((resolve) => setTimeout(resolve, 2000));
              let nyeGloser = Array.from(gloser);
              nyeGloser.splice(currentChoiceIndex, 1);
              setGloser(nyeGloser);
            } else {
              setChoiceManager({
                key: id,
                style: "bg-red-500",
                submitted: true,
              });
              await new Promise((resolve) => setTimeout(resolve, 2000));
              setCurrentChoiceIndex(currentChoiceIndex + 1);
            }
            setChoiceManager({ key: "", style: "", submitted: false });
          }}
        >
          <Alternative
            alternative={answer.text}
            classNames={[
              choiceManager.key === id ? choiceManager.style : "",
              choiceManager.submitted !== undefined &&
              choiceManager.submitted &&
              answer.isCorrect
                ? "bg-green-500"
                : "",
            ]}
          />
        </div>
      );
    })}
  </div>
);
