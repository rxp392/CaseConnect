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
import axios from "axios";
import NextLink from "next/link";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);
export default function Ask() {
  const { data } = useSWR("/courses.json", fetcher);
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const onSubmit = async ({ question, courseName, attachment }) => {
    const [title, courseNumber] = courseName.split("-").map((s) => s.trim());
    console.log({
      question,
      title,
      courseNumber,
      attachment,
    });
    // const {
    //   data: { success },
    // } = await axios.post("/api/questions/protected/post", {
    //   ...data,
    //   userCaseID: session.user.caseID,
    // });
    // alert(success);

    // let res;

    // if (profileImage.length) {
    //   const formData = new FormData();
    //   formData.append("file", profileImage[0]);
    //   formData.append("upload_preset", "profile-images");

    //   res = await axios.post(
    //     "https://api.cloudinary.com/v1_1/case-connect/image/upload",
    //     formData
    //   );
    // }
  };

  const onError = (error) => {};

  return (
    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Box pos="absolute" bottom="4" right="4">
        <NextLink href="/course-request" color="cwru" passHref>
          <Link>Can't find your course?</Link>
        </NextLink>
      </Box>
      <Box
        as="form"
        onSubmit={(e) => handleSubmit(onSubmit)(e).catch(onError)}
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
              maxH="200px"
              type="text"
              {...register("question", {
                required: "This is required",
                minLength: {
                  value: 4,
                  message: "Minimum length should be 4",
                },
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
              placeholder={
                data?.length ? "Select a course" : "Loading courses..."
              }
              id="courseName"
              {...register("courseName", {
                required: "This is required",
                minLength: {
                  value: 4,
                  message: "Minimum length should be 4",
                },
              })}
            >
              {data?.map(({ courseNumber, title }) => (
                <option key={courseNumber} value={`${courseNumber} - ${title}`}>
                  {courseNumber} - {title}
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
  );
}

Ask.auth = true;
