import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider, useSession } from "next-auth/react";

import Head from "next/head";
import theme from "theme";
import Sidebar from "components/Sidebar";
import Loader from "components/Loader";
import "@fontsource/ibm-plex-sans";

function App({ Component, pageProps: { session, ...pageProps } }) {
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
    <Sidebar
      caseId={session.user.caseId}
      name={session.user.name}
      subscription={session.user.subscription}
      profileImage={session.user.profileImage}
    >
      {children}
    </Sidebar>
  ) : (
    children
  );
}

export default App;
