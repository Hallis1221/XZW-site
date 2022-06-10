import "../styles/globals.css";
import type { AppProps } from "next/app";
import GlobalContext from "context/global";
import getGlobal from "strapi/global";
import { Navbar, Button, Flowbite, Spinner, Footer } from "flowbite-react";
import { useRouter } from "next/router";
import Link from "next/link";
import App from "next/app";
import { Seo } from "src/components/seo";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  /* This is a implementation of getInitialProps for the client side.  
  let [global, setGlobal]: any = useState({});

  useEffect(() => {
    getGlobal().then((global) => {
      setGlobal(global);
    });
  }, []);

  */

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
