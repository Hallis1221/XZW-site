import { Card } from "flowbite-react";
import { GetStaticPropsContext } from "next";
import { useEffect, useState } from "react";
import { Alternative } from "src/components/choice";
import CreateMChoice from "src/lib/choices/smartchoices";
import getListe from "src/lib/pages/getListe";
import fetchAPI from "strapi/fetch";
import { Glose } from "types/glose";
import { Choice, MultiChoice } from "types/mchoice";
import { AnswerType, QuestionType } from "types/mchoiceQuestion";
import { MetaSeo } from "types/seo";

export default function Page({ liste }) {
  let [questionType, setQuestionType] = useState<QuestionType>("hanzi");
  let [answerType, setAnswerType] = useState<AnswerType>("pinyin");
  let [gloser, setGloser] = useState<Glose[]>([]);

  let [currentChoiceIndex, setCurrentChoiceIndex] = useState<number>(0);

  let [currentChoice, setCurrentChoice] = useState<MultiChoice | undefined>(
    undefined
  );

  useEffect(() => {
    if (gloser.length <= 2) {
      // Javascript copies the reference if we dont do Array.from
      setGloser(Array.from(liste.gloser));
    }
  }, [liste.gloser, gloser.length]);

  useEffect(() => {
    setCurrentChoiceIndex(gloser.length);
    let glose = gloser[currentChoiceIndex];

    if (!glose || !gloser) {
      return;
    } else
      setCurrentChoice(
        CreateMChoice({
          liste: gloser,
          glose: glose,
          questionType,
          answerType,
        })
      );
  }, [answerType, currentChoiceIndex, gloser, questionType]);

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
              på {answerType}?
            </span>
          </Card>
          <div className="w-fit min-w-full max-w-6xl h-3/5 bg-pink-500 grid grid-cols-2 justify-items-center">
            {currentChoice?.alternatives.map((answer: Choice) => (
              <Alternative
                key={Math.random() * answer.text.split("").length}
                alternative={answer.text}
                isCorrect={answer.isCorrect}
                onClick={() => {
                  setCurrentChoiceIndex(currentChoiceIndex - 1);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
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
