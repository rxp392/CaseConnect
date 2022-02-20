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
  Radio,
  RadioGroup,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import NextLink from "next/link";
import { signIn } from "next-auth/react";
import AvatarRadio from "components/AvatarRadio";
import { IoReturnDownBackOutline } from "react-icons/io5";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import magic from "lib/magic";

export default function SignUp() {
  const [caseID, setCaseID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState("Gordon Ramsay");
  const [role, setRole] = useState("Student");
  const [recaptchaCompleted, setRecaptchaCompleted] = useState(false);

  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (process.env.NEXT_PUBLIC_ENV === "production") {
      const {
        data: { userExists },
      } = await axios.post("/api/auth/check-user-exists", {
        caseID,
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
        return setIsSubmitting(false);
      }
    }

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

    await signIn("signup", {
      didToken,
      role,
      avatar,
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/home`,
      redirect: false,
    });

    setIsSubmitting(false);
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      pb={4}
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
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={4} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
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
          <Stack spacing={6}>
            <FormControl id="email" isRequired>
              <FormLabel>CWRU Email</FormLabel>
              <InputGroup size="sm">
                <Input
                  placeholder="Case ID"
                  value={caseID}
                  onChange={(e) => setCaseID(e.target.value)}
                />
                <InputRightAddon children="@case.edu" />
              </InputGroup>
            </FormControl>
            <FormControl id="avatar">
              <FormLabel mb={7}>Profile Avatar</FormLabel>
              <AvatarRadio setAvatar={setAvatar} />
            </FormControl>
            <FormControl id="isTutor">
              <FormLabel>Are you a Student or a Tutor?</FormLabel>
              <RadioGroup value={role} onChange={setRole}>
                <Stack direction="row">
                  <Radio value="Student" defaultChecked>
                    Student
                  </Radio>
                  <Radio value="Tutor">Tutor</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
              onChange={(value) => {
                if (value) setRecaptchaCompleted(true);
              }}
              onExpired={() => setRecaptchaCompleted(false)}
              onErrored={() => setRecaptchaCompleted(false)}
            />
            <Stack spacing={10} pt={2}>
              <Button
                isDisabled={!recaptchaCompleted}
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
