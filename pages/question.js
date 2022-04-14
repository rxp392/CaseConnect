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
  Radio,
  Stack,
  RadioGroup,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import AnswerCard from "components/AnswerCard";
import { ImAttachment } from "react-icons/im";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/router";
import { IoCheckmarkSharp, IoFilterSharp } from "react-icons/io5";
import { send } from "emailjs-com";
import { BROWSE_LIMIT } from "constants/index";

export default function Question({ _question, caseId, isAtLimit }) {
  const {
    id,
    userCaseId,
    question,
    courseName,
    attachment,
    publisherName,
    createdAt,
    answers,
    courseId,
  } = _question;

  const [limitModalOpen, setLimitModalOpen] = useState(isAtLimit);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("recent");
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
      <Flex
        h="full"
        w="full"
        justify="center"
        pos="relative"
        style={
          isAtLimit
            ? {
                filter: "blur(6px)",
              }
            : {}
        }
      >
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
                        <Tooltip label="Attachment">
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
                        <Tooltip label="Edit">
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
                        <Tooltip label="Delete">
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

          {questionAnswers.length > 0 ? (
            <Box rounded={"lg"} w="100%" p={6}>
              <SlideFade in={true} offsetY="20px">
                <Flex justify="center" align="center" gap={4} mt={8} mb={0.5}>
                  <Heading textAlign={"center"} fontSize="32">
                    Posted Answers
                  </Heading>

                  {questionAnswers.length > 1 && (
                    <Tooltip label="Filter">
                      <IconButton
                        icon={<IoFilterSharp />}
                        size="md"
                        color="gray.100"
                        bg="cwru"
                        _active={{}}
                        _hover={{
                          backgroundColor: "rgba(10, 48, 78, 0.85)",
                        }}
                        onClick={() => setFilterModalOpen(true)}
                      />
                    </Tooltip>
                  )}
                </Flex>
              </SlideFade>
              {questionAnswers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  _answer={answer}
                  caseId={caseId}
                  answers={questionAnswers}
                  setAnswers={setQuestionAnswers}
                  name={session.user.name}
                  questionCaseId={userCaseId}
                  question={question}
                  questionId={id}
                  courseId={courseId}
                />
              ))}
              {!hasAnswered && !isUser && (
                <SlideFade in={true} offsetY="20px">
                  <Flex justify="center" align="center" mt={8}>
                    <Button
                      leftIcon={<IoCheckmarkSharp />}
                      variant="solid"
                      onClick={() => setAnswerModalOpen(true)}
                      size={"md"}
                      bg="cwru"
                      color="white"
                      colorScheme="black"
                      _hover={{
                        backgroundColor: "rgba(10, 48, 78, 0.85)",
                      }}
                    >
                      Answer Question
                    </Button>
                  </Flex>
                </SlideFade>
              )}
            </Box>
          ) : (
            <SlideFade in={true} offsetY="20px">
              <Flex
                justify="center"
                align="center"
                mt={!hasAnswered && !isUser ? 32 : 24}
                direction="column"
                gap={6}
              >
                <Heading fontSize={["xl", "2xl", "3xl"]}>
                  No Answers Have Been Posted 😥
                </Heading>
                {!hasAnswered && !isUser && (
                  <Button
                    leftIcon={<IoCheckmarkSharp />}
                    variant="solid"
                    onClick={() => setAnswerModalOpen(true)}
                    size={"md"}
                    bg="cwru"
                    color="white"
                    colorScheme="black"
                    _hover={{
                      backgroundColor: "rgba(10, 48, 78, 0.85)",
                    }}
                  >
                    Answer Question
                  </Button>
                )}
              </Flex>
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
        name={session.user.name}
        toast={toast}
        question={question}
        publisherName={publisherName}
        courseId={courseId}
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
      <FilterModal
        filterModalOpen={filterModalOpen}
        setFilterModalOpen={setFilterModalOpen}
        answers={questionAnswers}
        setAnswers={setQuestionAnswers}
        cancelRef={cancelRef}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
      />
      <LimitModal
        cancelRef={cancelRef}
        limitModalOpen={limitModalOpen}
        router={router}
      />
    </>
  );
}

