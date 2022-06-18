/* Types */
import type { Glose } from "types/glose";
import type { MultiChoice } from "types/mchoice";
import type { AnswerType, QuestionType } from "types/mchoiceQuestion";
import type { MetaSeo } from "types/seo";
import type { GetStaticPropsContext } from "next";
import type { ChoiceManager } from "types/choiceManager";
/* Flowbite components */
import { Card } from "flowbite-react";
/* Hooks */
import { useEffect, useState } from "react";
/* Utils */
import CreateMChoice from "src/lib/choices/smartchoices";
/* Api call */
import getListe from "src/lib/pages/getListe";
import fetchAPI from "strapi/fetch";
import { MultiChoiceSettings } from "src/components/multiplechoice/settings";
import { MultiChoiceAlternatives } from "src/components/multiplechoice/alternatives";

// TODO: Make dependent on strapi
export default function Page({ liste }) {
  let [questionType, setQuestionType] = useState<QuestionType>("hanzi");
  let [answerType, setAnswerType] = useState<AnswerType>("pinyin");
  let [gloser, setGloser] = useState<Glose[]>(Array.from(liste.gloser));

  let [currentChoiceIndex, setCurrentChoiceIndex] = useState<number>(0);

  let [choiceManager, setChoiceManager] = useState<ChoiceManager>({
    key: "",
    style: "",
    submitted: false,
  });

  let [currentChoice, setCurrentChoice] = useState<MultiChoice | undefined>();

  useEffect(() => {
    if (currentChoiceIndex >= gloser.length) setCurrentChoiceIndex(0);
    else
      setCurrentChoice(
        CreateMChoice({
          liste: Array.from(gloser),
          glose: gloser[currentChoiceIndex],
          questionType: questionType || "hanzi",
          answerType: answerType || "pinyin",
        })
      );
  }, [answerType, currentChoiceIndex, gloser, questionType]);

  return (
    <div className="absolute top-0 left-0 h-screen flex flex-col justify-start w-screen -z-50 overflow-hidden">
      <div className="flex flex-row justify-center mt-16 sm:mt-24">
        <div className="w-screen max-w-6xl h-screen">
          <Card className="relative w-full h-1/5">
            <div className="absolute right-0 top-0 m-5 font-bold">
              {currentChoiceIndex} / {gloser.length}
            </div>
            <span className="text-center text-2xl sm:text-3xl md:text-4xl">
              Hva er `
              <strong className="font-semibold">
                {currentChoice?.question}
              </strong>
              ` i {answerType}?
            </span>
          </Card>
          <MultiChoiceAlternatives
            setCurrentChoiceIndex={setCurrentChoiceIndex}
            currentChoice={currentChoice as MultiChoice}
            currentChoiceIndex={currentChoiceIndex}
            setChoiceManager={setChoiceManager}
            choiceManager={choiceManager}
            setGloser={setGloser}
            gloser={gloser}
          />
          <MultiChoiceSettings
            setAnswerType={setAnswerType}
            setQuestionType={setQuestionType}
          />
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
