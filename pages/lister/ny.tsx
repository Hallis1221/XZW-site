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
  quizletLinkToGloser().then((res) => { console.log(res) });
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
            setDescription(e.target.value);
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
                key={"han" + i}
                id="small"
                type="text"
                disabled={submitted}
                sizing="sm"
                className="mt-5"
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
                key={"PIN" + i}
                id="small"
                disabled={submitted}
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

async function quizletLinkToGloser() {
  const res = await fetch(
    "https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=663259712&filters%5BstudiableContainerType%5D=1&perPage=5&page=1"
  );
  return res;
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
