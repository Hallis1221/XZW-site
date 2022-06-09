import { Toast } from "flowbite-react";
import getGlobal from "strapi/global";
import { XIcon } from "@heroicons/react/solid";
import fetchAPI from "strapi/fetch";

export default function Custom404({page}: any) {
  return (
    <div className="w-screen  flex flex-col items-center">
      <Toast>
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
          <XIcon className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">
        {page.attributes.ErrorMessage}
        </div>
        <Toast.Toggle />
      </Toast>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetchAPI("/not-found", {
    populate: {
      ErrorMessage: "*",
    },
  });

  return {
    props: {
      global: await getGlobal(),
      page: res.data,
    },
    // TODO, make revalidation strapi dynamic
    revalidate: 3000,
  };
}
