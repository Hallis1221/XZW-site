/* Import types */
import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
/* Import API calls */
import fetchAPI from "strapi/fetch";

// TODO - type this
const Home: NextPage = ({ home }: any) => {
  const {data: session} = useSession();

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
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

