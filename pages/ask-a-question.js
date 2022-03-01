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
  Link,
  SlideFade,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import prisma from "lib/prisma";
import { useRouter } from "next/router";
import NextLink from "next/link";

export default function AskQuestion({ courses }) {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const onSubmit = async ({ question, courseName, attachment }) => {
    try {
      const [_courseName, courseId] = courseName.split("|");

      const formData = new FormData();
      formData.append("question", question);
      formData.append("courseName", _courseName);
      formData.append("courseId", courseId);
      formData.append("caseId", session.user.caseId);
      formData.append("publisherName", session.user.name);
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
        position: "bottom-right",
        variant: "left-accent",
        duration: 9000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "An error occurred",
        description: "Please try again",
        status: "error",
        position: "bottom-right",
        variant: "left-accent",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <SlideFade offsetY="20px" in={true}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Box pos="absolute" bottom="4" right="4">
          <NextLink href="/add-a-course" color="cwru" passHref>
            <Link>Can&apos;t find your course?</Link>
          </NextLink>
        </Box>
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
                h="50px"
                maxH="200px"
                type="text"
                {...register("question", {
                  required: "Enter a question",
                  maxLength: {
                    value: 50,
                    message: "Maximum length should be 50",
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
                accept="image/*"
                {...register("attachment")}
                size="sm"
              />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Posting"
                spinnerPlacement="end"
                isLoading={isSubmitting}
                size="lg"
                bg="cwru"
                color="white"
                colorScheme="black"
                _active={{
                  transform: "scale(0.95)",
                }}
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

export async function getStaticProps() {
  const courses = await prisma.course.findMany({
    orderBy: {
      courseName: "asc",
    },
  });

  return {
    props: {
      courses,
    },
  };
}

AskQuestion.auth = true;
