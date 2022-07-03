/* Import types */
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { LoginComponent } from "src/components/login";
/* Import API calls */
import fetchAPI from "strapi/fetch";

// TODO - type this
const Home: NextPage = ({ home }: any) => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="h-screen w-screen absolute top-0 left-0 bg-transparent -z-10">
        <div className="w-full h-full flex-col flex justify-center items-center bg-red-">
          <h1 className="text-center mb-16 font-light text-9xl tracking-widest ">你好!</h1>
 
        </div>
      </div>
    );
  }
  return <LoginComponent session={session} />;
};

export async function getStaticProps() {
  const res = await fetchAPI("/home", {
    populate: {
      seo: {
        populate: "*",
      },
    },
  });

  return {
    props: {
      page: res?.data || null,
    },
    // TODO, make revalidation strapi dynamic?
    revalidate: 60 * 30, // In seconds, here it is 30 minutes
  };
}

export default Home;
