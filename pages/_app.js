import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import theme from "theme";
import Sidebar from "components/Sidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "components/Loader";
import "@fontsource/saira-stencil-one";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <title>Case Connect</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Auth auth={Component.auth}>
            <Component {...pageProps} />
          </Auth>
        </ChakraProvider>
      </SessionProvider>
    </>
  );
}

function Auth({ children, auth }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (status === "loading") return;
    if (auth && !isUser) router.push("/");
    else if (!auth && isUser) router.push("/home");
  }, [isUser, status, auth, router]);

  if (auth && isUser) {
    return (
      <Sidebar
        profileImage={session.user.image}
        caseId={session.user.caseId}
        name={session.user.name}
        subscription={session.user.subscription}
      >
        {children}
      </Sidebar>
    );
  } else if (!auth && !isUser) return children;

  return <Loader />;
}

export default App;
