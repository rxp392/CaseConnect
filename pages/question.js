import prisma from "lib/prisma";
import { getSession, useSession } from "next-auth/react";
import {
  Image,
  Link,
  Heading,
  Text,
  Flex,
  Button,
  Box,
  FormControl,
  FormErrorMessage,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  SlideFade,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormLabel,
  FormHelperText,
  Input,
  ButtonGroup,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import AnswerCard from "components/AnswerCard";
import { BsFillTrashFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { IoCheckmarkSharp } from "react-icons/io5";
import { send } from "emailjs-com";
import { BROWSE_LIMIT } from "constants/index";
import Filter from "bad-words";
import { ImAttachment } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { MdHideImage } from "react-icons/md";

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

  const [questionText, setQuestionText] = useState(question);
  const [questionAnswers, setQuestionAnswers] = useState(answers);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editAlertOpen, setEditAlertOpen] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState(attachment);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [attachmentModalType, setAttachmentModalType] = useState("");
  const [attachmentModalImage, setAttachmentModalImage] = useState("");
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
        minH="full"
        w="full"
        maxW="full"
        overflowX="hidden"
        overflowY="scroll"
        justify="space-between"
        align="center"
        direction="column"
        textAlign="center"
        style={
          isAtLimit
            ? {
                filter: "blur(5px)",
              }
            : {}
        }
      >
        <SlideFade in={true} offsetY="20px">
          <Flex
            justify="center"
            align="center"
            direction="column"
            gap={2}
            bg="cwru"
            boxShadow={"xl"}
            rounded="lg"
            color="white"
            px={8}
            py={4}
            w="full"
            mb={5}
          >
            <Heading fontSize="1.5rem" fontWeight="normal">
              {questionText}
            </Heading>
            {currentAttachment && (
              <Button
                onClick={() => {
                  setAttachmentModalType("Question");
                  setAttachmentModalImage(currentAttachment);
                  setAttachmentModalOpen(true);
                }}
                leftIcon={<ImAttachment />}
                colorScheme="black"
                size="sm"
                variant="link"
                my={1}
              >
                View Attachment
              </Button>
            )}
            <Text fontSize={"sm"} fontWeight="hairline">
              {courseName}
            </Text>
            <Text fontSize={"sm"} fontWeight="hairline">
              {new Date(createdAt).toLocaleDateString("en-us")} by{" "}
              <NextLink
                href={isUser ? "/my-profile" : `/profile/${userCaseId}`}
                passHref
              >
                <Link>
                  {publisherName} {isUser && "(you)"}
                </Link>
              </NextLink>
            </Text>
            {isUser && (
              <ButtonGroup isAttached mt={0.5} colorScheme="black">
                <Button
                  leftIcon={<FiEdit />}
                  size="xs"
                  onClick={() => setEditAlertOpen(true)}
                >
                  Edit
                </Button>
                <Button
                  leftIcon={<BsFillTrashFill />}
                  size="xs"
                  onClick={() => setDeleteAlertOpen(true)}
                >
                  Delete
                </Button>
              </ButtonGroup>
            )}
          </Flex>
        </SlideFade>
        {questionAnswers.length > 0 ? (
          <Box rounded={"lg"} w="100%" p={6}>
            <SlideFade in={true} offsetY="20px">
              <Flex justify="center" align="center" mb={4}>
                <Heading textAlign={"center"} fontSize={["24", "32"]}>
                  Posted Answers
                </Heading>
              </Flex>
            </SlideFade>
            {questionAnswers
              .sort((a, b) => {
                const aThumbsUp = a.thumbsUp.length;
                const aThumbsDown = a.thumbsDown.length;
                const bThumbsUp = b.thumbsUp.length;
                const bThumbsDown = b.thumbsDown.length;
                return (
                  bThumbsUp - bThumbsDown - (aThumbsUp - aThumbsDown) ||
                  bThumbsUp - aThumbsUp ||
                  aThumbsDown - bThumbsDown ||
                  new Date(b.createdAt) - new Date(a.createdAt)
                );
              })
              .map((answer) => (
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
                  setAttachmentModalType={setAttachmentModalType}
                  setAttachmentModalOpen={setAttachmentModalOpen}
                  setAttachmentModalImage={setAttachmentModalImage}
                />
              ))}
            {!hasAnswered && !isUser && (
              <SlideFade in={true} offsetY="20px">
                <Flex justify="center" align="center" mt={8}>
                  <Button
                    leftIcon={<IoCheckmarkSharp />}
                    variant="solid"
                    onClick={() => setAnswerModalOpen(true)}
                    py={6}
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
            <Flex justify="center" align="center" direction="column" gap={6}>
              <Heading fontSize={["xl", "2xl", "3xl"]}>
                No Answers Have Been Posted 😥
              </Heading>
              {!hasAnswered && !isUser && (
                <Button
                  leftIcon={<IoCheckmarkSharp />}
                  variant="solid"
                  onClick={() => setAnswerModalOpen(true)}
                  py={6}
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
        <Box></Box>
      </Flex>
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
        Filter={Filter}
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
        attachment={currentAttachment}
        setAttachment={setCurrentAttachment}
      />
      <DeleteAlert
        cancelRef={cancelRef}
        deleteAlertOpen={deleteAlertOpen}
        setDeleteAlertOpen={setDeleteAlertOpen}
        toast={toast}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        id={id}
        router={router}
      />
      <LimitModal
        cancelRef={cancelRef}
        limitModalOpen={isAtLimit}
        router={router}
      />
      <AttachmentModal
        isOpen={attachmentModalOpen}
        onClose={() => setAttachmentModalOpen(false)}
        attachment={currentAttachment}
        attachmentModalType={attachmentModalType}
        attachmentModalImage={attachmentModalImage}
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
  name,
  toast,
  question,
  publisherName,
  courseId,
  Filter,
}) {
  const [answer, setAnswer] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const filter = new Filter();

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
              <Stack spacing={4}>
                <FormControl isInvalid={errorMessage} isRequired>
                  <FormLabel>Answer</FormLabel>
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
                <FormControl>
                  <FormLabel>Attachment</FormLabel>
                  <Input
                    type="file"
                    id="attachment"
                    accept="image/jpg, image/jpeg"
                    size="sm"
                    onChange={(e) => setAttachment(e.target.files)}
                  />
                  <FormHelperText>
                    Only .jpg and .jpeg files are allowed
                  </FormHelperText>
                </FormControl>
              </Stack>
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
                  if (filter.isProfane(answer)) {
                    return toast({
                      title: "Profanity detected",
                      description: "Please remove profanity from your answer",
                      status: "error",
                      position: "bottom-left",
                      variant: "left-accent",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                  setIsLoading(true);
                  try {
                    const formData = new FormData();
                    formData.append("answer", answer.trim());
                    formData.append("caseId", caseId);
                    formData.append("userCaseId", userCaseId);
                    formData.append("questionId", Number(id));
                    formData.append("publisherName", name);
                    formData.append("question", question);
                    formData.append("courseId", courseId);
                    formData.append(
                      "attachment",
                      attachment?.length === 1 ? attachment[0] : null
                    );
                    const res = await fetch("/api/protected/answers/post", {
                      method: "POST",
                      body: formData,
                    });
                    const { answerId, createdAt } = await res.json();
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
                        const aThumbsUp = a.thumbsUp.length;
                        const aThumbsDown = a.thumbsDown.length;
                        const bThumbsUp = b.thumbsUp.length;
                        const bThumbsDown = b.thumbsDown.length;
                        return (
                          bThumbsUp - bThumbsDown - (aThumbsUp - aThumbsDown) ||
                          bThumbsUp - aThumbsUp ||
                          aThumbsDown - bThumbsDown ||
                          new Date(b.createdAt) - new Date(a.createdAt)
                        );
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
                            to_email: `${userCaseId}@case.edu`,
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
              To ask and view unlimited questions, upgrade to{" "}
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

function AttachmentModal({
  isOpen,
  onClose,
  attachmentModalType,
  attachmentModalImage,
}) {
  return (
    <SlideFade in={true} offsetY="20px">
      <Modal isOpen={isOpen} onClose={onClose} isCentered trapFocus={false}>
        <ModalOverlay />
        <ModalContent w="fit-content" h="fit-content">
          <ModalCloseButton />
          <ModalHeader>{attachmentModalType} Attachment</ModalHeader>
          <ModalBody>
            <Image
              src={attachmentModalImage}
              alt="attachment"
              boxSize={["300", "350px"]}
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
  attachment,
  setAttachment,
}) {
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [newAttachment, setNewAttachment] = useState(attachment);
  const [attachmentPreview, setAttachmentPreview] = useState(attachment);
  const [errorMessage, setErrorMessage] = useState("");
  const [questionValid, setQuestionValid] = useState(false);
  const [attachmentValid, setAttachmentValid] = useState(false);
  const [isAttachmentDeleting, setIsAttachmentDeleting] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    setEditedQuestion(question);
    setAttachmentPreview(attachment);
    setNewAttachment(attachment);
    setQuestionValid(false);
    setAttachmentValid(false);
    setErrorMessage("");
  }, [editAlertOpen]);

  useEffect(() => {
    setQuestionValid(question !== editedQuestion);
  }, [question, editedQuestion]);

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
              <Stack spacing={4}>
                <FormControl isInvalid={errorMessage}>
                  <Textarea
                    id="answer"
                    placeholder={editedQuestion}
                    value={editedQuestion}
                    h="min-content"
                    type="text"
                    resize="none"
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditedQuestion(value);
                      if (question === editedQuestion) {
                        setQuestionValid(false);
                      } else if (value.length == 0) {
                        setErrorMessage("Question cannot be empty");
                        setQuestionValid(false);
                      } else if (value.length < 10) {
                        setErrorMessage(
                          "Question must be at least 10 characters"
                        );
                        setQuestionValid(false);
                      } else if (value.length > 250) {
                        setErrorMessage(
                          "Question must be less than 250 characters"
                        );
                        setQuestionValid(false);
                      } else {
                        setErrorMessage("");
                        setQuestionValid(true);
                      }
                    }}
                  />
                  <FormErrorMessage>{errorMessage}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Attachment</FormLabel>
                  <Input
                    ref={fileRef}
                    type="file"
                    id="attachment"
                    accept="image/jpg, image/jpeg"
                    size="sm"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (
                        file &&
                        attachment
                          ?.split("/")
                          .slice(-1)[0]
                          .split(".")
                          .slice(0, -1)
                          .join(".") !== file.name
                      ) {
                        setAttachmentValid(true);
                        setNewAttachment(file);
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setAttachmentPreview(ev.target.result);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        e.target.value = null;
                        setAttachmentValid(false);
                      }
                    }}
                  />
                  <FormHelperText>
                    Only .jpg and .jpeg files are allowed
                  </FormHelperText>
                </FormControl>
                {attachmentPreview && (
                  <Stack align="start">
                    <Image
                      src={attachmentPreview}
                      alt="attachment"
                      boxSize={"225px"}
                      objectFit="cover"
                    />
                    <Button
                      mt={5}
                      size="sm"
                      variant="ghost"
                      leftIcon={<MdHideImage />}
                      colorScheme="red"
                      isLoading={isAttachmentDeleting}
                      loadingText="Deleting..."
                      spinnerPlacement="end"
                      onClick={async () => {
                        if (!attachment) {
                          setAttachmentPreview(null);
                          setNewAttachment(null);
                          setAttachmentValid(false);
                        } else {
                          setIsAttachmentDeleting(true);
                          try {
                            await axios.delete(
                              "/api/protected/questions/delete-attachment",
                              {
                                data: { id },
                              }
                            );
                            setAttachmentPreview(null);
                            setNewAttachment(null);
                            setAttachment(null);
                            toast({
                              title: "Attachment Deleted",
                              description:
                                "Your question attachment has been deleted",
                              status: "success",
                              variant: "left-accent",
                              position: "bottom-left",
                              duration: 5000,
                              isClosable: true,
                            });
                          } catch {
                            toast({
                              title: "An Error Ocurred",
                              description: "Please try again later",
                              status: "error",
                              variant: "left-accent",
                              position: "bottom-left",
                              duration: 5000,
                              isClosable: true,
                            });
                          } finally {
                            setIsAttachmentDeleting(false);
                            setAttachmentValid(false);
                          }
                        }
                        fileRef.current.value = "";
                      }}
                    >
                      Delete Attachment
                    </Button>
                  </Stack>
                )}
              </Stack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setEditAlertOpen(false)}>
                Cancel
              </Button>
              <Button
                isDisabled={!questionValid && !attachmentValid}
                colorScheme="blue"
                loadingText="Updating..."
                spinnerPlacement="end"
                isLoading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const formData = new FormData();
                    formData.append("id", id);
                    formData.append("question", editedQuestion.trim());
                    formData.append("attachment", newAttachment);
                    const res = await fetch("/api/protected/questions/update", {
                      method: "POST",
                      body: formData,
                    });
                    const { secure_url } = await res.json();
                    setQuestion(editedQuestion);
                    setAttachment(secure_url);
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

  const { courses, viewHistory, caseId, subscription, notifications } =
    await prisma.user.findUnique({
      where: { caseId: session.user.caseId },
      select: {
        courses: true,
        viewHistory: true,
        caseId: true,
        subscription: true,
        notifications: true,
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
            attachment: true,
          },
        },
      },
    });

    let isAtLimit = false;
    const hasViewed = viewHistory.some(
      (view) => view.questionId === Number(id)
    );

    if (
      question.userCaseId !== caseId &&
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
          questionCaseId: question.userCaseId,
          caseId: session.user.caseId,
        },
      });

      await prisma.notification.deleteMany({
        where: {
          id: {
            in: notifications.map((notification) => notification.id),
          },
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
