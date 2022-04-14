import {
  Text,
  Flex,
  Link,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Textarea,
  FormControl,
  Tooltip,
  SlideFade,
  IconButton,
  ButtonGroup,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import NextLink from "next/link";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { HiOutlineThumbDown, HiOutlineThumbUp } from "react-icons/hi";

export default function AnswerCard({
  _answer,
  answers,
  setAnswers,
  name,
  caseId,
  questionCaseId,
  question,
  questionId,
  courseId,
}) {
  const {
    id,
    answer,
    userCaseId,
    publisherName,
    thumbsUp,
    thumbsDown,
    createdAt,
  } = _answer;

  const isUser = caseId === userCaseId;
  const toast = useToast();
  const cancelRef = useRef();
  const [currentAnswer, setCurrentAnswer] = useState(answer);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editAlertOpen, setEditAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbUpCount, setThumbUpCount] = useState(thumbsUp?.length || 0);
  const [thumbDownCount, setThumbDownCount] = useState(thumbsDown?.length || 0);
  const [isUpVoted, setIsUpVoted] = useState(
    thumbsUp?.some((item) => item.userCaseId === caseId)
  );
  const [isDownVoted, setIsDownVoted] = useState(
    thumbsDown?.some((item) => item.userCaseId === caseId)
  );

  const handleThumbsUp = async () => {
    if (isUpVoted || isUser || isLoading) return;
    setIsLoading(true);
    setThumbUpCount(thumbUpCount + 1);
    try {
      await axios.post("/api/protected/answers/upvote", {
        id,
        caseId,
        userCaseId: questionCaseId,
        publisherName: name,
        question,
        questionId,
        courseId,
        isUser: questionCaseId === caseId,
      });
      toast({
        title: "Answer Upvoted",
        description: "Your upvote was successful",
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
      setIsUpVoted(true);
      setIsDownVoted(false);
    }
    if (isDownVoted) {
      setIsDownVoted(false);
      setThumbDownCount(thumbDownCount - 1);
    }
  };

  const handleThumbsDown = async () => {
    if (isDownVoted || isUser || isLoading) return;
    setIsLoading(true);
    setThumbDownCount(thumbDownCount + 1);
    try {
      await axios.post("/api/protected/answers/downvote", {
        id,
        caseId,
        userCaseId: questionCaseId,
        publisherName: name,
        question,
        questionId,
        courseId,
        isUser: questionCaseId === caseId,
      });
      toast({
        title: "Answer Downvoted",
        description: "Your downvote was successful",
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
      setIsDownVoted(true);
      setIsUpVoted(false);
    }
    if (isUpVoted) {
      setIsUpVoted(false);
      setThumbUpCount(thumbUpCount - 1);
    }
  };

  return (
    <>
      <SlideFade in={true} offsetY="20px">
        <Flex
          justify={["center", "space-between"]}
          borderBottom="1px solid #cdcdcd"
          p={1}
          w="full"
          direction="column"
          align={["center", "start"]}
          mt={0.5}
        >
          <Text fontSize="xl" fontWeight="bold" isTruncated>
            {currentAnswer}
          </Text>

          <Flex
            align="center"
            w="full"
            mt={[1, -1]}
            justify={["center", "space-between"]}
            direction={["column", "row"]}
          >
            <Text fontSize={"sm"}>
              Posted {new Date(createdAt).toLocaleDateString("en-us")} by{" "}
              <NextLink
                href={isUser ? "/my-profile" : `/profile/${userCaseId}`}
                passHref
              >
                <Link>{isUser ? `${name} (you)` : publisherName}</Link>
              </NextLink>
            </Text>

            <Flex gap={3}>
              <Flex>
                {isUser && (
                  <ButtonGroup isAttached>
                    <Tooltip label="Edit">
                      <IconButton
                        icon={<FiEdit />}
                        onClick={() => setEditAlertOpen(true)}
                      />
                    </Tooltip>
                    <Tooltip label="Delete">
                      <IconButton
                        icon={<BsFillTrashFill />}
                        onClick={() => setDeleteAlertOpen(true)}
                      />
                    </Tooltip>
                  </ButtonGroup>
                )}
              </Flex>
              <Flex gap={1.5}>
                <Tooltip label="Upvote" isDisabled={isUpVoted || isUser}>
                  <Flex
                    justify="center"
                    align="center"
                    onClick={handleThumbsUp}
                    cursor={isUpVoted || isUser ? "not-allowed" : "pointer"}
                  >
                    <IconButton
                      icon={<HiOutlineThumbUp />}
                      fontSize="1.4rem"
                      isDisabled={isUpVoted || isUser}
                      _hover={{}}
                      _focus={{}}
                      _active={
                        !(isUpVoted || isUser) && {
                          transform: "scale(0.95)",
                        }
                      }
                    />
                    <Text userSelect={"none"}>{thumbUpCount}</Text>
                  </Flex>
                </Tooltip>
                <Tooltip label="Downvote" isDisabled={isDownVoted || isUser}>
                  <Flex
                    justify="center"
                    align="center"
                    onClick={handleThumbsDown}
                    cursor={isDownVoted || isUser ? "not-allowed" : "pointer"}
                  >
                    <IconButton
                      icon={<HiOutlineThumbDown />}
                      fontSize="1.4rem"
                      isDisabled={isDownVoted || isUser}
                      _hover={{}}
                      _focus={{}}
                      _active={
                        !(isDownVoted || isUser) && {
                          transform: "scale(0.95)",
                        }
                      }
                    />
                    <Text userSelect={"none"}>{thumbDownCount}</Text>
                  </Flex>
                </Tooltip>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </SlideFade>

      <EditAlert
        id={id}
        editAlertOpen={editAlertOpen}
        cancelRef={cancelRef}
        setEditAlertOpen={setEditAlertOpen}
        toast={toast}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        answers={answers}
        setAnswers={setAnswers}
        answer={currentAnswer}
        setAnswer={setCurrentAnswer}
        caseId={caseId}
        userCaseId={questionCaseId}
        publisherName={publisherName}
        question={question}
        questionId={questionId}
        courseId={courseId}
      />
      <DeleteAlert
        cancelRef={cancelRef}
        deleteAlertOpen={deleteAlertOpen}
        setDeleteAlertOpen={setDeleteAlertOpen}
        toast={toast}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        id={id}
        answers={answers}
        setAnswers={setAnswers}
      />
    </>
  );
}

function EditAlert({
  id,
  editAlertOpen,
  cancelRef,
  setEditAlertOpen,
  toast,
  isLoading,
  setIsLoading,
  answers,
  setAnswers,
  answer,
  setAnswer,
  caseId,
  userCaseId,
  publisherName,
  question,
  questionId,
  courseId,
}) {
  const [editedAnswer, setEditedAnswer] = useState(answer);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setEditedAnswer(answer);
    setIsDisabled(true);
    setErrorMessage("");
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
              Edit Answer
            </AlertDialogHeader>
            <AlertDialogBody>
              <FormControl isInvalid={errorMessage}>
                <Textarea
                  id="answer"
                  placeholder={editedAnswer}
                  value={editedAnswer}
                  h="min-content"
                  type="text"
                  resize="none"
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditedAnswer(value);
                    if (value.length == 0) {
                      setErrorMessage("Answer cannot be empty");
                      setIsDisabled(true);
                    } else if (value.length < 10) {
                      setErrorMessage("Answer must be at least 10 characters");
                      setIsDisabled(true);
                    } else if (value.length > 250) {
                      setErrorMessage(
                        "Answer must be less than 250 characters"
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
                isDisabled={isDisabled || answer === editedAnswer}
                colorScheme="blue"
                loadingText="Updating..."
                spinnerPlacement="end"
                isLoading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await axios.post("/api/protected/answers/update", {
                      id,
                      answer: editedAnswer.trim(),
                      caseId,
                      userCaseId,
                      publisherName,
                      question,
                      questionId,
                      courseId,
                    });
                    setAnswer(editedAnswer);
                    setAnswers(
                      answers.map((_answer) => {
                        return _answer.id === id
                          ? { ..._answer, answer: editedAnswer }
                          : _answer;
                      })
                    );
                    toast({
                      title: "Answer Updated",
                      description: "Your answer has been updated",
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
  answers,
  setAnswers,
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
              Delete Answer
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this answer?
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
                    await axios.delete("/api/protected/answers/delete", {
                      data: {
                        id,
                      },
                    });
                    setAnswers(
                      answers.filter((_answer) => {
                        return _answer.id !== id;
                      })
                    );
                    toast({
                      title: "Answer Deleted",
                      description: "Your answer has been deleted",
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
