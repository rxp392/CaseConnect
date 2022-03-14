import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import theme from "theme";
import Sidebar from "components/Sidebar";
import Loader from "components/Loader";
import "@fontsource/saira-stencil-one";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <title>Case Connect</title>
      </Head>
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Auth isProtected={Boolean(Component.isProtected)}>
            <Component {...pageProps} />
          </Auth>
        </ChakraProvider>
      </SessionProvider>
    </>
  );
}

function Auth({ isProtected, children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isUser = !!session?.user;

  useEffect(() => {
    if (status === "loading") return;
    if (isProtected && !isUser) router.push("/");
    else if (!isProtected && isUser) router.push("/questions");
  }, [isUser, status, isProtected, router]);

  if (isProtected && isUser) {
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
  } else if (!isProtected && !isUser) return children;

  return <Loader />;
}

export default App;
