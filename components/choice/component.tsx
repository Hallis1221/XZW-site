import { Card } from "flowbite-react";
import { useState, useEffect } from "react";
import { ChoiceProps } from "./props";

export function Alternative({ alternative, isCorrect, onClick }: ChoiceProps) {
  let [additionalStyles, setAdditionalStyles] = useState<string>("");

  useEffect(() => {
    setAdditionalStyles("");
  }, [isCorrect, alternative]);

  return (
    <Card className={`w-11/12 mt-10  ${additionalStyles}`}>
      <div
        className={`h-full w-full flex flex-col justify-center`}
        onContextMenu={(e) => {
          e.preventDefault();
          if (isCorrect) {
            setAdditionalStyles("text-green-500");
          } else {
            setAdditionalStyles("text-red-500");
          }
        }}
        onClick={(e) => {
          e.preventDefault();
          if (isCorrect) {
            setAdditionalStyles("bg-green-500");
          } else {
            setAdditionalStyles("bg-red-500");
          }
          setTimeout(() => {
            onClick();
          }, 1000);
        }}
      >
        <div
          className={`text-center text-3xl font-semibold tracking-widest ${additionalStyles}`}
        >
          {alternative}
        </div>
      </div>
    </Card>
  );
}
