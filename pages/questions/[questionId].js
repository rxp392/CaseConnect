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
  FormErrorMessage,
  Textarea,
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  SlideFade,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import AnswerCard from "components/AnswerCard";
import { ImAttachment } from "react-icons/im";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/router";
import { IoCheckmarkSharp } from "react-icons/io5";

export default function Question({ _question, caseId }) {
  const {
    id,
    userCaseId,
    question,
    courseName,
    attachment,
    publisherName,
    createdAt,
    answers,
  } = _question;

  const [questionText, setQuestionText] = useState(question);
  const [questionAnswers, setQuestionAnswers] = useState(answers);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editAlertOpen, setEditAlertOpen] = useState(false);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = useRef();
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const isUser = caseId === userCaseId;
  const hasAnswered = questionAnswers.some(
    (answer) => answer.userCaseId === session.user.caseId
  );

  return (
    <>
      <Flex h="full" w="full" justify="center" pos="relative">
        <Flex
          h="min-content"
          w="full"
          justify="center"
          align="center"
          direction="column"
        >
          <SlideFade in={true} offsetY="20px">
            <Flex
              rounded={"lg"}
              bg="cwru"
              color="gray.200"
              boxShadow={"lg"}
              p={[4, 6]}
              justifyContent="space-between"
              alignItems="center"
              direction={["column", "row"]}
              w="100%"
            >
              <Flex
                alignItems="center"
                justifyContent="center"
                direction="column"
                gap={2}
                textAlign="center"
              >
                <Heading>{questionText}</Heading>
                <Text fontSize={["md", "lg"]}>{courseName}</Text>
                <Text fontSize={["sm", "md"]}>
                  Posted {new Date(createdAt).toLocaleDateString("en-us")} by{" "}
                  <NextLink
                    href={isUser ? "/my-profile" : `/profile/${userCaseId}`}
                    passHref
                  >
                    <Link>
                      {publisherName} {isUser && "(you)"}
                    </Link>
                  </NextLink>
                </Text>
                {(attachment || isUser) && (
                  <ButtonGroup isAttached alignSelf={"center"} mt={1.5}>
                    {attachment && (
                      <>
                        <Tooltip label="View Attachment">
                          <IconButton
                            p={2.5}
                            size={["sm", "md"]}
                            fontSize={["md", "lg"]}
                            bg="cwru"
                            color="white"
                            colorScheme="black"
                            _hover={{
                              backgroundColor: "rgba(10, 48, 78, 0.85)",
                            }}
                            icon={<ImAttachment />}
                            onClick={() => setAttachmentModalOpen(true)}
                            isDisabled={isLoading}
                          />
                        </Tooltip>
                        &nbsp;
                      </>
                    )}
                    {isUser && (
                      <>
                        <Tooltip label="Edit Question">
                          <IconButton
                            p={2.5}
                            size={["sm", "md"]}
                            fontSize={["sm", "md"]}
                            bg="cwru"
                            color="white"
                            colorScheme="black"
                            _hover={{
                              backgroundColor: "rgba(10, 48, 78, 0.85)",
                            }}
                            icon={<FiEdit />}
                            onClick={() => setEditAlertOpen(true)}
                            isDisabled={isLoading}
                          />
                        </Tooltip>
                        &nbsp;
                        <Tooltip label="Delete Question">
                          <IconButton
                            p={2.5}
                            size={["sm", "md"]}
                            fontSize={["md", "lg"]}
                            bg="cwru"
                            color="white"
                            colorScheme="black"
                            _hover={{
                              backgroundColor: "rgba(10, 48, 78, 0.85)",
                            }}
                            icon={<BsFillTrashFill />}
                            onClick={() => setDeleteAlertOpen(true)}
                            isDisabled={isLoading}
                          />
                        </Tooltip>
                      </>
                    )}
                  </ButtonGroup>
                )}
              </Flex>
            </Flex>
          </SlideFade>

          <SlideFade in={true} offsetY="20px">
            <Box mt={8}>
              {!hasAnswered && !isUser && (
                <Button
                  leftIcon={<IoCheckmarkSharp />}
                  variant="solid"
                  onClick={() => setAnswerModalOpen(true)}
                  colorScheme="green"
                >
                  Answer Question
                </Button>
              )}
            </Box>
          </SlideFade>

          {questionAnswers.length > 0 ? (
            <Box rounded={"lg"} w="100%" p={6}>
              <SlideFade in={true} offsetY="20px">
                <Heading textAlign={"center"} fontSize="32" mb={4}>
                  Posted Answers
                </Heading>
              </SlideFade>
              {questionAnswers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  _answer={answer}
                  caseId={caseId}
                  answers={questionAnswers}
                  setAnswers={setQuestionAnswers}
                />
              ))}
            </Box>
          ) : (
            <SlideFade in={true} offsetY="20px">
              <Heading mt={36} fontSize={["xl", "2xl", "3xl"]}>
                No Answers Have Been Posted 😥
              </Heading>
            </SlideFade>
          )}
        </Flex>
      </Flex>

      <AttachmentModal
        isOpen={attachmentModalOpen}
        onClose={() => setAttachmentModalOpen(false)}
        attachment={attachment}
      />
      <AnswerModal
        answers={questionAnswers}
        setAnswers={setQuestionAnswers}
        answerModalOpen={answerModalOpen}
        setAnswerModalOpen={setAnswerModalOpen}
        cancelRef={cancelRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        caseId={caseId}
        userCaseId={userCaseId}
        id={id}
        publisherName={publisherName}
        toast={toast}
      />
      <EditAlert
        id={id}
        editAlertOpen={editAlertOpen}
        setEditAlertOpen={setEditAlertOpen}
        cancelRef={cancelRef}
        toast={toast}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        question={questionText}
        setQuestion={setQuestionText}
      />
      <DeleteAlert
        cancelRef={cancelRef}
        deleteAlertOpen={deleteAlertOpen}
        setDeleteAlertOpen={setDeleteAlertOpen}
        toast={toast}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        id={id}
        attachment={attachment}
        router={router}
      />
    </>
  );
}

