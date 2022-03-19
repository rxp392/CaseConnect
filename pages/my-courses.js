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
  Select,
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
} from "@chakra-ui/react";
import NextLink from "next/link";
import { getSession, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import useSwr from "swr";
import { FiPlus } from "react-icons/fi";

const fetcher = (url) => axios(url).then((res) => res.data);

export default function MyCourses({ userCourses }) {
  const { data } = useSwr("/api/protected/courses", fetcher);
  const { data: session } = useSession();
  const toast = useToast();
  const cancelRef = useRef();
  const [drawerOpen, setDrawerOpen] = useState(userCourses.length == 0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState(userCourses);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    setDrawerOpen(courses.length == 0);
  }, [courses]);

  const submitCourses = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/protected/courses/post", {
        courseIds: selectedCourses.map((course) => ({
          id: Number(course.id),
        })),
        caseId: session.user.caseId,
      });
      setCourses(
        [...new Set([...selectedCourses, ...courses])].sort((a, b) =>
          a.courseName.localeCompare(b.courseName)
        )
      );
      setSelectedCourses([]);
      toast({
        title: `Courses ${!courses.length ? "added" : "updated"}`,
        description: `Your courses have been ${
          !courses.length ? "added" : "updated"
        }`,
        status: "info",
        variant: "left-accent",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
      setDrawerOpen(false);
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
      {/* Drawer */}
      <Drawer
        isOpen={drawerOpen}
        size="md"
        closeOnOverlayClick={courses.length != 0}
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          {courses.length > 0 && <DrawerCloseButton />}
          <DrawerHeader>
            Select your courses {!courses.length && "to get started"}
          </DrawerHeader>
          <DrawerBody>
            <FormControl>
              <Select
                placeholder={"CWRU courses"}
                id="courseName"
                onChange={(e) => {
                  const [courseName, id] = e.target.value.split("|");
                  if (
                    !courses.some(
                      (course) => Number(course.id) === Number(id)
                    ) &&
                    courseName
                  ) {
                    setSelectedCourses([
                      { courseName, id },
                      ...selectedCourses,
                    ]);
                  }
                }}
              >
                {data?.allCourses.map(({ id, courseName }) => (
                  <option key={id} value={`${courseName}|${id}`}>
                    {courseName}
                  </option>
                ))}
              </Select>
            </FormControl>
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
                          (selectedCourse) => selectedCourse.id !== _id
                        )
                      );
                    }}
                  />
                </Tag>
              ))}
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Flex justifyContent="space-between" alignItems="center" w="full">
              <NextLink passHref href="/add-a-course">
                <Link>Can&apos;t find your course?</Link>
              </NextLink>

              <Button
                isLoading={isLoading}
                type="submit"
                loadingText={"Adding"}
                spinnerPlacement="end"
                size="md"
                bg="cwru"
                color="white"
                colorScheme="black"
                _active={
                  !selectedCourses.length == 0 && {
                    transform: "scale(0.95)",
                  }
                }
                _hover={
                  !selectedCourses.length == 0 && {
                    transform: "scale(1.02)",
                  }
                }
                isDisabled={selectedCourses.length == 0}
                onClick={submitCourses}
              >
                Continue
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Flex
        justify="start"
        align="center"
        direction="column"
        h="full"
        w="full"
        pt="2rem"
      >
        <SlideFade in={true} offsetY="20px">
          {courses.length > 0 && (
            <Flex justifyContent="center" alignItems="center">
              <Heading>My Courses&nbsp;</Heading>
              <IconButton
                size="md"
                fontSize="1.25rem"
                bg="cwru"
                color="white"
                colorScheme="black"
                _active={{
                  transform: "scale(0.95)",
                }}
                _hover={{
                  transform: "scale(1.02)",
                }}
                onClick={() => setDrawerOpen(true)}
                icon={<FiPlus />}
              />
            </Flex>
          )}

          <Wrap
            spacing="30px"
            align="center"
            justify="center"
            mt={9}
            h="90%"
            overflowY="scroll"
            overflowX="hidden"
          >
            {courses.map(({ courseName, id }) => (
              <WrapItem key={id} w={["85vw", "fit-content"]}>
                <Tag bg="cwru" color="white" w="fit-content" p={2}>
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
                      setSelectedId(Number(_id));
                      setConfirmOpen(true);
                    }}
                  />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </SlideFade>
      </Flex>

      {/* Confirmation alert */}
      <AlertDialog
        isOpen={confirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Course
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this course?
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
                    const filteredCourses = courses.filter(
                      (course) => Number(course.id) !== Number(selectedId)
                    );
                    await axios.post("/api/protected/courses/remove", {
                      courseId: Number(selectedId),
                      caseId: session.user.caseId,
                    });
                    toast({
                      title: "Course Deleted",
                      description: "Course has been deleted",
                      status: "info",
                      variant: "left-accent",
                      position: "bottom-left",
                      duration: 5000,
                      isClosable: true,
                    });
                    setCourses(filteredCourses);
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
                    setSelectedId("");
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

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const { courses } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      courses: true,
    },
  });

  return {
    props: {
      userCourses: courses.sort((a, b) =>
        a.courseName.localeCompare(b.courseName)
      ),
    },
  };
}
