import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Select,
  FormErrorMessage,
  useToast,
  Textarea,
  SlideFade,
  Heading,
  FormHelperText,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { getSession, useSession } from "next-auth/react";
import prisma from "lib/prisma";
import { useRouter } from "next/router";

export default function AskQuestion({ courses }) {
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = async ({ question, courseName, attachment }) => {
    try {
      const [_courseName, courseId] = courseName.split("|");

      const capitalizedQuestion =
        question.charAt(0).toUpperCase() + question.slice(1);

      const formData = new FormData();
      formData.append("question", capitalizedQuestion.trim());
      formData.append("courseName", _courseName);
      formData.append("courseId", courseId);
      formData.append("caseId", session.user.caseId);
      formData.append("publisherName", session.user.name);
      formData.append("userImage", session.user.image);
      formData.append("attachment", attachment[0]);
      await fetch("/api/protected/questions/post", {
        method: "POST",
        body: formData,
      });
      router.push("/questions");
      toast({
        title: "Success",
        description: "Your question has been posted.",
        status: "success",
        position: "bottom-left",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "An error occurred",
        description: "Please try again",
        status: "error",
        position: "bottom-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <SlideFade in={true} offsetY="20px">
      <Heading textAlign={"center"}>Ask your question</Heading>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          rounded={"lg"}
          bg="white"
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl isInvalid={errors.question} isRequired>
              <FormLabel htmlFor="question">Question</FormLabel>
              <Textarea
                id="question"
                h="min-content"
                type="text"
                resize="none"
                {...register("question", {
                  required: "Enter a question",
                  minLength: {
                    value: 10,
                    message: "Question must be at least 10 characters",
                  },
                  maxLength: {
                    value: 250,
                    message: "Question must be less than 250 characters",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.question && errors.question.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.courseName} isRequired>
              <FormLabel htmlFor="courseName">Course</FormLabel>
              <Select
                placeholder={"Select a course"}
                id="courseName"
                {...register("courseName", {
                  required: "Pick a course",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              >
                {courses.map(({ id, courseName }) => (
                  <option key={id} value={`${courseName}|${id}`}>
                    {courseName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Attachment</FormLabel>
              <Input
                type="file"
                id="attachment"
                accept="image/jpg, image/jpeg"
                {...register("attachment")}
                size="sm"
              />
              <FormHelperText>
                Only .jpg and .jpeg files are allowed
              </FormHelperText>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                isDisabled={!isValid}
                type="submit"
                loadingText="Posting..."
                spinnerPlacement="end"
                isLoading={isSubmitting}
                size="lg"
                bg="cwru"
                color="white"
                colorScheme="black"
                _hover={
                  isValid && {
                    backgroundColor: "rgba(10, 48, 78, 0.85)",
                  }
                }
              >
                Post Question
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </SlideFade>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const { courses } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      courses: true,
    },
  });

  if (!courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  return {
    props: {
      courses,
    },
  };
}
