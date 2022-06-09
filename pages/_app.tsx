import "../styles/globals.css";
import type { AppProps } from "next/app";
import fetchAPI from "strapi/fetch";
import Head from "next/head";
import { getStrapiMedia } from "strapi/media";
import GlobalContext from "context/global";
import getGlobal from "strapi/global";
import App from "next/app";
import { Navbar, Button } from "flowbite-react";
import { useRouter } from "next/router";
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  let { global } = pageProps;

  if (!global || !global.attributes)
    console.warn("Global context is not available");

  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          href={getStrapiMedia(global.attributes.Favicon)}
        />

        {/* Meta title */}
        <title>{global.attributes.SEO.Title}</title>

        {/* Meta images */}
        <meta
          property="og:image"
          content={getStrapiMedia(global.attributes.SEO.ShareImage)}
        />
        <meta
          name="twitter:image"
          content={getStrapiMedia(global.attributes.SEO.ShareImage)}
        />
        <meta
          name="image"
          content={getStrapiMedia(global.attributes.SEO.ShareImage)}
        />

        {/* Meta description */}
        <meta name="description" content={global.attributes.SEO.Description} />
        <meta
          property="og:description"
          content={global.attributes.SEO.Description}
        />
        <meta
          name="twitter:description"
          content={global.attributes.SEO.Description}
        />
      </Head>

      <GlobalContext.Provider value={global.attributes || undefined}>
        <Navbar fluid={true} rounded={true}>
          <Navbar.Brand href="https://flowbite.com/">
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              {global.attributes.Sitename}
            </span>
          </Navbar.Brand>
          <div className="flex md:order-2">
            <Link href={global.attributes.ActionButton.href}>
              <Button>{global.attributes.ActionButton.DisplayName}</Button>
            </Link>
            <Navbar.Toggle />
          </div>
          <Navbar.Collapse>
            {global.attributes.Pages.map((page: any) => (
              <Navbar.Link
                key={page.id}
                href={page.href}
                active={router.pathname === page.href ? true : false}
              >
                {page.DisplayName}
              </Navbar.Link>
            ))}
          </Navbar.Collapse>
        </Navbar>

        <Component {...pageProps} />
      </GlobalContext.Provider>
    </>
  );
}

MyApp.getInitialProps = async (ctx: any) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(ctx);

  // Pass the data to our page via props
  return { ...appProps, pageProps: { global: await getGlobal() } };
};

export default MyApp;
