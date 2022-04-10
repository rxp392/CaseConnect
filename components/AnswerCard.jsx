import {
  Text,
  Flex,
  Box,
  IconButton,
  HStack,
  Link,
  Heading,
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
  FormErrorMessage,
  Tooltip,
  Badge,
  Wrap,
  WrapItem,
  useMediaQuery,
  ButtonGroup,
  Divider,
  SlideFade,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import {
  TriangleDownIcon,
  TriangleUpIcon
} from '@chakra-ui/icons'
import { useRouter } from "next/router";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { useSession } from "next-auth/react";



export default function AnswerCard({ _answer, caseId}) {
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
  } = _answer;

  const isAuthor = caseId === userCaseId;
  const { data: session } = useSession();
  //const viewedDate = views.find((view) => view.caseId === session.user.caseId);

  const router = useRouter();
  const toast = useToast();
  const cancelRef = useRef();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editAlertOpen, setEditAlertOpen] = useState(false);
  const [answerUpdate, setAnswer] = useState(answerUpdate);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLarge] = useMediaQuery("(min-width: 480px)");


  return (
    <>
      <Flex h="min-content"
        w="full"
        justify="center"
        align="center"
        direction="column"
        gap={1}>


        <Box
          as="form"
          rounded={"lg"}
          bg="#c4cbcf"
          color="#495c69"
          boxShadow={"lg"}
          w="100%"
          p={10}
        >

          <Heading fontSize='xl'>{
            <Link>{publisherName}</Link>
          }</Heading>

          <Text fontSize="xl">
            {answer}
          </Text>

          <HStack spacing={1}>

            <IconButton
              bg="#66CC99"
              color="white"
              aria-label='Search database'
              icon={<TriangleUpIcon />}
              onClick={async () => {
                try {
                  await axios.post("/api/protected/answers/thumbUp", {
                    id: id,
                  });
                } catch {
                } finally {
                }
              }}
            />
            <Text>{numThumbsUp}</Text>
            <IconButton
              bg="#CC6666"
              color="white"

              aria-label='Search database'
              icon={<TriangleDownIcon />}
              onClick={async () => {
                try {
                  await axios.post("/api/protected/answers/thumbDown", {
                    id: id,
                  });
                } catch {
                } finally {
                }
              }}
            />
            <Text>{numThumbsDown}</Text>

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
              isDisabled={isPageLoading || !isAuthor}
            />

          </HStack>
        </Box>
      </Flex>
      <EditAlert
        id={id}
        editAlertOpen={editAlertOpen}
        //cancelRef={cancelRef}
        setEditAlertOpen={setEditAlertOpen}
        toast={toast}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        //question={question}
        answerUpdate={answerUpdate}
        setAnswer={setAnswer}
      //questions={questions}
      //setQuestions={setQuestions}
      //setIsQuestionAltered={setIsQuestionAltered}
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
  answerUpdate,
  setAnswer,
  answers,
  setQuestions,
  setIsQuestionAltered,
}) {
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsDisabled(true);
  }, [editAlertOpen]);
  return (
    <AlertDialog
      isOpen={editAlertOpen}
      //leastDestructiveRef={cancelRef}
      onClose={() => setEditAlertOpen(false)}
      isCentered
    //trapFocus={false}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Edit Question
            </AlertDialogHeader>
            <AlertDialogBody>
              <FormControl //isInvalid={errorMessage}
              >
                <Textarea
                  id="answer"
                  //placeholder={questionTitle}
                  //value={questionTitle}
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
              </FormControl>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button //ref={cancelRef} 
                onClick={() => setEditAlertOpen(false)}>
                Cancel
              </Button>
              <Button
                //isDisabled={isDisabled || question === questionTitle}
                colorScheme="blue"
                loadingText="Updating..."
                spinnerPlacement="end"
                isLoading={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await axios.post("/api/protected/answers/update", {
                      id: id,
                      answer: answerUpdate,
                    });
                    /*
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
                    */
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
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
