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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsFillTrashFill } from "react-icons/bs";
import { useState, useRef } from "react";
import axios from "axios";

export default function QuestionCard({
  _question,
  isUser,
  deletedQuestionIds,
  setDeletedQuestionIds,
}) {
  const {
    courseId,
    courseName,
    createdAt,
    publisherName,
    question,
    userImage,
    id,
  } = _question;

  const router = useRouter();
  const toast = useToast();
  const cancelRef = useRef();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {/* Card */}
      <Center py={6}>
        <Box
          maxW={"445px"}
          w={"full"}
          bg="white"
          boxShadow={"2xl"}
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
            spacing={4}
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
            {isUser && (
              <IconButton
                variant="ghost"
                pos="absolute"
                top={0}
                right={0}
                m="14"
                _active={{
                  transform: "scale(0.95)",
                }}
                _hover={{
                  transform: "scale(1.02)",
                }}
                icon={<BsFillTrashFill />}
                onClick={() => setConfirmOpen(true)}
              />
            )}
          </Stack>
        </Box>
      </Center>
      {/* Confirmation alert */}{" "}
      <AlertDialog
        isOpen={confirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmOpen(false)}
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
              <Button ref={cancelRef} onClick={() => setConfirmOpen(false)}>
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
                    setDeletedQuestionIds([...deletedQuestionIds, id]);
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
                    setConfirmOpen(false);
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
    </>
  );
}
