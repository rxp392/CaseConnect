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
  Tooltip,
  SlideFade,
  ButtonGroup,
  FormErrorMessage,
  FormControl,
  Textarea,
  Image,
  Stack,
  FormLabel,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import NextLink from "next/link";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { HiOutlineThumbDown, HiOutlineThumbUp } from "react-icons/hi";
import { ImAttachment } from "react-icons/im";
import { MdHideImage } from "react-icons/md";

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
  setAttachmentModalType,
  setAttachmentModalOpen,
  setAttachmentModalImage,
}) {
  const {
    id,
    answer,
    userCaseId,
    publisherName,
    thumbsUp,
    thumbsDown,
    createdAt,
    attachment,
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
      const {
        data: { thumbUpId },
      } = await axios.post("/api/protected/answers/upvote", {
        id,
        caseId,
        userCaseId: userCaseId,
        publisherName: name,
        question,
        questionId,
        courseId,
      });
      setAnswers(
        answers
          .map((a) => {
            if (Number(a.id) === Number(id)) {
              return {
                ...a,
                thumbsUp: [
                  ...a.thumbsUp,
                  {
                    id: Number(thumbUpId),
                    answerId: Number(id),
                    userCaseId: caseId,
                  },
                ],
              };
            }
            return a;
          })
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
      );
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
      const {
        data: { thumbDownId },
      } = await axios.post("/api/protected/answers/downvote", {
        id,
        caseId,
        userCaseId: userCaseId,
        publisherName: name,
        question,
        questionId,
        courseId,
      });
      setAnswers(
        answers
          .map((a) => {
            if (Number(a.id) === Number(id)) {
              return {
                ...a,
                thumbsDown: [
                  ...a.thumbsDown,
                  {
                    id: Number(thumbDownId),
                    answerId: Number(id),
                    userCaseId: caseId,
                  },
                ],
              };
            }
            return a;
          })
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
      );
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
          pt={3}
          w="full"
          direction="column"
          align={["center", "start"]}
          gap={1.5}
          px={2}
          pb={2}
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
            textAlign={"left"}
            maxW={"75vw"}
            mb={attachment ? [0, -2] : [0, -3.5]}
          >
            {currentAnswer}
          </Text>
          {attachment && (
            <Button
              mt={[0.5, 2]}
              mb={[0.5, -2.5]}
              onClick={() => {
                setAttachmentModalType("Answer");
                setAttachmentModalImage(attachment);
                setAttachmentModalOpen(true);
              }}
              leftIcon={<ImAttachment />}
              colorScheme="black"
              color="black"
              size="sm"
              variant="link"
            >
              View Attachment
            </Button>
          )}
          <Flex
            w="full"
            justify={["start", "space-between"]}
            direction={["column", "row"]}
            mt={-0.5}
          >
            <Flex
              direction={["column", "row"]}
              align={["center", "end"]}
              justify="space-between"
              w={"full"}
              mt={isUser ? [0, 2.5] : 0}
              mb={isUser ? [0.5, -1] : 0}
            >
              <Text fontSize={"sm"}>
                {new Date(createdAt).toLocaleDateString("en-us")} by{" "}
                <NextLink
                  href={isUser ? "/my-profile" : `/profile/${userCaseId}`}
                  passHref
                >
                  <Link>{isUser ? `${name} (you)` : publisherName}</Link>
                </NextLink>
              </Text>
            </Flex>

            {!isUser && (
              <Flex gap={1.5} alignSelf={["center", "start"]} mt={[2.5, 0]}>
                <Tooltip label="Upvote" isDisabled={isUpVoted || isUser}>
                  <Button
                    color="black"
                    leftIcon={<HiOutlineThumbUp />}
                    variant="outline"
                    onClick={handleThumbsUp}
                    size="sm"
                    isDisabled={isUpVoted || isUser}
                    _disabled={{
                      color: "gray.500",
                      cursor: "not-allowed",
                    }}
                  >
                    {thumbUpCount}
                  </Button>
                </Tooltip>
                <Tooltip label="Downvote" isDisabled={isDownVoted || isUser}>
                  <Button
                    color="black"
                    leftIcon={<HiOutlineThumbDown />}
                    variant="outline"
                    onClick={handleThumbsDown}
                    size="sm"
                    isDisabled={isDownVoted || isUser}
                    _disabled={{
                      color: "gray.500",
                      cursor: "not-allowed",
                    }}
                  >
                    {thumbDownCount}
                  </Button>
                </Tooltip>
              </Flex>
            )}
          </Flex>
          {isUser && (
            <Flex
              w="full"
              justify="space-between"
              align={["center", "end"]}
              direction={["column", "row-reverse"]}
              gap={1.5}
              mt={[-2, -1]}
            >
              <Flex gap={1.5} alignSelf={["center", "start"]} mt={[2.5, 0]}>
                <Tooltip label="Upvote" isDisabled={isUpVoted || isUser}>
                  <Button
                    color="black"
                    leftIcon={<HiOutlineThumbUp />}
                    variant="outline"
                    onClick={handleThumbsUp}
                    size="sm"
                    isDisabled={isUpVoted || isUser}
                    _disabled={{
                      color: "gray.500",
                      cursor: "not-allowed",
                    }}
                  >
                    {thumbUpCount}
                  </Button>
                </Tooltip>
                <Tooltip label="Downvote" isDisabled={isDownVoted || isUser}>
                  <Button
                    color="black"
                    leftIcon={<HiOutlineThumbDown />}
                    variant="outline"
                    onClick={handleThumbsDown}
                    size="sm"
                    isDisabled={isDownVoted || isUser}
                    _disabled={{
                      color: "gray.500",
                      cursor: "not-allowed",
                    }}
                  >
                    {thumbDownCount}
                  </Button>
                </Tooltip>
              </Flex>
              <ButtonGroup isAttached mt={[1.5, 0.5]} colorScheme="blackAlpha">
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
            </Flex>
          )}
        </Flex>
      </SlideFade>

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
        attachment={attachment}
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
  attachment,
}) {
  const [editedAnswer, setEditedAnswer] = useState(answer);
  const [newAttachment, setNewAttachment] = useState(attachment);
  const [attachmentPreview, setAttachmentPreview] = useState(attachment);
  const [errorMessage, setErrorMessage] = useState("");
  const [answerValid, setAnswerValid] = useState(false);
  const [attachmentValid, setAttachmentValid] = useState(false);
  const [isAttachmentDeleting, setIsAttachmentDeleting] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    setEditedAnswer(answer);
    setAttachmentPreview(attachment);
    setNewAttachment(attachment);
    setAnswerValid(false);
    setAttachmentValid(false);
    setErrorMessage("");
  }, [editAlertOpen]);

  useEffect(() => {
    setAnswerValid(answer !== editedAnswer);
  }, [answer, editedAnswer]);

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
              <Stack spacing={4}>
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
                      if (answer === editedAnswer) {
                        setAnswerValid(false);
                      } else if (value.length == 0) {
                        setErrorMessage("Answer cannot be empty");
                        setAnswerValid(false);
                      } else if (value.length < 10) {
                        setErrorMessage(
                          "Answer must be at least 10 characters"
                        );
                        setAnswerValid(false);
                      } else if (value.length > 250) {
                        setErrorMessage(
                          "Answer must be less than 250 characters"
                        );
                        setAnswerValid(false);
                      } else {
                        setErrorMessage("");
                        setAnswerValid(true);
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
                              "/api/protected/answers/delete-attachment",
                              {
                                data: { id },
                              }
                            );
                            setAttachmentPreview(null);
                            setNewAttachment(null);
                            setAnswers(
                              answers.map((_answer) => {
                                return _answer.id === id
                                  ? {
                                      ..._answer,
                                      answer: editedAnswer,
                                      attachment: null,
                                    }
                                  : _answer;
                              })
                            );
                            toast({
                              title: "Attachment Deleted",
                              description:
                                "Your answer attachment has been deleted",
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
                isDisabled={!answerValid && !attachmentValid}
                colorScheme="blue"
                loadingText="Updating..."
                spinnerPlacement="end"
                isLoading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const formData = new FormData();
                    formData.append("id", id);
                    formData.append("answer", editedAnswer.trim());
                    formData.append("attachment", newAttachment);
                    formData.append("caseId", caseId);
                    formData.append("userCaseId", userCaseId);
                    formData.append("publisherName", publisherName);
                    formData.append("question", question);
                    formData.append("questionId", questionId);
                    formData.append("courseId", courseId);
                    const res = await fetch("/api/protected/answers/update", {
                      method: "POST",
                      body: formData,
                    });
                    const { secure_url } = await res.json();
                    setAnswer(editedAnswer);
                    setAnswers(
                      answers.map((_answer) => {
                        return _answer.id === id
                          ? {
                              ..._answer,
                              answer: editedAnswer,
                              attachment: secure_url,
                            }
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