function AnswerModal({
  answers,
  setAnswers,
  answerModalOpen,
  setAnswerModalOpen,
  cancelRef,
  isLoading,
  setIsLoading,
  caseId,
  userCaseId,
  id,
  publisherName,
  toast,
}) {
  const [answer, setAnswer] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setAnswer("");
    setIsDisabled(true);
    setErrorMessage("");
  }, [answerModalOpen]);

  return (
    <AlertDialog
      isOpen={answerModalOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setAnswerModalOpen(false)}
      isCentered
      trapFocus={false}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Answer Question
            </AlertDialogHeader>
            <AlertDialogBody>
              <FormControl isInvalid={errorMessage}>
                <Textarea
                  id="question"
                  placeholder={"Your answer..."}
                  value={answer}
                  h="min-content"
                  type="text"
                  resize="none"
                  onChange={(e) => {
                    const value = e.target.value;
                    setAnswer(value);
                    if (value.length == 0) {
                      setErrorMessage("Question cannot be empty");
                      setIsDisabled(true);
                    } else if (value.length < 10) {
                      setErrorMessage(
                        "Question must be at least 10 characters"
                      );
                      setIsDisabled(true);
                    } else if (value.length > 250) {
                      setErrorMessage(
                        "Question must be less than 250 characters"
                      );
                      setIsDisabled(true);
                    } else {
                      setErrorMessage("");
                      setIsDisabled(false);
                    }
                  }}
                />
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
              </FormControl>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setAnswerModalOpen(false)}>
                Cancel
              </Button>
              <Button
                isDisabled={isDisabled}
                colorScheme="blue"
                loadingText="Posting..."
                spinnerPlacement="end"
                isLoading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const { answerId, createdAt } = await axios.post(
                      "/api/protected/answers/post",
                      {
                        answer: answer.trim(),
                        caseId,
                        userCaseId,
                        questionId: Number(id),
                        publisherName,
                      }
                    );
                    setAnswers([
                      ...answers,
                      {
                        id: answerId,
                        answer: answer.trim(),
                        questionId: id,
                        userCaseId: caseId,
                        publisherName,
                        numThumbsUp: 0,
                        numThumbsDown: 0,
                        createdAt,
                      },
                    ]);
                    toast({
                      title: "Answer Posted",
                      description: "Your answer has been posted",
                      status: "success",
                      variant: "left-accent",
                      position: "bottom-left",
                      duration: 5000,
                      isClosable: true,
                    });
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
                    setAnswerModalOpen(false);
                  }
                }}
                ml={3}
              >
                Post
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

