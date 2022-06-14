import { Card, Button } from "flowbite-react";
import { GetStaticPropsContext, NextPage } from "next";
import Link from "next/link";
import getListe from "src/lib/pages/getListe";
import fetchAPI from "strapi/fetch";
import { Glose } from "types/glose";
import { MetaSeo } from "types/seo";

// TODO use strapi texts

const SpillPage: NextPage<any> = ({ id }) => {
  console.log("id", id);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="m-5 w-fit ">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Flashcards
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Reprehenderit et aute dolore minim nisi proident cupidatat magna ex
            incididunt velit deserunt. Ut ullamco veniam occaecat non sunt
            consectetur consequat. Est ipsum laborum magna non irure ipsum sit
            elit duis enim nulla proident incididunt deserunt.
          </p>
          <Link href={  "/lister/" + id +"/gjennomgang/flashcards/" } >
            <Button>
              Start å lære
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
      </div>
    </>
  );
};

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const res = await fetchAPI("/lister", {
    populate: {
      SEO: {
        populate: "*",
      },
    },
  });

  let { liste } = await getListe({ id: ctx.params?.id?.toString() });

  if (!liste) return { notFound: true };

  res.data.attributes.seo = {
    metaTitle: liste.title,
    metaDescription: liste.description,
    keywords: liste.gloser.map((glose: Glose) => glose.Standard).toString(),
  } as MetaSeo;

  return {
    props: {
      id: ctx.params?.id || null,

      page: res.data,
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

export default SpillPage;
