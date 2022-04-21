import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Stack,
  TagLabel,
  Tag,
  TagCloseButton,
  FormControl,
  Flex,
  useToast,
  Heading,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Wrap,
  WrapItem,
  Link,
  SlideFade,
  IconButton,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
  Box,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { getSession, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import useSwr from "swr";
import { FiPlus } from "react-icons/fi";
import { BROWSE_LIMIT, POST_LIMIT, PREMIUM_PRICE } from "constants";
import Filter from "bad-words";
import prisma from "lib/prisma";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function MyCourses({ userCourses, isFirstLogin }) {
  const { data } = useSwr("/api/protected/courses", fetcher);
  const { data: session } = useSession();
  const toast = useToast();
  const cancelRef = useRef();
  const selectRef = useRef();
  const [drawerOpen, setDrawerOpen] = useState(userCourses.length == 0);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState(userCourses);
  const [allCourses, setAllCourses] = useState(data?.allCourses || []);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(
    !localStorage.getItem("hasReadWelcome") && isFirstLogin && !courses.length
  );
  const [hasReadInfoDialog, setHasReadInfoDialog] = useState(false);

  function uniqueArray(arr) {
    var seen = {};
    return arr.filter(function (item) {
      return seen.hasOwnProperty(item.id) ? false : (seen[item.id] = true);
    });
  }

  useEffect(() => {
    setDrawerOpen(courses.length == 0);
    if (data?.allCourses) {
      setAllCourses(
        uniqueArray([...data?.allCourses, ...courses]).sort((a, b) =>
          a.courseName.localeCompare(b.courseName)
        )
      );
    } else {
      setAllCourses([]);
    }
  }, [courses, data]);

  const submitCourses = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/protected/courses/post", {
        courseIds: selectedCourses.map((course) => ({
          id: Number(course.id),
        })),
        caseId: session.user.caseId,
        isFirstLogin,
      });
      setCourses(
        uniqueArray([...selectedCourses, ...courses]).sort((a, b) =>
          a.courseName.localeCompare(b.courseName)
        )
      );
      setSelectedCourses([]);
      setDrawerOpen(false);
      toast({
        title: `Course${selectedCourses.length > 1 ? "s" : ""} added`,
        description: `Your course${selectedCourses.length > 1 ? "s" : ""} ${
          selectedCourses.length > 1 ? "have" : "has"
        } been added`,
        status: "success",
        variant: "left-accent",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
      if (isFirstLogin && !hasReadInfoDialog) {
        setShowInfoDialog(true);
        setHasReadInfoDialog(true);
      }
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
    }
  };

  return (
    <>
      <Drawer
        isOpen={drawerOpen}
        size="md"
        closeOnOverlayClick={courses.length != 0}
        onClose={() => setDrawerOpen(false)}
        autoFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          {courses.length > 0 && <DrawerCloseButton />}
          <DrawerHeader>
            Enter your courses {!courses.length && "to get started"}
          </DrawerHeader>
          <DrawerBody>
            {allCourses.length ? (
              <FormControl>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    list="courses"
                    placeholder="Your course name..."
                    _placeholder={{ opacity: 0.75, color: "gray.500" }}
                    ref={selectRef}
                    value={selectedCourse}
                    type="text"
                    onChange={(e) => {
                      const value = e.target.value;
                      const foundCourse = allCourses.find(
                        (_course) => _course.courseName == value
                      );
                      if (foundCourse) {
                        setSelectedCourse(foundCourse.courseName);
                        setCurrentId(Number(foundCourse.id));
                      } else {
                        setSelectedCourse(value);
                        setCurrentId("");
                      }
                    }}
                    focusBorderColor="cwru"
                  />
                  <InputRightElement>
                    <IconButton
                      isDisabled={!selectedCourse}
                      icon={<FiPlus />}
                      bg="cwru"
                      color="white"
                      colorScheme="black"
                      _hover={
                        selectedCourse && {
                          backgroundColor: "rgba(10, 48, 78, 0.85)",
                        }
                      }
                      onClick={() => {
                        const foundCourse = allCourses.some(
                          (c) =>
                            c.courseName.toLowerCase() ===
                            selectedCourse.toLowerCase()
                        );
                        if (!foundCourse) {
                          setAddDialogOpen(true);
                        } else {
                          if (
                            !courses.some(
                              (course) => Number(course.id) === currentId
                            )
                          ) {
                            setSelectedCourses([
                              { courseName: selectedCourse, id: currentId },
                              ...selectedCourses,
                            ]);
                          } else {
                            toast({
                              title: "Course already added",
                              description: "You have already added this course",
                              status: "info",
                              position: "bottom-left",
                              variant: "left-accent",
                              duration: 5000,
                              isClosable: true,
                            });
                          }
                          setSelectedCourse("");
                          selectRef.current.focus();
                        }
                      }}
                    />
                  </InputRightElement>
                </InputGroup>
                <datalist id="courses">
                  {allCourses.map(({ id, courseName }) => (
                    <option key={id} value={courseName} />
                  ))}
                </datalist>
              </FormControl>
            ) : (
              <Text fontSize="medium">Loading Courses...</Text>
            )}
            <Stack spacing={5} mt={6} h="90%" overflowY="scroll">
              {selectedCourses.map(({ courseName, id }) => (
                <Tag key={id} bg="cwru" color="white" w="fit-content" p={2}>
                  <TagLabel>{courseName}</TagLabel>
                  <TagCloseButton
                    color="white"
                    transform="scale(1.1)"
                    id={id}
                    onClick={(e) => {
                      let _id;
                      if (e.target.parentElement.id) {
                        _id = e.target.parentElement.id;
                      } else {
                        _id = e.target.parentElement.parentElement.id;
                      }
                      setSelectedCourses(
                        selectedCourses.filter(
                          (_selectedCourse) =>
                            _selectedCourse.id !== Number(_id)
                        )
                      );
                    }}
                  />
                </Tag>
              ))}
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button
              isLoading={isLoading}
              type="submit"
              loadingText={"Adding..."}
              spinnerPlacement="end"
              size="md"
              bg="cwru"
              color="white"
              colorScheme="black"
              _hover={
                !selectedCourses.length == 0 && {
                  backgroundColor: "rgba(10, 48, 78, 0.85)",
                }
              }
              isDisabled={selectedCourses.length == 0}
              onClick={submitCourses}
            >
              Continue
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Flex
        justify="space-between"
        align="center"
        direction="column"
        h="calc(100vh - 10rem)"
        overflowY="scroll"
        overflowX="hidden"
      >
        {courses.length > 0 && (
          <SlideFade in={true} offsetY="20px">
            <Flex justify={"center"} align="center" gap={2} pt={2}>
              <Heading>My Courses&nbsp;</Heading>
              <IconButton
                size="md"
                fontSize="1.25rem"
                bg="cwru"
                color="white"
                colorScheme="black"
                _hover={{
                  backgroundColor: "rgba(10, 48, 78, 0.85)",
                }}
                onClick={() => setDrawerOpen(true)}
                icon={<FiPlus />}
              />
            </Flex>
          </SlideFade>
        )}
        <SlideFade in={true} offsetY="20px">
          <Wrap spacing="30px" align="center" justify="center" px={[0, 15]}>
            {courses.map(({ courseName, id }) => (
              <WrapItem key={id} w={"fit-content"}>
                <Tag bg="cwru" color="white" w="fit-content" p={2}>
                  <TagLabel isTruncated fontSize={["xs", "sm"]}>
                    {courseName}
                  </TagLabel>
                  <TagCloseButton
                    color="white"
                    transform="scale(1.1)"
                    id={id}
                    onClick={(e) => {
                      let _id;
                      if (e.target.parentElement.id) {
                        _id = e.target.parentElement.id;
                      } else {
                        _id = e.target.parentElement.parentElement.id;
                      }
                      setSelectedId(Number(_id));
                      setDeleteAlertOpen(true);
                    }}
                  />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </SlideFade>
        <Box></Box>
      </Flex>

      <DeleteDialog
        deleteAlertOpen={deleteAlertOpen}
        setDeleteAlertOpen={setDeleteAlertOpen}
        cancelRef={cancelRef}
        toast={toast}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        courses={courses}
        setCourses={setCourses}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        session={session}
      />
      <WelcomeDialog
        welcomeOpen={welcomeOpen}
        setWelcomeOpen={setWelcomeOpen}
        cancelRef={cancelRef}
        session={session}
        BROWSE_LIMIT={BROWSE_LIMIT}
        POST_LIMIT={POST_LIMIT}
        PREMIUM_PRICE={PREMIUM_PRICE}
      />
      <InfoDialog
        showInfoDialog={showInfoDialog}
        setShowInfoDialog={setShowInfoDialog}
        cancelRef={cancelRef}
      />
      <AddDialog
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        cancelRef={cancelRef}
        toast={toast}
        allCourses={allCourses}
        setAllCourses={setAllCourses}
        selectRef={selectRef}
        Filter={Filter}
        setSelectedCourse={setSelectedCourse}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
      />
    </>
  );
}

function AddDialog({
  addDialogOpen,
  setAddDialogOpen,
  cancelRef,
  toast,
  allCourses,
  setAllCourses,
  selectRef,
  Filter,
  setSelectedCourse,
  selectedCourses,
  setSelectedCourses,
}) {
  const [courseId, setCourseId] = useState("");
  const [courseIdError, setCourseIdError] = useState("");
  const [courseIdValid, setCourseIdValid] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseTitleError, setCourseTitleError] = useState("");
  const [courseTitleValid, setCourseTitleValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const filter = new Filter();

  useEffect(() => {
    setCourseId("");
    setCourseIdError("");
    setCourseIdValid(false);
    setCourseTitle("");
    setCourseTitleError("");
    setCourseTitleValid(false);
  }, [addDialogOpen]);

  return (
    <AlertDialog
      isOpen={addDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => {
        setSelectedCourse("");
        setAddDialogOpen(false);
      }}
      isCentered
      finalFocusRef={selectRef}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add your Course
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text mb={4} mt={-5}>
                Your course was not found, so please add it below
              </Text>
              <FormControl isInvalid={courseIdError} isRequired>
                <FormLabel htmlFor="courseId">Course Id</FormLabel>
                <Input
                  id="courseId"
                  type="text"
                  placeholder="CSDS 132"
                  value={courseId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCourseId(value);
                    if (value.length === 0) {
                      setCourseIdError("Course Id is required");
                      setCourseIdValid(false);
                    } else if (value.length < 6) {
                      setCourseIdError(
                        "Course Id must be at least 6 characters"
                      );
                      setCourseIdValid(false);
                    } else if (value.length > 10) {
                      setCourseIdError(
                        "Course Id must be at most 10 characters"
                      );
                      setCourseIdValid(false);
                    } else {
                      setCourseIdError("");
                      setCourseIdValid(true);
                    }
                  }}
                />
                <FormErrorMessage>{courseIdError}</FormErrorMessage>
              </FormControl>

              <br />

              <FormControl isInvalid={courseTitleError} isRequired>
                <FormLabel htmlFor="courseTitle">Course Title</FormLabel>
                <Input
                  id="courseTitle"
                  type="text"
                  placeholder="Introduction to Java"
                  value={courseTitle}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCourseTitle(value);
                    if (value.length === 0) {
                      setCourseTitleError("Course Title is required");
                      setCourseTitleValid(false);
                    } else if (value.length < 2) {
                      setCourseTitleError(
                        "Course Title must be at least 2 characters"
                      );
                      setCourseTitleValid(false);
                    } else if (value.length > 106) {
                      setCourseTitleError(
                        "Course Title must be at most 106 characters"
                      );
                      setCourseTitleValid(false);
                    } else {
                      setCourseTitleError("");
                      setCourseTitleValid(true);
                    }
                  }}
                />
                <FormErrorMessage>{courseTitleError}</FormErrorMessage>
              </FormControl>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                ml={3}
                colorScheme="blue"
                ref={cancelRef}
                isDisabled={!courseIdValid || !courseTitleValid}
                isLoading={isLoading}
                loadingText="Adding..."
                spinnerPlacement="end"
                onClick={async () => {
                  const _courseId = courseId
                    .toUpperCase()
                    .split(" ")
                    .join("")
                    .split(/(\d+)/)
                    .join(" ")
                    .trim();
                  const _courseTitle = courseTitle
                    .toLowerCase()
                    .split(" ")
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")
                    .trim();
                  const foundCourse = allCourses.find(
                    (_course) =>
                      _course.courseName === `${_courseId}. ${_courseTitle}`
                  );
                  const courseSelected = selectedCourses.some(
                    (c) => c.courseName === `${_courseId}. ${_courseTitle}`
                  );
                  if (foundCourse && !courseSelected) {
                    setSelectedCourses([
                      {
                        id: Number(foundCourse.id),
                        courseName: `${_courseId}. ${_courseTitle}`,
                      },
                      ...selectedCourses,
                    ]);
                    setSelectedCourse("");
                    setCourseId("");
                    setCourseTitle("");
                    setIsLoading(false);
                    setAddDialogOpen(false);
                    return;
                  } else if (courseSelected) {
                    setSelectedCourse("");
                    setCourseId("");
                    setCourseTitle("");
                    setIsLoading(false);
                    setAddDialogOpen(false);
                    return;
                  }
                  if (
                    filter.isProfane(_courseId) ||
                    filter.isProfane(_courseTitle)
                  ) {
                    return toast({
                      title: "Profanity detected",
                      description: "Please remove profanity from your course",
                      status: "error",
                      position: "bottom-left",
                      variant: "left-accent",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                  setIsLoading(true);
                  try {
                    const {
                      data: { addedCourseId, error },
                    } = await axios.post("/api/protected/courses/create", {
                      courseName: `${_courseId}. ${_courseTitle}`,
                    });
                    if (error) {
                      return toast({
                        title: "Course already exists",
                        description: "Please add that course or try again",
                        status: "error",
                        position: "bottom-left",
                        variant: "left-accent",
                        duration: 5000,
                        isClosable: true,
                      });
                    }
                    toast({
                      title: "Success",
                      description: "Your course has been created",
                      status: "success",
                      position: "bottom-left",
                      variant: "left-accent",
                      duration: 5000,
                      isClosable: true,
                    });
                    setAllCourses(
                      [
                        ...allCourses,
                        {
                          id: addedCourseId.toString(),
                          courseName: `${_courseId}. ${_courseTitle}`,
                        },
                      ].sort((a, b) => a.courseName.localeCompare(b.courseName))
                    );
                    setSelectedCourses([
                      {
                        id: Number(addedCourseId),
                        courseName: `${_courseId}. ${_courseTitle}`,
                      },
                      ...selectedCourses,
                    ]);
                    setSelectedCourse("");
                    setCourseId("");
                    setCourseTitle("");
                    setIsLoading(false);
                    setAddDialogOpen(false);
                  } catch {
                    toast({
                      title: "An error occurred",
                      description: "Please try again",
                      status: "error",
                      position: "bottom-left",
                      variant: "left-accent",
                      duration: 5000,
                      isClosable: true,
                    });
                    setIsLoading(false);
                    setAddDialogOpen(false);
                  }
                }}
              >
                Add
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

function InfoDialog({ showInfoDialog, setShowInfoDialog, cancelRef }) {
  const linkData = [
    {
      href: "/questions",
      name: "Home Page",
      description: "Questions for your courses",
    },
    {
      href: "/ask-a-question",
      name: "Ask Page",
      description: "Ask a question",
    },
    {
      href: "/my-questions",
      name: "Questions Page",
      description: "Your questions",
    },
    {
      href: "my-courses",
      name: "Courses Page",
      description: "Your courses",
    },
    {
      href: "my-answers",
      name: "Answers Page",
      description: "Your answers",
    },
    {
      href: "view-history",
      name: "View History Page",
      description: "Your view history",
    },
  ];

  return (
    <AlertDialog
      isOpen={showInfoDialog}
      leastDestructiveRef={cancelRef}
      onClose={() => setShowInfoDialog(false)}
      isCentered
      trapFocus={false}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Let&apos;s Get Started!
            </AlertDialogHeader>
            <AlertDialogBody>
              {linkData.map(({ href, name, description }) => (
                <Flex key={name}>
                  <NextLink passHref href={href}>
                    <Link color="blue.500">{name}</Link>
                  </NextLink>
                  &nbsp; - &nbsp; {description}
                </Flex>
              ))}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                colorScheme="blue"
                ref={cancelRef}
                onClick={() => setShowInfoDialog(false)}
              >
                Ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

function DeleteDialog({
  deleteAlertOpen,
  setDeleteAlertOpen,
  cancelRef,
  isLoading,
  setIsLoading,
  toast,
  courses,
  setCourses,
  selectedId,
  setSelectedId,
  session,
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
              Remove Course
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to remove this course?
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
                    const filteredCourses = courses.filter(
                      (course) => Number(course.id) !== Number(selectedId)
                    );
                    await axios.post("/api/protected/courses/remove", {
                      courseId: Number(selectedId),
                      caseId: session.user.caseId,
                    });
                    setCourses(filteredCourses);
                    toast({
                      title: "Course Deleted",
                      description: "Course has been deleted",
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
                    setSelectedId("");
                  }
                }}
                ml={3}
              >
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

function WelcomeDialog({
  welcomeOpen,
  setWelcomeOpen,
  cancelRef,
  session,
  BROWSE_LIMIT,
  POST_LIMIT,
  PREMIUM_PRICE,
}) {
  return (
    <AlertDialog
      isOpen={welcomeOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => {
        setWelcomeOpen(false);
        localStorage.setItem("hasReadWelcome", "true");
      }}
      isCentered
      trapFocus={false}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Welcome, {session.user.name.split(" ")[0]}
            </AlertDialogHeader>
            <AlertDialogBody>
              You are currently on the <strong>Basic plan</strong>, which means
              that you can ask <strong>{POST_LIMIT}</strong> questions and view{" "}
              <strong>{BROWSE_LIMIT}</strong> questions before needing to
              upgrade to ask and view unlimited questions. You can upgrade to
              the <strong>Premium plan</strong> at any time on the{" "}
              <strong>subscription page</strong> for{" "}
              <strong>${PREMIUM_PRICE}</strong>.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                colorScheme="blue"
                ref={cancelRef}
                onClick={() => {
                  setWelcomeOpen(false);
                  localStorage.setItem("hasReadWelcome", "true");
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

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const { courses, isFirstLogin } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      courses: true,
      isFirstLogin: true,
    },
  });

  return {
    props: {
      userCourses: courses.sort((a, b) =>
        a.courseName.localeCompare(b.courseName)
      ),
      isFirstLogin,
    },
  };
}
