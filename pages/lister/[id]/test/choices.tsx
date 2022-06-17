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
  let [gloser, setGloser] = useState<Glose[]>(Array.from(liste.gloser));

  let [currentChoiceIndex, setCurrentChoiceIndex] = useState<number>(0);

  let [choiceManager, setChoiceManager] = useState<{
    key: string;
    style: string;
    submitted?: boolean;
  }>({
    key: "",
    style: "",
    submitted: false,
  });

  let [currentChoice, setCurrentChoice] = useState<MultiChoice | undefined>(
    undefined
  );

  useEffect(() => {
    let glose = gloser[currentChoiceIndex];
    console.log(gloser);
    if (glose === undefined || gloser === undefined) {
      console.log(glose === undefined, gloser === undefined);
      return;
    } else
      setCurrentChoice(
        CreateMChoice({
          liste: Array.from(gloser),
          glose: glose,
          questionType,
          answerType,
        })
      );
  }, [answerType, currentChoiceIndex, gloser, questionType]);

  return (
    <div className="absolute top-0 left-0 h-screen flex flex-col justify-start w-screen -z-50 overflow-hidden">
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
          <div
            className={`w-fit min-w-full max-w-6xl h-3/5 grid grid-cols-2`}
          >
            {currentChoice?.alternatives.map((answer: Choice) => {
              let id = answer.text;
              return (
                <div
                  className={`flex flex-grid justify-center h-full w-full ${
                    choiceManager.key === id ? choiceManager.style : ""
                  }`}
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
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      gloser.splice(currentChoiceIndex, 1);
                      setGloser(gloser);
                      setCurrentChoiceIndex(currentChoiceIndex + 1);
                    } else {
                      setChoiceManager({
                        key: id,
                        style: "bg-red-500",
                        submitted: true,
                      });
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      setCurrentChoiceIndex(currentChoiceIndex + 1);
                    }
                    setChoiceManager({ key: "", style: "" });
                  }}
                >
                  <Alternative
                    alternative={answer.text}
                    className={
                      choiceManager.key === id ? choiceManager.style : ""
                    }
                  />
                </div>
              );
            })}
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