function LimitModal({ limitModalOpen, cancelRef, router }) {
  return (
    <AlertDialog
      isOpen={limitModalOpen}
      leastDestructiveRef={cancelRef}
      closeOnOverlayClick={false}
      isCentered
      trapFocus={false}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent w="250px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" textAlign="left">
              View Limit Reached
            </AlertDialogHeader>
            <AlertDialogBody>
              To view, ask, and answer unlimited questions, upgrade to{" "}
              <strong>premium</strong> on the{" "}
              <NextLink href={"/subscription"} passHref>
                <Link color="blue.500">Subscription</Link>
              </NextLink>{" "}
              page
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                colorScheme="blue"
                onClick={() => router.push("/questions")}
              >
                Ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

function FilterModal({
  filterModalOpen,
  setFilterModalOpen,
  answers,
  setAnswers,
  cancelRef,
  filterBy,
  setFilterBy,
}) {
  return (
    <AlertDialog
      isOpen={filterModalOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setFilterModalOpen(false)}
      isCentered
      trapFocus={false}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent w="250px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" textAlign="left">
              Filter Answers By
            </AlertDialogHeader>
            <AlertDialogBody mt={-1}>
              <RadioGroup
                defaultValue={filterBy}
                transform="translateX(0.75rem)"
              >
                <Stack>
                  <Radio
                    size="md"
                    name="recent"
                    value="recent"
                    onChange={() => {
                      setFilterBy("recent");
                      setAnswers(
                        answers.sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                      );
                      setFilterModalOpen(false);
                    }}
                  >
                    Most Recent
                  </Radio>
                  <Radio
                    size="md"
                    name="upvoted"
                    value="upvoted"
                    onChange={() => {
                      setFilterBy("upvoted");
                      setAnswers(
                        answers.sort(
                          (a, b) => b.thumbsUp.length - a.thumbsUp.length
                        )
                      );
                      setFilterModalOpen(false);
                    }}
                  >
                    Most Upvoted
                  </Radio>
                </Stack>
              </RadioGroup>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                isFullWidth
                bg="cwru"
                color="white"
                _active={{}}
                _hover={{
                  backgroundColor: "rgba(10, 48, 78, 0.85)",
                }}
                onClick={() => setFilterModalOpen(false)}
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
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
  name,
  toast,
  question,
  publisherName,
  courseId,
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
                    const {
                      data: { answerId, createdAt },
                    } = await axios.post("/api/protected/answers/post", {
                      answer: answer.trim(),
                      caseId,
                      userCaseId,
                      questionId: Number(id),
                      publisherName: name,
                      question,
                      courseId,
                    });
                    setAnswers(
                      [
                        ...answers,
                        {
                          id: answerId,
                          answer: answer.trim(),
                          questionId: id,
                          userCaseId: caseId,
                          publisherName: name,
                          numThumbsUp: 0,
                          numThumbsDown: 0,
                          createdAt,
                        },
                      ].sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                      })
                    );
                    toast({
                      title: "Answer Posted",
                      description: "Your answer has been posted",
                      status: "success",
                      variant: "left-accent",
                      position: "bottom-left",
                      duration: 5000,
                      isClosable: true,
                    });
                    setIsLoading(false);
                    setAnswerModalOpen(false);

                    if (process.env.NODE_ENV === "production") {
                      try {
                        await send(
                          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                          {
                            to_email: `${userCaseId}@gmail.com`,
                            to_name: publisherName.split(" ")[0],
                            question,
                            website: window.location.href,
                            from_name: name,
                            from_caseId: caseId,
                          },
                          process.env.NEXT_PUBLIC_EMAILJS_USER_ID
                        );
                      } catch {}
                    }
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

export async function getServerSideProps({ req, res, query }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const { courses, viewHistory, caseId, subscription } =
    await prisma.user.findUnique({
      where: { caseId: session.user.caseId },
      select: {
        courses: true,
        viewHistory: true,
        caseId: true,
        subscription: true,
      },
    });

  if (!courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  try {
    const { id, courseId } = query;

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

    let isAtLimit = false;

    const hasViewed = viewHistory.some(
      (view) => view.questionId === Number(id)
    );

    if (
      !hasViewed &&
      subscription === "Basic" &&
      viewHistory.length === BROWSE_LIMIT
    ) {
      isAtLimit = true;
    } else {
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

      await prisma.notification.deleteMany({
        where: {
          questionId: Number(id),
          courseId: Number(courseId),
          userCaseId: session.user.caseId,
        },
      });
    }

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
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map((answer) => ({
              ...answer,
              createdAt: answer.createdAt.toISOString(),
            })),
          createdAt: question.createdAt.toISOString(),
        },
        caseId,
        isAtLimit,
      },
    };
  } catch {
    res.writeHead(302, { Location: "/questions" });
    res.end();
    return { props: {} };
  }
}
