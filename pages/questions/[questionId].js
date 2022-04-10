import prisma from "lib/prisma";
import { getSession, useSession } from "next-auth/react";
import {
  Image,
  Link,
  Heading,
  Text,
  Flex,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  FormControl,
  FormLabel,
  Stack,
  FormErrorMessage,
  Textarea,
  OrderedList,
  ListItem,
  toast, Grid, GridItem
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import axios from "axios";
import { useForm } from "react-hook-form";
import AnswerCard from "components/AnswerCard";

export default function Question({ _question, caseId }) {
  const {
    id,
    courseId,
    userCaseId,
    question,
    courseName,
    attachment,
    publisherName,
    createdAt,
    answers,
  } = _question;

  const isUser = caseId === userCaseId;
  var hasAnswered = false;

  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: "onChange" });

  var i;
  for (i = 0; i < answers.length; i++) {
    if (hasAnswered) {
      i = answers.length;
    } else {
      const oneAnswer = answers[i];
      const {
        id,
        answer,
        questionId,
        userCaseId,
        publisherName,
        numThumbsUp,
        numThumbsDown,
        createdAt,
        readOrNot,
      } = oneAnswer;
      console.log(userCaseId);
      hasAnswered = caseId === userCaseId;
    }
  };
  console.log(hasAnswered)

  const onSubmit = async ({ answer }) => {
    setIsLoading(true);
    try {
      await axios.post("/api/protected/answers/post", {
        answer: answer,
        caseId: session.user.caseId,
        questionId: Number(id),
        publisherName: session.user.name,
      });

      /*
      router.push("/my-answers");
      toast({
        title: "Success",
        description: "Your answer has been posted.",
        status: "success",
        position: "bottom-left",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
      */

    } catch {
      toast({
        title: "An Error Ocurred",
        description: "Please try again",
        status: "error",
        variant: "left-accent",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <AttachmentModal
        isOpen={attachmentModalOpen}
        onClose={() => setAttachmentModalOpen(false)}
        attachment={attachment}
      />

      <Flex h="full" w="full" justify="center" mt={6} pos="relative">
        {attachment && (
          <Tooltip label="View attachment" placement="left">
            <IconButton
              icon={<GrAttachment />}
              pos="absolute"
              top="-3"
              right="1"
              onClick={() => setAttachmentModalOpen(true)}
            />
          </Tooltip>
        )}
        <Flex
          h="min-content"
          w="full"
          justify="center"
          align="center"
          direction="column"
          gap={1}
        >
          <Box
            as="form"
            rounded={"lg"}
            bg="#0A304E"
            color="#CDCDCD"
            boxShadow={"lg"}
            w="100%"
            p={10}
          >
            <Heading>{question}</Heading>

            <Text fontSize="lg">{courseName}</Text>
            <Text fontSize="md">
              Posted {new Date(createdAt).toLocaleDateString("en-us")} by{" "}
              <NextLink
                href={isUser ? "/my-profile" : `/profile/${userCaseId}`}
                passHref
              >
                <Link>{publisherName}</Link>
              </NextLink>
            </Text>
          </Box>

          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            rounded={"lg"}
            bg="white"
            boxShadow={"lg"}
            w="100%"
            p={10}
          >
            <Stack spacing={4}>
              <FormControl isInvalid={errors.answer} isRequired>
                <FormLabel htmlFor="answer">Answer</FormLabel>
                <Textarea
                  id="answer"
                  h="min-content"
                  type="text"
                  resize="none"
                  {...register("answer", {
                    required: "Enter an answer",
                    minLength: {
                      value: 10,
                      message: "Answer must be at least 10 characters",
                    },
                    maxLength: {
                      value: 5000,
                      message: "Answer must be less than 5000 characters",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.answer && errors.answer.message}
                </FormErrorMessage>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  isDisabled={!isValid || hasAnswered}
                  type="submit"
                  loadingText="Posting..."
                  spinnerPlacement="end"
                  isLoading={isLoading}
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
                  Post Answer
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            rounded={"lg"}
            bg="white"
            boxShadow={"lg"}
            w="100%"
            p={10}>

            <Heading fontSize="32">
              Posted Answers


            </Heading>

            {answers.map((answer) => (
              <Grid gap={4}>
                <AnswerCard _answer={answer} caseId = {caseId} />
              </Grid>
            ))}
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

function AttachmentModal({ isOpen, onClose, attachment }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w="fit-content" h="fit-content">
        <ModalCloseButton />
        <ModalHeader>Attachment</ModalHeader>
        <ModalBody>
          <Image
            src={attachment}
            alt="attachment"
            maxW="full"
            maxH="full"
            objectFit="cover"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export async function getServerSideProps({ params, req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const { courses, viewHistory, caseId } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      courses: true,
      viewHistory: true,
      caseId: true,
    },
  });

  if (!courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  try {
    const [id, courseId] = params.questionId.split("-");

    if (!courses.some((course) => course.id === Number(courseId))) {
      res.writeHead(302, { Location: "/questions" });
      res.end();
      return { props: {} };
    }

    const question = await prisma.question.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        question: true,
        attachment: true,
        courseId: true,
        courseName: true,
        userCaseId: true,
        publisherName: true,
        createdAt: true,
        views: true,
        answers: {
          orderBy: { numThumbsUp: 'desc' }
        },
      },
    });

    console.log(question);

    await prisma.history.upsert({
      where: {
        id:
          viewHistory.find((history) => history.questionId === Number(id))
            ?.id || -1,
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        questionId: Number(id),
        caseId: session.user.caseId,
      },
    });

    return {
      props: {
        _question: {
          ...question,
          views: question.views.map((view) => ({
            ...view,
            viewedAt: view.viewedAt.toISOString(),
          })),
          answers: question.answers.map((answer) => ({
            ...answer,
            createdAt: answer.createdAt.toISOString(),
          })),
          createdAt: question.createdAt.toISOString(),
        },
        caseId,
      },
    };
  } catch {
    res.writeHead(302, { Location: "/questions" });
    res.end();
    return { props: {} };
  }
}
