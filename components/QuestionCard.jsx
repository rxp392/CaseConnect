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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsFillTrashFill } from "react-icons/bs";
import { useState, useRef } from "react";
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
    userCaseId,
    id,
  } = _question;

  const router = useRouter();
  const toast = useToast();
  const cancelRef = useRef();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editAlertOpen, setEditAlertOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState(question);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Center py={6}>
        <Box
          maxW={"445px"}
          w={"full"}
          bg="white"
          boxShadow={"xl"}
          rounded={"md"}
          p={5}
          pos="relative"
        >
          <Stack spacing={2}>
            <Heading color="gray.700" fontSize={"xl"}>
              {question}
            </Heading>
            <Text color="gray.600" fontSize={"md"}>
              {courseName}
            </Text>
          </Stack>
          <Stack
            mt={8}
            direction={"row"}
            display={"flex"}
            w={"full"}
            justifyContent={"space-between"}
            spacing={10}
            align={"center"}
          >
            <Flex gap={3} justifyContent={"center"} align="center">
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
            <Flex gap={1}>
              {isUser && (
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      icon={<FiEdit />}
                      size="md"
                      bg="cwru"
                      color="white"
                      colorScheme="black"
                      _active={{
                        transform: "scale(0.95)",
                      }}
                      _hover={{
                        transform: "scale(1.02)",
                      }}
                    />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <Flex
                          gap={1.5}
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Button
                            w="full"
                            bg="cwru"
                            color="white"
                            colorScheme="black"
                            _active={{
                              transform: "scale(0.95)",
                            }}
                            _hover={{
                              transform: "scale(1.02)",
                            }}
                            leftIcon={<BiEditAlt />}
                            onClick={() => setEditAlertOpen(true)}
                          >
                            Edit
                          </Button>
                          <Button
                            w="full"
                            bg="cwru"
                            color="white"
                            colorScheme="black"
                            _active={{
                              transform: "scale(0.95)",
                            }}
                            _hover={{
                              transform: "scale(1.02)",
                            }}
                            leftIcon={<BsFillTrashFill />}
                            onClick={() => setDeleteAlertOpen(true)}
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
                size="md"
                bg="cwru"
                color="white"
                colorScheme="black"
                _active={{
                  transform: "scale(0.95)",
                }}
                _hover={{
                  transform: "scale(1.02)",
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
            <Textarea
              h="min-content"
              type="text"
              resize="none"
              maxLength={171}
              placeholder={questionTitle}
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
            />
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setEditAlertOpen(false)}>
              Cancel
            </Button>
            <Button
              isDisabled={questionTitle === question}
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
                    status: "info",
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
            <Button ref={cancelRef} onClick={() => setDeleteAlertOpen(false)}>
              Cancel
            </Button>
            <Button
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
                    status: "info",
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
