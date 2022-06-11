import { Card } from "flowbite-react";
import { FunctionComponent, useState } from "react";
import getStrokeRef from "src/lib/stroke-order/getRef";
import { DetailsPopupProps } from "./props";

export const GloseDetailsPopup: FunctionComponent<DetailsPopupProps> = ({
  currentModalContent,
  setCurrentModalContent,
  hanziRef,
  hanziQuizRef,
}) => {
  const [hanziFocused, setHanziFocused] = useState<string>();

  return (
    <div
      className={`absolute flex h-full w-full  ${
        currentModalContent ? "inline  z-50 " : "hidden -z-50"
      } `}
    >
      <div className="flex flex-row w-full h-full justify-center ">
        <div
          className="absolute flex h-full w-full bg-opacity-75 bg-white hover:cursor-pointer"
          onClick={() => setCurrentModalContent(null)}
        />
        <div className="max-w-sm min-w-full w-full flex flex-row justify-center h-fit mt-20 ml-[50] z-10">

          <div
            className="absolute -z-10 h-full w-full hover:cursor-pointer"
            onClick={() => {setCurrentModalContent(null); setHanziFocused("");}}
          />

          {typeof currentModalContent === "object" ? (
            <div className="w-3/12 min-w-fit max-w-lg">
              <Card>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {currentModalContent?.Standard}
                </h5>
                <p className="font-normal tracking-widest text-gray-700 dark:text-gray-400">
                  {currentModalContent?.Pinyin}
                </p>
                <p className="font-normal tracking-widest text-gray-700 dark:text-gray-400">
                  {currentModalContent?.Chinese.split("").map(
                    (letter: string, index: number) => {
                      return (
                        <span
                          key={index}
                          className={`inline-block m-2 hover:underline hover:cursor-pointer ${
                            hanziFocused === letter ? "text-blue-600 underline" : ""
                          }`}
                          onClick={() => {
                            setHanziFocused("");

                            // We use a setTimeout ms-1 to make sure the ref is ready
                            setTimeout(() => {
                              setHanziFocused(letter);
                              setTimeout(() => {
                                if (hanziRef.current !== undefined)
                                  getStrokeRef({
                                    ref: hanziRef,
                                    word: letter,
                                    options: {
                                      width: 150,
                                      height: 150,
                                      padding: 5,
                                      showOutline: true,
                                      renderer: "canvas",
                                    },
                                  });
                                getStrokeRef({
                                  ref: hanziQuizRef,
                                  word: letter,
                                  quiz: true,
                                  options: {
                                    width: 150,
                                    height: 150,
                                    padding: 5,
                                    showOutline: true,
                                    renderer: "canvas",
                                  },
                                });
                              }, 1);
                            }, 1);
                          }}
                        >
                          {letter}
                        </span>
                      );
                    }
                  )}
                </p>
              </Card>
              {hanziFocused && hanziFocused !== ""  && hanziFocused !== null ? (
                <Card>
                  {hanziFocused}
                  <div className="flex flex-row justify-center">
                    <div ref={hanziRef} />
                    <div ref={hanziQuizRef} />
                  </div>
                </Card>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
