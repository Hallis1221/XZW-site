/* Types */
import type { NextPage } from "next";
/* Next.js components */
import Link from "next/link";
/* Flowbite components */
import { Button, Card } from "flowbite-react";
/* API calls */
import fetchAPI from "strapi/fetch";

// TODO - type this
const Page: NextPage = ({ page, gloser }: any) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {gloser.map((glose: any) => {
          return (
            <Card key={glose.id} className="m-5 w-fit ">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {glose.attributes.Title}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {glose.attributes.Description.substring(0, 200)}
                {glose.attributes.Description.length > 200 ? "..." : ""}
              </p>
              <Link href={"lister/" + glose.attributes.Title.toLowerCase() + "-" + glose.id + "/"}>
                <Button>
                  {glose.attributes.ActionTekst}
                  <svg
                    className="ml-2 -mr-1 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export async function getStaticProps() {
  const res = await fetchAPI("/lister", {
    populate: {
      SEO: {
        populate: "*",
      },
    },
  });

  const gloserRes = await fetchAPI("/glose-listes", {
    populate: {
      title: "*",
      description: "*",
    },
  });

  return {
    props: {
      page: res.data,
      gloser: gloserRes.data,
    },
    // TODO, make revalidation strapi dynamic?
    revalidate: 60 * 30, // In seconds, here it is 30 minutes
  };
}

export default Page;
