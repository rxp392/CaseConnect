import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import NextLink from "next/link";
import { signIn } from "next-auth/react";
import AvatarRadio from "components/AvatarRadio";
import { IoReturnDownBackOutline } from "react-icons/io5";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import magic from "lib/magic";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const [avatar, setAvatar] = useState("Gordon Ramsay");

  const reRef = useRef();

  const toast = useToast();

  const onSubmit = async (values) => {
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
        caseID: values.caseID,
      });

      if (userExists) {
        toast({
          title: "Account already exists.",
          description: "Please sign in or try again.",
          status: "info",
          duration: 9000,
          variant: "left-accent",
          position: "bottom-right",
        });
        return resolve();
      }

      const didToken = await magic.auth.loginWithMagicLink({
        email: `${values.caseID}@case.edu`,
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
        return resolve();
      }

      await signIn("signup", {
        didToken,
        ...values,
        avatar,
        callbackUrl: `${process.env.NEXT_PUBLIC_URL}/home`,
        redirect: false,
      });
      resolve();
    });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      pb={4}
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
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={4} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={6}>
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
            <FormControl isInvalid={errors.fullName} isRequired>
              <FormLabel htmlFor="fullName">Full Name</FormLabel>
              <Input
                type="text"
                id="fullName"
                {...register("fullName", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
                size="sm"
              />
              <FormErrorMessage>
                {errors.fullName && errors.fullName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.userName} isRequired>
              <FormLabel htmlFor="userName">Username</FormLabel>
              <Input
                type="text"
                id="userName"
                {...register("userName", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
                size="sm"
              />
              <FormErrorMessage>
                {errors.userName && errors.userName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel mb={7}>Profile Avatar</FormLabel>
              <AvatarRadio setAvatar={setAvatar} />
            </FormControl>

            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
              ref={reRef}
              size="invisible"
              badge="bottomright"
            />

            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Registering"
                spinnerPlacement="end"
                isLoading={isSubmitting}
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Stack>
              <Text align={"center"}>
                Have an account?{" "}
                <NextLink href="/signin" passHref>
                  <Link color="blue.500">Sign in</Link>
                </NextLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
