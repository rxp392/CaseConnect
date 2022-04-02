import {
  Wrap,
  WrapItem,
  SlideFade,
  Flex,
  Heading,
  IconButton,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useMediaQuery,
  Box,
  Checkbox,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import QuestionCard from "components/QuestionCard";
import { usePagination } from "react-use-pagination";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { VscDebugRestart } from "react-icons/vsc";
import { IoFilterSharp } from "react-icons/io5";
import { useRef, useState, useEffect } from "react";

export default function CardPage({
  questions,
  setQuestions,
  allQuestions,
  title,
  includeAnsweredFilter = true,
  includeViewedFilter = true,
}) {
  const { data: session } = useSession();
  const cancelRef = useRef();
  const [isFiltered, setIsFiltered] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [disabledReset, setDisabledReset] = useState(false);
  const [isQuestionAltered, setIsQuestionAltered] = useState(false);
  const topRef = useRef();
  const [mounted, setMounted] = useState(false);
  const [isLarge] = useMediaQuery("(min-width: 480px)");
  const isCurrent = (number) => number === currentPage;
  const toast = useToast();

  useEffect(() => {
    setIsFiltered(
      Object.keys(allQuestions).length === Object.keys(questions).length &&
        Object.keys(allQuestions).every((p) => allQuestions[p] === questions[p])
    );
    setIsQuestionAltered(false);
  }, [questions]);

  const {
    totalPages,
    currentPage,
    setNextPage,
    setPreviousPage,
    nextEnabled,
    previousEnabled,
    startIndex,
    endIndex,
    setPage,
  } = usePagination({
    totalItems: questions.length,
    initialPageSize: 4,
  });

  useEffect(() => {
    mounted &&
      questions.length &&
      topRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentPage, questions]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <FilterDialog
        isFilterDialogOpen={isFilterDialogOpen}
        setIsFilterDialogOpen={setIsFilterDialogOpen}
        cancelRef={cancelRef}
        setQuestions={setQuestions}
        allQuestions={allQuestions}
        caseId={session.user.caseId}
        toast={toast}
        includeAnsweredFilter={includeAnsweredFilter}
        includeViewedFilter={includeViewedFilter}
        isFiltered={isFiltered}
        disabledReset={disabledReset}
        setDisabledReset={setDisabledReset}
      />

      <Flex
        justify="space-between"
        align="center"
        direction="column"
        h="full"
        w="full"
        p={2}
        overflowX="hidden"
        overflowY={"scroll"}
        pos="relative"
        gap={4}
      >
        <SlideFade in={true} offsetY="20px">
          <Heading
            ref={topRef}
            transform={
              !isFiltered && !isLarge ? "translateX(-1rem)" : "translateX(0)"
            }
            textAlign="center"
          >
            {title}
          </Heading>
        </SlideFade>
        <SlideFade in={true} offsetY="20px">
          <Wrap justify="center" spacing="30px">
            {questions.slice(startIndex, endIndex + 1).map((question) => (
              <WrapItem key={question.id}>
                <QuestionCard
                  _question={question}
                  isUser={session?.user.caseId === question.userCaseId}
                  questions={questions}
                  setQuestions={setQuestions}
                  setIsQuestionAltered={setIsQuestionAltered}
                />
              </WrapItem>
            ))}
          </Wrap>
        </SlideFade>

        <SlideFade in={true} offsetY="20px">
          <Flex justify="center" align="center" gap={0.5}>
            <ArrowButton
              disabled={previousEnabled}
              onClick={setPreviousPage}
              Icon={<BsChevronLeft />}
            />

            {totalPages <= 5 &&
              [...Array(totalPages).keys()].map((i) => (
                <PageButton
                  key={i}
                  number={i}
                  isCurrent={isCurrent}
                  setPage={setPage}
                />
              ))}

            {totalPages > 5 && currentPage < 3 && (
              <>
                {[...Array(3).keys()].map((i) => (
                  <PageButton
                    key={i}
                    number={i}
                    isCurrent={isCurrent}
                    setPage={setPage}
                  />
                ))}
                <Box mx={2.5}>...</Box>
                <PageButton
                  number={totalPages - 1}
                  isCurrent={isCurrent}
                  setPage={setPage}
                />
              </>
            )}

            {totalPages > 5 &&
              currentPage >= 3 &&
              currentPage < totalPages - 3 && (
                <>
                  <PageButton
                    number={0}
                    isCurrent={isCurrent}
                    setPage={setPage}
                  />
                  <Box mx={2.5}>...</Box>
                  {isLarge && (
                    <PageButton
                      number={currentPage - 1}
                      isCurrent={isCurrent}
                      setPage={setPage}
                    />
                  )}
                  <PageButton
                    number={currentPage}
                    isCurrent={isCurrent}
                    setPage={setPage}
                  />
                  {isLarge && (
                    <PageButton
                      number={currentPage + 1}
                      isCurrent={isCurrent}
                      setPage={setPage}
                    />
                  )}
                  <Box mx={2.5}>...</Box>
                  <PageButton
                    number={totalPages - 1}
                    isCurrent={isCurrent}
                    setPage={setPage}
                  />
                </>
              )}

            {totalPages > 5 && currentPage >= totalPages - 3 && (
              <>
                <PageButton
                  number={0}
                  isCurrent={isCurrent}
                  setPage={setPage}
                />
                <Box mx={2.5}>...</Box>
                {[...Array(3).keys()].reverse().map((i) => (
                  <PageButton
                    key={i}
                    number={totalPages - i - 1}
                    isCurrent={isCurrent}
                    setPage={setPage}
                  />
                ))}
              </>
            )}

            <ArrowButton
              disabled={nextEnabled}
              onClick={setNextPage}
              Icon={<BsChevronRight />}
            />
          </Flex>
        </SlideFade>

        {allQuestions.length > 4 && (
          <Flex pos="absolute" top="0" right="0" m={2} gap={2}>
            {!isQuestionAltered && !isFiltered && (
              <SlideFade in={true} offsetY="20px">
                <IconButton
                  icon={<VscDebugRestart />}
                  size="md"
                  color="gray.100"
                  bg="cwru"
                  _active={{}}
                  _hover={{
                    backgroundColor: "rgba(10, 48, 78, 0.85)",
                  }}
                  onClick={() => {
                    setQuestions(allQuestions);
                    setDisabledReset(true);
                  }}
                />
              </SlideFade>
            )}
            <SlideFade in={true} offsetY="20px">
              <IconButton
                icon={<IoFilterSharp />}
                size="md"
                color="gray.100"
                bg="cwru"
                _active={{}}
                _hover={{
                  backgroundColor: "rgba(10, 48, 78, 0.85)",
                }}
                onClick={() => setIsFilterDialogOpen(true)}
              />
            </SlideFade>
          </Flex>
        )}
      </Flex>
    </>
  );
}

function PageButton({ number, isCurrent, setPage }) {
  return (
    <Button
      fontSize={["sm", "md"]}
      variant="ghost"
      color={isCurrent(number) ? "gray.100" : "cwru"}
      bg={isCurrent(number) ? "cwru" : "gray.100"}
      _active={
        isCurrent(number) && {
          bg: "cwru",
        }
      }
      _hover={
        !isCurrent(number) && {
          bg: "gray.200",
        }
      }
      _focus={{}}
      style={{
        cursor: !isCurrent(number) ? "pointer" : "default",
      }}
      onClick={() => setPage(number)}
    >
      {number + 1}
    </Button>
  );
}

function ArrowButton({ disabled, onClick, Icon }) {
  return (
    <IconButton
      fontSize={["sm", "md"]}
      variant="ghost"
      color="cwru"
      bg="gray.100"
      _hover={
        disabled && {
          bg: "gray.200",
        }
      }
      _active={
        !disabled && {
          bg: "gray.100",
        }
      }
      _focus={{}}
      onClick={onClick}
      isDisabled={!disabled}
      icon={Icon}
      style={{
        cursor: disabled ? "pointer" : "default",
      }}
    />
  );
}

function FilterDialog({
  isFilterDialogOpen,
  setIsFilterDialogOpen,
  cancelRef,
  setQuestions,
  allQuestions,
  caseId,
  toast,
  includeAnsweredFilter,
  includeViewedFilter,
  isFiltered,
  disabledReset,
  setDisabledReset,
}) {
  const [oldest, setOldest] = useState(false);
  const oldestRef = useRef();
  const [answered, setAnswered] = useState(false);
  const answeredRef = useRef();
  const [viewed, setViewed] = useState(false);
  const viewedRef = useRef();

  useEffect(() => {
    if (isFiltered) {
      setOldest(false);
      setAnswered(false);
      setViewed(false);
    }
  }, [isFiltered]);

  useEffect(() => {
    setDisabledReset(!oldest && !answered && !viewed);
  }, [oldest, answered, viewed]);

  return (
    <AlertDialog
      isOpen={isFilterDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsFilterDialogOpen(false)}
      isCentered
      trapFocus={false}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent w="250px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" textAlign="left">
              <Flex w="full" justify="space-between" align="center">
                <Text>Filter Results By</Text>
                <IconButton
                  icon={<VscDebugRestart />}
                  size="sm"
                  color="gray.100"
                  bg="cwru"
                  _active={{}}
                  _hover={
                    !disabledReset && {
                      backgroundColor: "rgba(10, 48, 78, 0.85)",
                    }
                  }
                  isDisabled={disabledReset}
                  onClick={() => {
                    if (oldest) {
                      setOldest(true);
                      oldestRef.current.click();
                    }
                    if (answered) {
                      setAnswered(true);
                      answeredRef.current.click();
                    }
                    if (viewed) {
                      setViewed(true);
                      viewedRef.current.click();
                    }
                    setQuestions(allQuestions);
                  }}
                />
              </Flex>
            </AlertDialogHeader>
            <AlertDialogBody mt={-1}>
              <Flex
                w="full"
                justify={"start"}
                align={"start"}
                flexDirection="column"
                gap={2.5}
                transform="translateX(0.75rem)"
              >
                <Checkbox
                  ref={oldestRef}
                  value={oldest}
                  defaultChecked={oldest}
                  onChange={() => setOldest(!oldest)}
                >
                  Oldest
                </Checkbox>
                {includeAnsweredFilter && (
                  <Checkbox
                    ref={answeredRef}
                    value={answered}
                    defaultChecked={answered}
                    onChange={() => setAnswered(!answered)}
                  >
                    Answered
                  </Checkbox>
                )}
                {includeViewedFilter && (
                  <Checkbox
                    ref={viewedRef}
                    value={viewed}
                    defaultChecked={viewed}
                    onChange={() => setViewed(!viewed)}
                  >
                    Viewed
                  </Checkbox>
                )}
              </Flex>
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
                onClick={() => {
                  const filteredQuestions = allQuestions
                    .filter(({ answers }) =>
                      answered && includeAnsweredFilter
                        ? Boolean(answers.length)
                        : true
                    )
                    .filter(({ views }) =>
                      viewed && includeViewedFilter
                        ? views.some((view) => view.caseId === caseId)
                        : true
                    )
                    .sort((a, b) =>
                      oldest
                        ? new Date(a.createdAt) - new Date(b.createdAt)
                        : new Date(b.createdAt) - new Date(a.createdAt)
                    );

                  if (!filteredQuestions.length) {
                    return toast({
                      description: `No questions match your filters`,
                      status: "info",
                      position: "bottom-left",
                      variant: "left-accent",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                  setQuestions(filteredQuestions);
                  setIsFilterDialogOpen(false);
                }}
              >
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
