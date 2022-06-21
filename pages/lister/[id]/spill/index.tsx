import { Card, Button } from "flowbite-react";
import { GetStaticPropsContext, NextPage } from "next";
import Link from "next/link";
import getListe from "src/lib/pages/getListe";
import fetchAPI from "strapi/fetch";
import { Glose } from "types/glose";
import { MetaSeo } from "types/seo";

// TODO use strapi texts

const SpillPage: NextPage<any> = ({ id, page }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <GameMode
          title={page.attributes.Flashcard.Title}
          description={page.attributes.Flashcard.Description}
          page={page}
          href={"/lister/" + id + "/gjennomgang/flashcards/"}
        />
        <GameMode
          title={"Multiple choice"}
          description={page.attributes.Flashcard.Description}
          page={page}
          href={"/lister/" + id + "/test/choices"}
        />
      </div>
    </>
  );
};

function GameMode({ title, description, href, page }) {
  return (
    <Card className="m-5 w-fit ">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {description.substring(0, 200)}
        {description.length > 200 ? "..." : ""}
      </p>
      <Link href={href}>
        <Button>
          {page.attributes.ActionTekst}
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
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const seoRes = await fetchAPI("/lister", {
    populate: {
      SEO: {
        populate: "*",
      },
    },
  });

  const pageRes = await fetchAPI("/spill", {
    populate: {
      Flashcard: {
        populate: "*",
      },
    },
  });

  let { liste } = await getListe({ id: ctx.params?.id?.toString() });

  if (!liste) return { notFound: true };

  seoRes.data.attributes.seo = {
    metaTitle: liste.title,
    metaDescription: liste.description,
    keywords: liste.gloser.map((glose: Glose) => glose.Standard).toString(),
  } as MetaSeo;

  let res: any = { data: {} };
  res.data = {
    ...seoRes.data,
    ...pageRes.data,
  };

  return {
    props: {
      id: ctx.params?.id || null,
      page: res.data,
    },
    revalidate: 60*5,

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
