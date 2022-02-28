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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import NextLink from "next/link";
import { useSession } from "next-auth/react";

export default function CreateCourse() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const onSubmit = ({ courseNumber, courseTitle }) => {};

  return (
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
              Add Course
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}

CreateCourse.auth = true;
