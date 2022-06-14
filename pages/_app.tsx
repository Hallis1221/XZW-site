/**
 * This is the entry point for the application. That is to say, every page in the application will be "underneath" this file. 
 * The following properties apply to the application as a whole, unless otherwise specified in the file.
 * @author Halvor Vivelstad.
 * @version 0.0.1
 * @license CCLC - Creative Commons Legal Code. 
 * @see https://github.com/Hallis1221/XZW-site/blob/main/license.md
 */

/* Types */
import type { AppProps } from "next/app";
/* Styles */
import "../styles/globals.css";
/* Components */
import GlobalContext from "context/global";
import { Seo } from "src/components/seo";
/* Next.js components */
import Link from "next/link";
import App from "next/app";
/* Flowbite components */
import { Navbar, Button, Spinner } from "flowbite-react";
/* React-hot-toast components */
import { Toaster } from "react-hot-toast/dist/components/toaster";
/* API calls */
import getGlobal from "strapi/global";
/* Hooks */
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { global, page } = pageProps;

  if (!global || !global.attributes)
    return (
      <div className="flex h-screen">
        <div className="m-auto">
          <div className="text-5xl font-semibold mb-64 text-center">
            Henter data
            <div className="text-2xl mt-5">
              (dette tar lenger tid enn det burde)
            </div>
          </div>
          <div className="flex h-0">
            <div className="m-auto">
              <Spinner aria-label="Extra large spinner example" size="xl" />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <>
    <Toaster/>
      <GlobalContext.Provider value={global.attributes || undefined}>
        <Seo pageSeo={page.attributes.seo} global={global.attributes} />
        {/* <Flowbite> */}
        <Navbar fluid={true} rounded={true}>
          <Navbar.Brand href="https://flowbite.com/">
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              {global.attributes.Sitename}
            </span>
          </Navbar.Brand>
          <div className="flex md:order-2">
            <Link href={global.attributes.ActionButton.href || ""}>
              <Button>
                {global.attributes.ActionButton.DisplayName || ""}
              </Button>
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

        <div className="m-10 ">
          <Component {...pageProps} />
        </div>

        {/* <div className="xl:absolute xl:bottom-0 w-screen -z-10">
          <Footer className="relative mt-10">
            <Footer.Copyright href="#" by="Halvor V" year={2022} />
            <Footer.LinkGroup className="mt-3 min-w-max flex-wrap items-center text-sm sm:mt-0">
              {global.attributes.Pages.map((page: any) => (
                <Footer.Link key={page.id} href={page.href}>
                  {page.DisplayName}
                </Footer.Link>
              ))}
            </Footer.LinkGroup>
          </Footer>
        </div> */}
        {/* </Flowbite> */}
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