function AttachmentModal({ isOpen, onClose, attachment }) {
  return (
    <SlideFade in={true} offsetY="20px">
      <Modal isOpen={isOpen} onClose={onClose} isCentered trapFocus={false}>
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
    </SlideFade>
  );
}

function EditAlert({
  id,
  editAlertOpen,
  setEditAlertOpen,
  cancelRef,
  toast,
  isLoading,
  setIsLoading,
  question,
  setQuestion,
}) {
  const [questionText, setQuestionText] = useState(question);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsDisabled(true);
  }, [editAlertOpen]);

  return (
    <AlertDialog
      isOpen={editAlertOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setEditAlertOpen(false)}
      isCentered
      trapFocus={false}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Edit Question
            </AlertDialogHeader>
            <AlertDialogBody>
              <FormControl isInvalid={errorMessage}>
                <Textarea
                  id="question"
                  placeholder={questionText}
                  value={questionText}
                  h="min-content"
                  type="text"
                  resize="none"
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuestionText(value);
                    if (value.length == 0) {
                      setErrorMessage("Question cannot be empty");
                      setIsDisabled(true);
                    } else if (value.length < 10) {
                      setErrorMessage(
                        "Question must be at least 10 characters"
                      );
                      setIsDisabled(true);
                    } else if (value.length > 250) {
                      setErrorMessage(
                        "Question must be less than 250 characters"
                      );
                      setIsDisabled(true);
                    } else {
                      setErrorMessage("");
                      setIsDisabled(false);
                    }
                  }}
                />
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
              </FormControl>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setEditAlertOpen(false)}>
                Cancel
              </Button>
              <Button
                isDisabled={isDisabled || question === questionText}
                colorScheme="blue"
                loadingText="Updating..."
                spinnerPlacement="end"
                isLoading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await axios.post("/api/protected/questions/update", {
                      id,
                      question: questionText.trim(),
                    });
                    setQuestion(questionText);
                    toast({
                      title: "Question Updated",
                      description: "Your question has been updated",
                      status: "success",
                      variant: "left-accent",
                      position: "bottom-left",
                      duration: 5000,
                      isClosable: true,
                    });
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
                    setEditAlertOpen(false);
                  }
                }}
                ml={3}
              >
                Update
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

function DeleteAlert({
  cancelRef,
  deleteAlertOpen,
  setDeleteAlertOpen,
  toast,
  isLoading,
  setIsLoading,
  id,
  attachment,
  router,
}) {
  return (
    <AlertDialog
      isOpen={deleteAlertOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setDeleteAlertOpen(false)}
      isCentered
      trapFocus={false}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Question
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this question?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeleteAlertOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                loadingText="Deleting..."
                spinnerPlacement="end"
                isLoading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await axios.delete("/api/protected/questions/delete", {
                      data: {
                        id,
                        attachment,
                      },
                    });
                    router.push("/questions");
                    toast({
                      title: "Question Deleted",
                      description: "Your question has been deleted",
                      status: "success",
                      variant: "left-accent",
                      position: "bottom-left",
                      duration: 5000,
                      isClosable: true,
                    });
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
                    setDeleteAlertOpen(false);
                  }
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
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
          select: {
            id: true,
            answer: true,
            questionId: true,
            userCaseId: true,
            publisherName: true,
            thumbsUp: true,
            thumbsDown: true,
            createdAt: true,
          },
        },
      },
    });

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
          answers: question.answers
            .sort((a, b) => {
              return b.answer.length - a.answer.length;
            })
            .map((answer) => ({
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
