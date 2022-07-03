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
import { Navbar, Button, Spinner, Dropdown, Avatar } from "flowbite-react";
/* React-hot-toast components */
import { Toaster } from "react-hot-toast";
/* API calls */
import getGlobal from "strapi/global";
/* Hooks */
import { useRouter } from "next/router";
/* Authentication */
import { SessionProvider, signOut, useSession } from "next-auth/react";
import md5 from "md5";

function MyApp({ Component, pageProps: pageProps }: AppProps) {
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
      <SessionProvider>
        <Toaster />
        <GlobalContext.Provider value={global?.attributes || undefined}>
          <Seo pageSeo={page?.attributes?.seo} global={global?.attributes} />
          {/* <Flowbite> */}
          <_NavBar global={global} />

          <div className="m-5 sm:m-10 ">
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
      </SessionProvider>
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

function _NavBar({ global }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          {global.attributes.Sitename}
        </span>
      </Navbar.Brand>
      <div className="flex order-1 md:order-2">
        {status == "authenticated" ? (
          <Dropdown
            arrowIcon={true}
            inline={true}
            label={
              <Avatar
                alt="User settings"
                img={session?.user?.image || `https://www.gravatar.com/avatar/${md5(session?.user?.email)}`}
                rounded={true}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{session?.user?.name}</span>
              <span className="block truncate text-sm font-medium">
                {session?.user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item >
              <Link
                href={global.attributes.ActionButton.href || ""}
              >
                {global.attributes.ActionButton.DisplayName || ""}
              </Link>
            </Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item>
              <button onClick={() => signOut()}>Log ut</button>
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link
            href={global.attributes.ActionButton.href || ""}
            className="w-screen"
          >
            <Button className="w-screen">
              {global.attributes.ActionButton.DisplayName || ""}
            </Button>
          </Link>
        )}

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
  );
}
