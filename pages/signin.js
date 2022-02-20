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
  FormErrorMessage,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRef } from "react";
import { signIn } from "next-auth/react";
import { IoReturnDownBackOutline } from "react-icons/io5";
import ReCAPTCHA from "react-google-recaptcha";
import magic from "lib/magic";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function SignIn() {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const reRef = useRef();

  const onSubmit = async ({ caseID }) => {
    return new Promise(async (resolve) => {
      const token = await reRef.current.executeAsync();
      reRef.current.reset();

      const {
        data: { success },
      } = await axios.post("/api/auth/verify-human", { token });

      if (!success) {
        toast({
          title: "Unable to verify human",
          description: "Please try again.",
          status: "info",
          duration: 9000,
          variant: "left-accent",
          position: "bottom-right",
        });
        return resolve();
      }

      const {
        data: { userExists },
      } = await axios.post("/api/auth/check-user-exists", {
        caseID,
      });

      if (!userExists) {
        toast({
          title: "Account not found.",
          description: "Please sign up or try again.",
          status: "info",
          duration: 9000,
          variant: "left-accent",
          position: "bottom-right",
        });
        return resolve();
      }

      const didToken = await magic.auth.loginWithMagicLink({
        email: `${caseID}@case.edu`,
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
      resolve();
    });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box position="absolute" top="2.5%" left="2%">
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
          <Heading fontSize={"4xl"}>Sign in</Heading>
        </Stack>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl isInvalid={errors.caseID} isRequired>
              <FormLabel htmlFor="caseID">CWRU Email</FormLabel>
              <InputGroup size="sm">
                <Input
                  id="caseID"
                  type="text"
                  placeholder="Case ID"
                  {...register("caseID", {
                    required: "This is required",
                    minLength: {
                      value: 4,
                      message: "Minimum length should be 4",
                    },
                  })}
                />
                <InputRightAddon children="@case.edu" />
              </InputGroup>
              <FormErrorMessage>
                {errors.caseID && errors.caseID.message}
              </FormErrorMessage>
            </FormControl>

            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
              ref={reRef}
              size="invisible"
              badge="bottomright"
            />

            <Stack spacing={10}>
              <Button
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
