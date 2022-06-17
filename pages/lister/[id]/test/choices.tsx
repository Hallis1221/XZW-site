import { Card } from "flowbite-react";
import { GetStaticPropsContext } from "next";
import { SetStateAction, useEffect, useState } from "react";
import getListe from "src/lib/pages/getListe";
import { shuffle } from "src/lib/shuffle";
import fetchAPI from "strapi/fetch";
import { Glose } from "types/glose";
import { Choice, MultiChoice } from "types/mchoice";
import { AnswerType, QuestionType } from "types/mchoiceQuestion";
import { MetaSeo } from "types/seo";

export default function Page({ liste }) {
  let [questionType, setQuestionType] = useState<QuestionType>("pinyin");
  let [answerType, setAnswerType] = useState<AnswerType>("pinyin");

  let [currentChoice, setCurrentChoice] = useState<Choice | undefined>(
    undefined
  );

  useEffect(() => {
    setCurrentChoice(
      CreateMChoice({
        liste: liste.gloser,
        glose: liste.gloser[0],
        questionType,
        answerType,
      })
    );
  }, [answerType, liste.gloser, questionType]);

  return (
    <div className="absolute top-0 left-0 h-screen flex flex-col justify-start w-screen -z-50 overflow-hidden bg-red-500">
      <div className="flex flex-row justify-center mt-36 sm:mt-32">
        <div className="w-screen max-w-6xl h-screen">
          <Card className="w-full h-1/5">
            <span className="text-center text-3xl">
              Hva er{" "}
              <strong className="font-semibold">
                {currentChoice?.question}
              </strong>{" "}
              på norsk?
            </span>
          </Card>
          <div className="w-fit min-w-full max-w-6xl h-3/5 bg-pink-500 grid grid-cols-2 justify-items-center">
            {currentChoice?.alternatives.map((answer) => (
              <Alternative key={answer} alternative={answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Alternative({ alternative }) {
  return (
    <Card className="w-11/12 mt-10">
      <div className="text-center text-3xl font-semibold leading-3 tracking-widest">
        {alternative}
      </div>
    </Card>
  );
}

function CreateMChoice({
  glose,
  liste,
  questionType,
  answerType,
}: {
  glose: Glose;
  liste: Glose[];
  questionType: QuestionType;
  answerType: AnswerType;
}): Choice {
  // Remove the glose from the liste for it not to be used again
  liste.splice(liste.indexOf(glose), 1);

  let choice: Choice = {
    question: "",
    alternatives: ["", "", ""],
  };

  switch (questionType) {
    case "pinyin":
      choice.question = glose.Pinyin;
      break;
    case "hanzi":
      choice.question = glose.Chinese;
      break;
    case "standard":
      choice.question = glose.Standard;
      break;
    default:
      throw new Error(
        "Unknown question type or the question type is not supported at the moment"
      );
  }

  function createAlternatives() {
    let winners: Array<any> = [];

    // Find the word that is the most similar to the glose
    liste.forEach((word) => {
      let similarity = 0;

      // Increase the similarity based on how similair the length of the word is compared to the length of the glose
      let lengthDifference = choice.question.length - word.Pinyin.length;
      lengthDifference =
        lengthDifference >= 0 ? lengthDifference : lengthDifference * -1;
      lengthDifference *= 2;
      similarity -= lengthDifference;

      choice.question.split("").forEach((letter) => {
        switch (answerType) {
          case "pinyin":
            word.Pinyin.split("").forEach((alternativeLetter) => {
              if (letter === alternativeLetter) {
                similarity++;
              }
            });

            break;
          case "hanzi":
            word.Chinese.split("").forEach((alternativeLetter) => {
              if (letter === alternativeLetter) {
                similarity++;
              }
            });

            break;
          case "standard":
            word.Standard.split("").forEach((alternativeLetter) => {
              if (letter === alternativeLetter) {
                similarity++;
              }
            });
            break;
          default:
            throw new Error(
              "Unknown answer type or the answer type is not supported at the moment"
            );
        }
      });

      // We dont want to add the word if its just a sentence with the question
      if (
        !(
          choice.question.includes(word.Pinyin) ||
          choice.question.includes(word.Chinese) ||
          choice.question.includes(word.Standard) ||
          word.Pinyin.includes(choice.question) ||
          word.Chinese.includes(choice.question) ||
          word.Standard.includes(choice.question)
        )
      ) {
        winners.push({
          word,
          similarity,
        });
      }
    });

    // Sort the winners array by similarity
    winners.sort((a, b) => {
      return b.similarity - a.similarity;
    });

    [winners[0].word, winners[1].word, winners[2].word].forEach(
      (alternative, index) => {
        switch (answerType) {
          case "pinyin":
            choice.alternatives[index] = alternative.Pinyin;
            break;
          case "hanzi":
            choice.alternatives[index] = alternative.Chinese;
            break;
          case "standard":
            choice.alternatives[index] = alternative.Standard;
            break;
          default:
            throw new Error(
              "Unknown answer type or the answer type is not supported at the moment"
            );
        }
      }
    );

    switch (answerType) {
      case "pinyin":
        choice.alternatives.push(glose.Pinyin);
        break;
      case "hanzi":
        choice.alternatives.push(glose.Chinese);
        break;
      case "standard":
        choice.alternatives.push(glose.Standard);
        break;
      default:
        throw new Error(
          "Unknown answer type or the answer type is not supported at the moment"
        );
    }

    // Shuffle the alternatives
    choice.alternatives = shuffle(choice.alternatives);
  }
  createAlternatives();
  console.log(choice);
  return choice;
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const listeRes = await fetchAPI("/lister", {
    populate: {
      SEO: {
        populate: "*",
      },
    },
  });

  const pageRes = await fetchAPI("/flashcard", {
    populate: {
      Flashcard: {
        populate: "*",
      },
    },
  });

  let { liste } = await getListe({ id: ctx.params?.id?.toString() });

  if (!liste) return { notFound: true };

  listeRes.data.attributes.seo = {
    metaTitle: liste.title,
    metaDescription: liste.description,
    keywords: liste.gloser.map((glose: Glose) => glose.Standard).toString(),
  } as MetaSeo;

  let res: any = { data: {} };
  res.data = {
    ...listeRes.data,
    ...pageRes.data,
  };

  return {
    props: {
      id: ctx.params?.id || null,
      page: res.data,
      liste: {
        title: liste.title,
        description: liste.description,
        gloser: liste.gloser,
      },
    },
  };
}

export async function getStaticPaths() {
  const gloserRes = await fetchAPI("/glose-listes");
  gloserRes.attributes = undefined;

  let paths: { params: { id: string } }[] = [];

  gloserRes.data.forEach(
    (element: {
      id: number;
      attributes: {
        Title: string;
      };
    }) => {
      paths.push({
        params: {
          id: `${element.attributes.Title}-${element.id}`,
        },
      });
    }
  );
  return {
    paths,
    fallback: "blocking",
  };
}
