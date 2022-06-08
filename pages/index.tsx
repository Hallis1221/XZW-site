import Head from "next/head"
import Script from "next/script"

import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
    </>
  )
}

export async function getStaticProps(){
  
  return {
    props: {},
    // TODO, make revalidation strapi dynamic
    revalidate: 1
  }
}

export default Home
