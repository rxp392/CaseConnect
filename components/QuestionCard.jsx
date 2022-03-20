import {
  Box,
  Text,
  Center,
  Stack,
  Heading,
  Avatar,
  IconButton,
  Button,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Portal,
  FormControl,
  FormErrorMessage,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsFillTrashFill } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BiEditAlt } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";

export default function QuestionCard({
  _question,
  isUser,
  questions,
  setQuestions,
}) {
  const {
    courseId,
    courseName,
    createdAt,
    publisherName,
    question,
    userImage,
    id,
    answers,
  } = _question;

  const answersLength = answers.length;
  const commentsLength = answers.reduce(
    (acc, curr) => acc + curr.comments.length,
    0
  );

  const router = useRouter();
  const toast = useToast();
  const cancelRef = useRef();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editAlertOpen, setEditAlertOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState(question);
  const [isLoading, setIsLoading] = useState(false);

  const formatAnswersAndComments = (_answers, _comments) => {
    if (_answers == 0 && _comments == 0) return "no answers or comments";
    return `${_answers === 0 ? "no" : _answers} answer${
      _answers > 1 || _answers === 0 ? "s" : ""
    }, ${_comments === 0 ? "no" : _comments} comment${
      _comments > 1 || _comments === 0 ? "s" : ""
    }`;
  };

  useEffect(() => {
    setQuestionTitle(question);
  }, [editAlertOpen]);

  return (
    <>
      <Center py={6}>
        <Box
          maxW={["85vw", "445px"]}
          minW={["85vw", "445px"]}
          w={"full"}
          bg="white"
          boxShadow={"xl"}
          rounded={"lg"}
          p={4}
          pos="relative"
        >
          <Stack spacing={2}>
            <Tooltip
              isDisabled={question.length < 35}
              hasArrow
              label={question}
              arrowSize={7}
              bg="cwru"
              color="white"
              boxShadow={"xl"}
              rounded="lg"
              p={2}
              fontSize={"md"}
            >
              <Heading
                color="black"
                fontSize={"2xl"}
                fontWeight="semibold"
                isTruncated
              >
                {question}
              </Heading>
            </Tooltip>
            <Text
              color="gray.900"
              fontSize={"md"}
              fontWeight="normal"
              isTruncated
            >
              {courseName}
            </Text>
            <Text
              color="gray.900"
              fontSize={"sm"}
              transform={"translateY(-.25rem)"}
              fontWeight="normal"
            >
              {formatAnswersAndComments(answersLength, commentsLength)}
            </Text>
          </Stack>
          <Stack
            textAlign="left"
            mt={[5, 7]}
            direction={["column", "row"]}
            display={"flex"}
            w={"full"}
            justifyContent={["center", "space-between"]}
            spacing={[6, 10]}
            align={["start", "center"]}
          >
            <Flex
              gap={3}
              justifyContent={["start", "center"]}
              align={["start", "center"]}
            >
              <Avatar
                src={userImage}
                name={publisherName}
                size="sm"
                bg="cwru"
                color="white"
              />
              <Stack direction={"column"} spacing={0} fontSize={"xs"}>
                <Text fontWeight={600}>
                  {publisherName}
                  {isUser && " (you)"}
                </Text>
                <Text color={"gray.500"}>
                  {new Date(createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </Stack>
            </Flex>
            <Flex gap={1} direction={["row-reverse", "row"]}>
              {isUser && (
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      icon={<FiEdit />}
                      size={["sm", "md"]}
                      fontSize={["sm", "md"]}
                      p={2.5}
                      bg="cwru"
                      color="white"
                      colorScheme="black"
                      _active={{
                        transform: "scale(0.95)",
                      }}
                      _hover={{
                        backgroundColor: "rgba(10, 48, 78, 0.85)",
                      }}
                    />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent w="fit-content">
                      <PopoverArrow />
                      <PopoverBody>
                        <Flex
                          gap={1.5}
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Button
                            px={5}
                            w="full"
                            colorScheme="blue"
                            leftIcon={<BiEditAlt />}
                            onClick={() => setEditAlertOpen(true)}
                            _active={{
                              transform: "scale(0.95)",
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            px={5}
                            w="full"
                            colorScheme="red"
                            leftIcon={<BsFillTrashFill />}
                            onClick={() => setDeleteAlertOpen(true)}
                            _active={{
                              transform: "scale(0.95)",
                            }}
                          >
                            Delete
                          </Button>
                        </Flex>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              )}
              <Button
                type="submit"
                loadingText="Posting"
                spinnerPlacement="end"
                p={2.5}
                size={["sm", "md"]}
                fontSize={["sm", "md"]}
                bg="cwru"
                color="white"
                colorScheme="black"
                _active={{
                  transform: "scale(0.95)",
                }}
                _hover={{
                  backgroundColor: "rgba(10, 48, 78, 0.85)",
                }}
                onClick={() => router.push(`/questions/${id}-${courseId}`)}
              >
                View Question
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Center>

      <EditAlert
        id={id}
        editAlertOpen={editAlertOpen}
        cancelRef={cancelRef}
        setEditAlertOpen={setEditAlertOpen}
        toast={toast}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        question={question}
        questionTitle={questionTitle}
        setQuestionTitle={setQuestionTitle}
        questions={questions}
        setQuestions={setQuestions}
      />

      <DeleteAlert
        deleteAlertOpen={deleteAlertOpen}
        cancelRef={cancelRef}
        setDeleteAlertOpen={setDeleteAlertOpen}
        toast={toast}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        id={id}
        questions={questions}
        setQuestions={setQuestions}
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
  question,
  questionTitle,
  setQuestionTitle,
  questions,
  setQuestions,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <AlertDialog
      isOpen={editAlertOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setEditAlertOpen(false)}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Edit Question
          </AlertDialogHeader>
          <AlertDialogBody>
            <FormControl isInvalid={errorMessage}>
              <Textarea
                placeholder={questionTitle}
                value={questionTitle}
                h="min-content"
                type="text"
                resize="none"
                onChange={(e) => {
                  const value = e.target.value;
                  setQuestionTitle(value);
                  if (value.length == 0) {
                    setErrorMessage("Question cannot be empty");
                  } else if (value.length < 10) {
                    setErrorMessage("Question must be at least 10 characters");
                  } else if (value.length > 250) {
                    setErrorMessage(
                      "Question must be less than 250 characters"
                    );
                  } else {
                    setErrorMessage("");
                  }
                }}
              />
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => setEditAlertOpen(false)}
              _active={{
                transform: "scale(0.95)",
              }}
            >
              Cancel
            </Button>
            <Button
              _active={
                !(questionTitle === question || errorMessage) && {
                  transform: "scale(0.95)",
                }
              }
              isDisabled={questionTitle === question || errorMessage}
              colorScheme="blue"
              loadingText="Updating"
              spinnerPlacement="end"
              isLoading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  await axios.post("/api/protected/questions/update", {
                    id,
                    question: questionTitle,
                  });
                  toast({
                    title: "Question Updated",
                    description: "Your question has been updated",
                    status: "success",
                    variant: "left-accent",
                    position: "bottom-left",
                    duration: 5000,
                    isClosable: true,
                  });
                  setQuestions(
                    questions.map((_question) =>
                      _question.id === id
                        ? {
                            ..._question,
                            question: questionTitle,
                          }
                        : _question
                    )
                  );
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
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

function DeleteAlert({
  id,
  deleteAlertOpen,
  cancelRef,
  setDeleteAlertOpen,
  questions,
  setQuestions,
  toast,
  isLoading,
  setIsLoading,
}) {
  return (
    <AlertDialog
      isOpen={deleteAlertOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setDeleteAlertOpen(false)}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Question
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete your question?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => setDeleteAlertOpen(false)}
              _active={{
                transform: "scale(0.95)",
              }}
            >
              Cancel
            </Button>
            <Button
              _active={{
                transform: "scale(0.95)",
              }}
              colorScheme="red"
              loadingText="Deleting"
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
                  toast({
                    title: "Question Deleted",
                    description: "Your question has been deleted",
                    status: "success",
                    variant: "left-accent",
                    position: "bottom-left",
                    duration: 5000,
                    isClosable: true,
                  });
                  setQuestions(
                    questions.filter((question) => question.id !== id)
                  );
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
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
