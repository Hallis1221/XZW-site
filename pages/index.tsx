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
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Log ut</button>
      </>
    );
  }
  return (
   <LoginComponent session={session} />
  );
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
      page: res.data,
    },
    // TODO, make revalidation strapi dynamic?
    revalidate: 60 * 30, // In seconds, here it is 30 minutes
  };
}

export default Home;
