import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  FormErrorMessage,
  useToast,
  SlideFade,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateCourse() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async ({ courseNumber, courseTitle }) => {
    try {
      await axios.post("/api/protected/courses/post", {
        courseName: `${courseNumber}. ${courseTitle}`,
      });
      router.push("/ask");
      toast({
        title: "Success",
        description: "Your course has been created.",
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
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          rounded={"lg"}
          bg="white"
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl isInvalid={errors.courseNumber} isRequired>
              <FormLabel htmlFor="courseNumber">Course Number</FormLabel>
              <Input
                placeholder="e.g. ACCT 101"
                id="courseNumber"
                minW="280px"
                maxW="280px"
                type="text"
                {...register("courseNumber", {
                  required: "Enter a course number",
                })}
              />
              <FormErrorMessage>
                {errors.courseNumber && errors.courseNumber.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.courseTitle} isRequired>
              <FormLabel htmlFor="courseTitle">Course Title</FormLabel>
              <Input
                placeholder="e.g. Foundations of Accounting I"
                id="courseTitle"
                minW="280px"
                maxW="280px"
                type="text"
                {...register("courseTitle", {
                  required: "Enter a course title",
                })}
              />
              <FormErrorMessage>
                {errors.courseTitle && errors.courseTitle.message}
              </FormErrorMessage>
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Adding course"
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
                Add Course
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </SlideFade>
  );
}

CreateCourse.auth = true;
