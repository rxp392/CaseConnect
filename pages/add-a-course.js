import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  useToast,
  SlideFade,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { getSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AddCourse() {
  const toast = useToast();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = async ({ courseId, courseTitle }) => {
    try {
      await axios.post("/api/protected/courses/create", {
        courseName: `${courseId
          .toUpperCase()
          .split(" ")
          .join("")
          .split(/(\d+)/)
          .join(" ")
          .trim()}. ${courseTitle
          .toLowerCase()
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ")
          .trim()}`,
      });
      router.push("/my-courses");
      toast({
        title: "Success",
        description: "Your course has been created",
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
        position: "bottom-left",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <SlideFade in={true} offsetY="20px">
      <Heading textAlign={"center"}>Add your Course</Heading>
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
            <FormControl isInvalid={errors.courseId} isRequired>
              <FormLabel htmlFor="courseId">Course Id</FormLabel>
              <Input
                id="courseId"
                type="text"
                placeholder="CSDS 132"
                {...register("courseId", {
                  required: "Enter a course Id",
                })}
              />
            </FormControl>
            <FormControl isInvalid={errors.courseTitle} isRequired>
              <FormLabel htmlFor="courseTitle">Course Title</FormLabel>
              <Input
                id="courseTitle"
                type="text"
                placeholder="Introduction to Java"
                {...register("courseTitle", {
                  required: "Enter a course title",
                })}
              />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                isDisabled={!isValid}
                type="submit"
                loadingText="Adding"
                spinnerPlacement="end"
                isLoading={isSubmitting}
                size="lg"
                bg="cwru"
                color="white"
                colorScheme="black"
                _active={
                  isValid && {
                    transform: "scale(0.95)",
                  }
                }
                _hover={
                  isValid && {
                    backgroundColor: "rgba(10, 48, 78, 0.85)",
                  }
                }
              >
                Add Course
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

  return { props: {} };
}
