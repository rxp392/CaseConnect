import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Center,
  Link,
  useToast,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Index() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  useEffect(() => {
    if (params.error === "AccessDenied") {
      window.history.replaceState(null, "", `${process.env.NEXT_PUBLIC_URL}/`);
      toast({
        title: "Access Denied",
        description: "You must have a CWRU email to login",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom-left",
        variant: "left-accent",
      });
    }
  }, [params.error]);

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={3} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Text color={"cwru"} as={"span"}>
              Case Connect
            </Text>
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"} pb={5}>
            Conquer any{" "}
            <Link color="cwru" href="https://case.edu/" target="_blank">
              CWRU
            </Link>{" "}
            course with ease.
          </Text>

          <Flex align="start" flexDirection="column" gap={4}>
            <Center>
              <Button
                type="submit"
                loadingText="Authenticating..."
                spinnerPlacement="end"
                isLoading={isSubmitting}
                w={"full"}
                maxW={"md"}
                py={6}
                leftIcon={<FcGoogle />}
                bg="cwru"
                color="white"
                colorScheme="black"
                onClick={() => {
                  setIsSubmitting(true);
                  signIn("google", {
                    callbackUrl: `${process.env.NEXT_PUBLIC_URL}/questions`,
                  });
                }}
                _hover={{
                  backgroundColor: "rgba(10, 48, 78, 0.85)",
                }}
              >
                <Center>
                  <Text>Continue with Google</Text>
                </Center>
              </Button>
            </Center>
          </Flex>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          }
        />
      </Flex>
    </Stack>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (session) {
    res.writeHead(302, { Location: "/questions" });
    res.end();
  }

  return {
    props: {},
  };
}
