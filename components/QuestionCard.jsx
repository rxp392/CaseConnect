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
  FormControl,
  FormErrorMessage,
  Tooltip,
  Badge,
  Wrap,
  WrapItem,
  useMediaQuery,
  ButtonGroup,
  Divider,
  FormLabel,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsFillTrashFill } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { useSession } from "next-auth/react";

import { GrAttachment } from "react-icons/gr";

export default function QuestionCard({
  _question,
  isUser,
  questions,
  setQuestions,
  setIsQuestionAltered,
}) {
  const {
    courseId,
    courseName,
    createdAt,
    publisherName,
    question,
    id,
    answers,
    userCaseId,
    views,
    attachment,
  } = _question;

  const { data: session } = useSession();
  const answersLength = answers.length;
  const viewedDate = views.find((view) => view.caseId === session.user.caseId);

  const router = useRouter();
  const toast = useToast();
  const cancelRef = useRef();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editAlertOpen, setEditAlertOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState(question);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLarge] = useMediaQuery("(min-width: 480px)");

  const formatBadge = (number, type) => {
    if (number === 0) return `no ${type}s`;
    return `${number} ${type}${number > 1 ? "s" : ""}`;
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
          px={3}
          pt={4}
          pb={3}
          pos="relative"
        >
          <Stack spacing={2}>
            <Tooltip
              isDisabled={question.length < 35 || !isLarge}
              hasArrow
              label={question}
              arrowSize={7}
              boxShadow={"xl"}
              rounded="lg"
              p={2}
              fontSize={"md"}
              bg="cwru"
              color="white"
              placement="top"
            >
              <Heading
                color="black"
                fontSize={"2xl"}
                fontWeight="semibold"
                isTruncated={isLarge}
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
            <Wrap pt={1}>
              <WrapItem>
                <Badge colorScheme="green">
                  {formatBadge(answersLength, "answer")}
                </Badge>
              </WrapItem>

              <WrapItem>
                <Badge colorScheme="blue">
                  {viewedDate ? (
                    <>
                      Viewed{" "}
                      {new Date(viewedDate.viewedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </>
                  ) : (
                    "Not Viewed"
                  )}
                </Badge>
              </WrapItem>

              {attachment && (
                <WrapItem>
                  <Badge
                    colorScheme="blackAlpha"
                    w="full"
                    h="full"
                    d="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <GrAttachment />
                  </Badge>
                </WrapItem>
              )}
            </Wrap>
          </Stack>
          <Stack
            textAlign="left"
            mt={8}
            direction={"row"}
            display={"flex"}
            w={"full"}
            justifyContent={"space-between"}
            spacing={[5, 10]}
            align={"center"}
          >
            {" "}
            <Button
              variant="ghost"
              px={1}
              py={2}
              onClick={() =>
                router.push(isUser ? "/my-profile" : `/profile/${userCaseId}`)
              }
              rounded={"lg"}
            >
              <Flex gap={2} justifyContent={"center"} align={"center"}>
                <Avatar
                  src={`/profile-pics/${userCaseId}.jpg`}
                  name={publisherName}
                  size="sm"
                  bg="cwru"
                  color="white"
                />
                <Stack direction={"column"} spacing={0} fontSize={"xs"}>
                  <Text fontWeight={600}>{publisherName}</Text>
                  <Text color={"gray.500"}>
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </Stack>
              </Flex>
            </Button>
            <Flex gap={1.5}>
              {isUser && (
                <ButtonGroup isAttached>
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
                    icon={<BsFillTrashFill />}
                    onClick={() => setDeleteAlertOpen(true)}
                    isDisabled={isPageLoading}
                  />
                  <Divider orientation="vertical" colorScheme="gray" />
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
                    isDisabled={isPageLoading}
                  />
                </ButtonGroup>
              )}

              <Button
                leftIcon={<AiOutlineEye />}
                type="submit"
                loadingText="Loading..."
                isLoading={isPageLoading}
                spinnerPlacement="end"
                p={2.5}
                size={["sm", "md"]}
                fontSize={["sm", "md"]}
                bg="cwru"
                color="white"
                colorScheme="black"
                _hover={{
                  backgroundColor: "rgba(10, 48, 78, 0.85)",
                }}
                onClick={() => {
                  setIsPageLoading(true);
                  router.push(`/questions/${id}-${courseId}`);
                }}
              >
                View
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
        setIsQuestionAltered={setIsQuestionAltered}
        attachment={attachment}
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
        attachment={attachment}
        setIsQuestionAltered={setIsQuestionAltered}
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
  setIsQuestionAltered,
  attachment,
}) {
  const [updatedAttachment, setUpdatedAttachment] = useState(null);
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
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Edit Question
          </AlertDialogHeader>
          <AlertDialogBody>
            <FormControl isInvalid={errorMessage} isRequired>
              <FormLabel htmlFor="question">Question</FormLabel>
              <Textarea
                id="question"
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
                    !updatedAttachment && setIsDisabled(true);
                  } else if (value.length < 10) {
                    setErrorMessage("Question must be at least 10 characters");
                    !updatedAttachment && setIsDisabled(true);
                  } else if (value.length > 250) {
                    setErrorMessage(
                      "Question must be less than 250 characters"
                    );
                    setQuestionValid(false);
                  } else if (question === value) {
                    !updatedAttachment && setIsDisabled(true);
                  } else {
                    setErrorMessage("");
                    setIsDisabled(false);
                  }
                }}
              />
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            </FormControl>
            <br />
            <FormControl>
              <FormLabel>Attachment</FormLabel>
              <Input
                type="file"
                id="attachment"
                accept="image/jpg, image/jpeg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUpdatedAttachment(file);
                    setIsDisabled(false);
                  } else {
                    setUpdatedAttachment(null);
                    setIsDisabled(true);
                  }
                }}
                size="sm"
              />
              <FormHelperText>
                Only .jpg and .jpeg files are allowed
              </FormHelperText>
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setEditAlertOpen(false)}>
              Cancel
            </Button>
            <Button
              isDisabled={isDisabled}
              colorScheme="blue"
              loadingText="Updating..."
              spinnerPlacement="end"
              isLoading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  const formData = new FormData();
                  formData.append("id", id);
                  formData.append("question", questionTitle.trim());
                  formData.append("attachment", updatedAttachment);
                  formData.append("existingAttachment", attachment);
                  const res = await fetch("/api/protected/questions/update", {
                    method: "POST",
                    body: formData,
                  });
                  const { newAttachment } = await res.json();
                  setQuestions(
                    questions.map((_question) =>
                      _question.id === id
                        ? {
                            ..._question,
                            question: questionTitle,
                            attachment: newAttachment,
                          }
                        : _question
                    )
                  );
                  toast({
                    title: "Question Updated",
                    description: "Your question has been updated",
                    status: "success",
                    variant: "left-accent",
                    position: "bottom-left",
                    duration: 5000,
                    isClosable: true,
                  });
                  setIsQuestionAltered(true);
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
  attachment,
  setIsQuestionAltered,
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
                  setQuestions(
                    questions.filter((question) => question.id !== id)
                  );
                  toast({
                    title: "Question Deleted",
                    description: "Your question has been deleted",
                    status: "success",
                    variant: "left-accent",
                    position: "bottom-left",
                    duration: 5000,
                    isClosable: true,
                  });
                  setIsQuestionAltered(true);
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
