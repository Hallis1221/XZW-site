import Head from "next/head"
import Script from "next/script"

import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <Script src="../path/to/flowbite/dist/flowbite.js" />
    </>
  )
}

export default Home
