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
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Stack,
  Text,
  Center,
  Tooltip,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import QuestionCard from "components/QuestionCard";
import { usePagination } from "react-use-pagination";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { VscDebugRestart } from "react-icons/vsc";
import { IoFilterSharp } from "react-icons/io5";
import { useRef, useState, useEffect } from "react";
import { BiBookAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import Loader from "./Loader";

export default function CardPage({
  questions,
  setQuestions,
  allQuestions,
  title,
  courses,
  includeAnsweredFilter = true,
  includeViewedFilter = true,
  includeUserFilter = true,
}) {
  const { data: session } = useSession();
  const cancelRef = useRef();
  const [isFiltered, setIsFiltered] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [disabledReset, setDisabledReset] = useState(false);
  const [isQuestionAltered, setIsQuestionAltered] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
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

  if (isPageLoading) {
    return <Loader />;
  }

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
        courses={courses}
        includeUserFilter={includeUserFilter}
        name={session.user.name}
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
                  isPageLoading={isPageLoading}
                  setIsPageLoading={setIsPageLoading}
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
                <Tooltip label="Reset">
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
                </Tooltip>
              </SlideFade>
            )}
            <SlideFade in={true} offsetY="20px">
              <Tooltip label="Filter">
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
              </Tooltip>
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
  courses,
  caseId,
  toast,
  includeAnsweredFilter,
  includeViewedFilter,
  includeUserFilter,
  isFiltered,
  disabledReset,
  setDisabledReset,
  name,
}) {
  const [oldest, setOldest] = useState(false);
  const oldestRef = useRef();
  const [answered, setAnswered] = useState(false);
  const answeredRef = useRef();
  const [viewed, setViewed] = useState(false);
  const viewedRef = useRef();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);

  const names = [
    ...new Set(allQuestions.map(({ publisherName }) => publisherName)),
  ].sort();

  useEffect(() => {
    if (isFiltered) {
      setOldest(false);
      setAnswered(false);
      setViewed(false);
      setSelectedCourses([]);
      setSelectedNames([]);
    }
  }, [isFiltered]);

  useEffect(() => {
    setDisabledReset(
      !oldest &&
        !answered &&
        !viewed &&
        !selectedCourses.length &&
        !selectedNames.length
    );
  }, [oldest, answered, viewed, selectedCourses, selectedNames]);

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
                <Text transform="translateX(-4px)">Filter Results By</Text>
                <Tooltip label="Reset">
                  <IconButton
                    transform="translateX(4px)"
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
                      setSelectedCourses([]);
                      setSelectedNames([]);
                      setQuestions(allQuestions);
                    }}
                  />
                </Tooltip>
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
              <Stack align="center" w="full" mt={3} mb={-2.5}>
                {courses.length > 0 && (
                  <Menu closeOnSelect={false} preventOverflow={false}>
                    <MenuButton
                      isFullWidth
                      as={Button}
                      variant={selectedCourses.length ? "solid" : "outline"}
                    >
                      <Center>
                        <BiBookAlt />
                        &nbsp; Course
                      </Center>
                    </MenuButton>
                    <MenuList maxH="120px" overflowY="scroll">
                      <MenuOptionGroup
                        defaultValue={selectedCourses}
                        value={selectedCourses}
                        type="checkbox"
                        onChange={(values) => setSelectedCourses(values)}
                      >
                        {courses.map(({ id, courseName }) => (
                          <MenuItemOption key={id} value={id}>
                            {courseName.split(".")[0]}
                          </MenuItemOption>
                        ))}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                )}

                {includeUserFilter && names.length > 0 && (
                  <Menu closeOnSelect={false} preventOverflow={false}>
                    <MenuButton
                      isFullWidth
                      as={Button}
                      variant={selectedNames.length ? "solid" : "outline"}
                    >
                      <Center>
                        <CgProfile />
                        &nbsp;&nbsp; Name
                      </Center>
                    </MenuButton>
                    <MenuList maxH="120px" overflowY="scroll">
                      <MenuOptionGroup
                        defaultValue={selectedNames}
                        value={selectedNames}
                        type="checkbox"
                        onChange={(values) => setSelectedNames(values)}
                      >
                        {names.map((publisherName) => (
                          <MenuItemOption
                            key={publisherName}
                            value={publisherName}
                          >
                            {publisherName === name
                              ? `${publisherName} (you)`
                              : publisherName}
                          </MenuItemOption>
                        ))}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                )}
              </Stack>
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
                    .filter(({ courseId }) =>
                      selectedCourses.length
                        ? selectedCourses.some(
                            (_courseId) => _courseId === courseId
                          )
                        : true
                    )
                    .filter(({ publisherName }) =>
                      selectedNames.length && includeUserFilter
                        ? selectedNames.some((name) => name === publisherName)
                        : true
                    )
                    .sort((a, b) =>
                      oldest
                        ? new Date(a.createdAt) - new Date(b.createdAt)
                        : new Date(b.createdAt) - new Date(a.createdAt)
                    );

                  if (!filteredQuestions.length) {
                    return toast({
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
