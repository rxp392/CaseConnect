import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputRightAddon,
  InputGroup,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { IoReturnDownBackOutline } from "react-icons/io5";
import ReCAPTCHA from "react-google-recaptcha";
import magic from "lib/magic";

export default function SignIn() {
  const toast = useToast();
  const [caseID, setCaseID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaCompleted, setRecaptchaCompleted] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const didToken = await magic.auth.loginWithMagicLink({
      email:
        process.env.NEXT_PUBLIC_ENV !== "production"
          ? "test+success@magic.link"
          : `${caseID}@case.edu`,
    });

    if (!didToken) {
      toast({
        title: "Unable to sign in",
        description: "Please try again.",
        status: "info",
        duration: 9000,
        variant: "left-accent",
        position: "bottom-right",
      });
      return setIsSubmitting(false);
    }

    const { ok } = await signIn("signin", {
      didToken,
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/home`,
      redirect: false,
    });
    if (!ok) {
      toast({
        title: "Account not found.",
        description: "Please sign up or try again.",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
        variant: "left-accent",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box position="absolute" top="10" left="10">
        <NextLink href="/" passHref>
          <Link
            color="blue.500"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <IoReturnDownBackOutline /> Back Home
          </Link>
        </NextLink>
      </Box>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          as="form"
          onSubmit={onSubmit}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>CWRU Email</FormLabel>
              <InputGroup size="sm">
                <Input
                  isRequired
                  placeholder="Case ID"
                  value={caseID}
                  onChange={(e) => setCaseID(e.target.value)}
                />
                <InputRightAddon children="@case.edu" />
              </InputGroup>
            </FormControl>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
              onChange={(value) => {
                if (value) setRecaptchaCompleted(true);
              }}
              onExpired={() => setRecaptchaCompleted(false)}
              onErrored={() => setRecaptchaCompleted(false)}
            />
            <Stack spacing={10}>
              <Button
                isDisabled={!recaptchaCompleted}
                type="submit"
                loadingText="Authenticating"
                spinnerPlacement="end"
                isLoading={isSubmitting}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={1}>
              <Text align={"center"}>
                Don't have an account?{" "}
                <NextLink href="/signup" passHref>
                  <Link color="blue.500">Sign up</Link>
                </NextLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
