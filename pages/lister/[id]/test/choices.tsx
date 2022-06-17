import { Card } from "flowbite-react";
import { GetStaticPropsContext } from "next";
import { SetStateAction, useEffect, useState } from "react";
import CreateMChoice from "src/lib/choices/smartchoices";
import getListe from "src/lib/pages/getListe";
import { shuffle } from "src/lib/shuffle";
import fetchAPI from "strapi/fetch";
import { Glose } from "types/glose";
import { Choice, MultiChoice } from "types/mchoice";
import { AnswerType, QuestionType } from "types/mchoiceQuestion";
import { MetaSeo } from "types/seo";

export default function Page({ liste }) {
  let [questionType, setQuestionType] = useState<QuestionType>("hanzi");
  let [answerType, setAnswerType] = useState<AnswerType>("pinyin");
  let [gloser, setGloser] = useState<Glose[]>(liste.gloser);

  let [currentChoiceIndex, setCurrentChoiceIndex] = useState<number>(Math.floor(Math.random() * gloser.length));

  let [currentChoice, setCurrentChoice] = useState<MultiChoice | undefined>(
    undefined
  );

  useEffect(() => {
    setCurrentChoice(
      CreateMChoice({
        liste: gloser,
        glose: gloser[currentChoiceIndex],
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
              <Alternative key={answer.text} alternative={answer.text} isCorrect={answer.isCorrect} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Alternative({ alternative, isCorrect }:{alternative: string, isCorrect: boolean}) {
  return (
    <Card className="w-11/12 mt-10">
      <div className="text-center text-3xl font-semibold tracking-widest">
        {alternative}
      </div>
    </Card>
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
