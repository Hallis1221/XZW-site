/* Types */
import type { NextPage } from "next";
/* Next.js components */
import Link from "next/link";
/* Flowbite components */
import { Button, Card, Label, TextInput } from "flowbite-react";
/* API calls */
import fetchAPI from "strapi/fetch";
import { useState } from "react";
import toast from "react-hot-toast";

// TODO - type this
const Page: NextPage = ({ page, gloser }: any) => {
  let [values, setValues] = useState<
    {
      standard: string;
      hanzi: string;
    }[]
  >([{ standard: "", hanzi: "" }]);
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");

  let [submitted, setSubmitted] = useState(false);

  let [count, setCount] = useState(1);

  return (
    <div className="w-full ">
      {" "}
      <div className="flex w-full">
        <div className="mb-2 block     size={200}">
          <Label htmlFor="title" defaultValue="Title" />
        </div>
        <TextInput
          id="title"
          type="text"
          placeholder="Title"
          className="md:mr-10"
          required={true}
          shadow={true}
          disabled={submitted}
          size={50}
          onBlur={(e) => setTitle(e.target.value)}
        />

        <div className="mb-2 block ">
          <Label htmlFor="description" defaultValue="Description" />
        </div>
        <TextInput
          id="desc"
          type="text"
          className="md:ml-10"
          disabled={submitted}
          placeholder="Your description"
          required={true}
          shadow={true}
          size={250}
          onBlur={(e) => {
            setDescription(e.target.value);
          }}
        />
      </div>
      <div className="w-full  mt-2 mb-10">
        <div className="mb-2 block">
          <Label htmlFor="small">Importer gloser fra quizlet...</Label>
        </div>
        <TextInput
          id="desc"
          type="text"
          disabled={submitted}
          placeholder="Quizlet link"
          required={true}
          shadow={true}
          size={150}
          onBlur={(e) => {
            processQuizletLink(e, values, setCount, setValues);
          }}
          onSubmit={(e) => {
            e.preventDefault();
            processQuizletLink(e, values, setCount, setValues);
          }}
        />{" "}
      </div>
      <div className="flex w-full justify-between ">
        <div className="w-full mr-2 lg:mr-10">
          <div className="mb-2 block">
            <Label htmlFor="small">Standard</Label>
          </div>
          <TextInput
            id="small"
            type="text"
            disabled={submitted}
            defaultValue={
              values[0].standard === "" ? undefined : values[0].standard
            }
            sizing="sm"
            onBlur={(e: any) => {
              if (values.length > 0) {
                let newValues = Array.from(values);
                newValues[0].standard = e.target.value;
                setValues(newValues);
              } else {
                let newValues = Array.from(values);
                newValues.push({ standard: e.target.value, hanzi: "" });
                setValues(newValues);
              }
            }}
          />
          {Array.from(Array(count - 1)).map((_, i) => {
            i++;
            return (
              <TextInput
                key={"nor" + i}
                id="small"
                type="text"
                disabled={submitted}
                sizing="sm"
                className="mt-5"
                defaultValue={
                  values[i].standard === "" ? undefined : values[i].standard
                }
                onBlur={(e: any) => {
                  if (values.length > i) {
                    let newValues = Array.from(values);
                    newValues[i].standard = e.target.value;
                    setValues(newValues);
                  } else {
                    let newValues = Array.from(values);
                    newValues.push({ standard: e.target.value, hanzi: "" });
                    setValues(newValues);
                  }
                }}
              />
            );
          })}
        </div>
        <div className="w-full ml-2 lg:ml-10">
          <div className="mb-2 block">
            <Label htmlFor="small">Hanzi</Label>
          </div>
          <TextInput
            id="small"
            disabled={submitted}
            type="text"
            defaultValue={values[0].hanzi === "" ? undefined : values[0].hanzi}
            sizing="sm"
            onBlur={(e: any) => {
              if (values.length > 0) {
                let newValues = Array.from(values);
                newValues[0].hanzi = e.target.value;
                setValues(newValues);
              } else {
                let newValues = Array.from(values);
                newValues.push({ standard: e.target.value, hanzi: "" });
                setValues(newValues);
              }
            }}
          />
          {Array.from(Array(count - 1)).map((_, i) => {
            i++;
            return (
              <TextInput
                key={"han" + i}
                id="small"
                disabled={submitted}
                defaultValue={
                  values[i].hanzi === "" ? undefined : values[i].hanzi
                }
                type="text"
                sizing="sm"
                className="mt-5"
                onBlur={(e: any) => {
                  if (values.length > i) {
                    let newValues = Array.from(values);
                    newValues[i].hanzi = e.target.value;

                    setValues(newValues);
                  } else {
                    let newValues = Array.from(values);
                    newValues.push({ standard: "", hanzi: e.target.value });
                    setValues(newValues);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="flex w-full justify-around mt-5">
        <Button disabled={submitted} onClick={() => setCount(count + 1)}>
          Legg til
        </Button>
        <Button
          disabled={submitted}
          onClick={() => {
            setSubmitted(true);
            toast.promise(
              fetch("/api/flashcards/new", {
                method: "POST",
                body: JSON.stringify({
                  title,
                  description,
                  values,
                }),
              }).then(async (res) => {
                if (res.ok) {
                  return await res.json();
                } else {
                  setSubmitted(false);
                  throw new Error("Something went wrong");
                }
              }),
              {
                loading: "Lagrer...",
                success: (res) => {
                  return "Lagret!";
                },
                error: <b>Prøv igjen. Er alle tegn riktige?</b>,
              }
            );
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

function processQuizletLink(
  e,
  values: { standard: string; hanzi: string }[],
  setCount,
  setValues
) {
  quizletLinkToGloser(e.target.value)
    .then((res) => {

      let newValues: any = [];
      if (
        values.length > 1 ||
        !(values[0].hanzi === "" && values[0].standard === "")
      ) {
        // Remove the gloser that is already in values
        res.forEach((element) => {
          if (!values.includes(element)) newValues.push(element);
        });
      } else newValues.push(...res);

      setCount(newValues.length);
      setValues(newValues);
      toast.success("Fant " + newValues.length + " nye gloser");
    })
    .catch((err) => {
      console.error(err);
      toast.error(err.message);
    });
}

async function quizletLinkToGloser(url: string) {
  if (!url || url.length === 0 || !url.includes("https://quizlet.com/"))
    throw new Error("Invalid url");

  let id = url.split("quizlet.com/")[1].split("/")[0];
  let res: any = await fetch(`/api/gloser/create/quizlet/${id}`, {
    method: "GET",
  });
  res = await res.json();

  res.gloser = res.gloser.map((g: any) => {
    return {
      standard: g.Standard,
      hanzi: g.Chinese,
    };
  });

  return res.gloser;
}

export async function getStaticProps() {
  const res = await fetchAPI("/lister", {
    populate: {
      SEO: {
        populate: "*",
      },
    },
  });

  return {
    props: {
      page: res.data,
    },
    // TODO, make revalidation strapi dynamic?
    revalidate: 60 * 30, // In seconds, here it is 30 minutes
  };
}

export default Page;
