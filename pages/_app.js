import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import theme from "theme";
import Sidebar from "components/Sidebar";
import Loader from "components/Loader";
import "@fontsource/ibm-plex-sans";
import { useEffect } from "react";
import splitbee from "@splitbee/web";

function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      splitbee.init({
        apiUrl: "/sb-api",
        scriptUrl: "/sb.js",
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Case Connect</title>
      </Head>
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </ChakraProvider>
      </SessionProvider>
    </>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loader />;

  return status === "authenticated" ? (
    <Sidebar caseId={session.user.caseId}>{children}</Sidebar>
  ) : (
    children
  );
}

export default App;
