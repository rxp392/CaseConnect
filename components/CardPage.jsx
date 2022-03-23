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
  FormLabel,
  FormControl,
  useToast,
  Select,
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
  courses,
  includeAnsweredFilter = true,
}) {
  const { data: session } = useSession();
  const cancelRef = useRef();
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isLarge] = useMediaQuery("(min-width: 480px)");
  const isCurrent = (number) => number === currentPage;
  const toast = useToast();
  const isFiltered =
    Object.keys(allQuestions).length === Object.keys(questions).length &&
    Object.keys(allQuestions).every((p) => allQuestions[p] === questions[p]);

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

  return (
    <>
      <FilterDialog
        isFilterDialogOpen={isFilterDialogOpen}
        setIsFilterDialogOpen={setIsFilterDialogOpen}
        cancelRef={cancelRef}
        setQuestions={setQuestions}
        allQuestions={allQuestions}
        courses={courses}
        caseId={session.user.caseId}
        toast={toast}
        includeAnsweredFilter={includeAnsweredFilter}
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

        <Flex pos="absolute" top="0" right="0" m={2} gap={2}>
          {!isFiltered && (
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
                onClick={() => setQuestions(allQuestions)}
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
  courses,
  caseId,
  toast,
  includeAnsweredFilter,
}) {
  const [newest, setNewest] = useState(true);
  const [answered, setAnswered] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    setNewest(true);
    setAnswered(false);
    setViewed(false);
    setSelectedCourses([]);
  }, [isFilterDialogOpen]);

  return (
    <AlertDialog
      isOpen={isFilterDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsFilterDialogOpen(false)}
      isCentered
      trapFocus={false}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Filter Results By
          </AlertDialogHeader>
          <AlertDialogBody>
            <Flex
              w="full"
              justify="space-evenly"
              align="center"
              direction="column"
              gap={5}
            >
              <Flex
                w="full"
                justify={["start", "space-evenly"]}
                align={["start", "center"]}
                direction={["column", "row"]}
                gap={2}
              >
                <Checkbox
                  value={newest}
                  onChange={() => setNewest(!newest)}
                  defaultChecked
                >
                  Newest
                </Checkbox>
                {includeAnsweredFilter && (
                  <Checkbox
                    value={answered}
                    onChange={() => setAnswered(!answered)}
                  >
                    Answered
                  </Checkbox>
                )}
                <Checkbox value={viewed} onChange={() => setViewed(!viewed)}>
                  Viewed
                </Checkbox>
              </Flex>

              <FormControl>
                <FormLabel htmlFor="courses">Course(s)</FormLabel>
                <Select
                  id="courses"
                  multiple
                  w="fit-content"
                  h="fit-content"
                  iconSize={"0"}
                  value={selectedCourses}
                  onChange={(e) =>
                    setSelectedCourses(
                      [...e.target.options]
                        .filter((option) => option.selected)
                        .map((option) => option.value)
                    )
                  }
                >
                  {courses.map(({ id, courseName }) => (
                    <option key={id} value={id}>
                      {courseName}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => setIsFilterDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                const filteredQuestions = allQuestions
                  .filter(({ answers }) =>
                    answered && includeAnsweredFilter
                      ? Boolean(answers.length)
                      : true
                  )
                  .filter(({ views }) =>
                    viewed
                      ? views?.some((view) => view.caseId === caseId)
                      : true
                  )
                  .filter(({ courseId }) =>
                    selectedCourses.length
                      ? selectedCourses.some(
                          (value) => Number(value) === Number(courseId)
                        )
                      : true
                  )
                  .sort((a, b) =>
                    newest
                      ? new Date(b.createdAt) - new Date(a.createdAt)
                      : new Date(a.createdAt) - new Date(b.createdAt)
                  );

                if (!filteredQuestions.length) {
                  return toast({
                    title: "Filter unsuccessful",
                    description: "No questions were found for that filter",
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
              ml={3}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
