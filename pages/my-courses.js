import { useSession, getSession } from "next-auth/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Stack,
  TagLabel,
  Tag,
  TagCloseButton,
  Select,
  FormControl,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { BiBookAlt } from "react-icons/bi";

export default function MyCourses({ allCourses, userCourses }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(userCourses.length === 0);
  const [tags, setTags] = useState([]);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hey, {session.user.name.split(" ")[0]}!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Please choose your courses</ModalBody>
          <ModalFooter>
            <Button
              bg="cwru"
              color="white"
              colorScheme="black"
              _active={{
                transform: "scale(0.95)",
              }}
              mr={3}
              onClick={onClose}
            >
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex justify="start" align="start" direction="column" h="full" pt="2rem">
        <FormControl>
          <FormLabel htmlFor="courseName">Choose your courses</FormLabel>
          <Select
            w="50%"
            borderColor="cwru"
            placeholder={"CWRU courses"}
            id="courseName"
            onChange={(e) => {
              const [courseName, id] = e.target.value.split("|");
              if (!tags.some((tag) => tag.id === id)) {
                setTags([{ courseName, id }, ...tags]);
              }
            }}
          >
            {allCourses.map(({ id, courseName }) => (
              <option key={id} value={`${courseName}|${id}`}>
                {courseName}
              </option>
            ))}
          </Select>
        </FormControl>

        <Stack spacing={5} mt={6} overflow="scroll" maxH="25rem" w="50%">
          {tags.map(({ courseName, id }) => (
            <Tag key={id} bg="cwru" color="white" w="fit-content" py="1" px="2">
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
                  setTags(tags.filter((tag) => tag.id !== _id));
                }}
              />
            </Tag>
          ))}
        </Stack>
        {tags.length > 0 && (
          <Button
            bg="cwru"
            color="white"
            colorScheme="black"
            _active={{
              transform: "scale(0.95)",
            }}
            mt={6}
            onClick={() => {}}
          >
            <BiBookAlt />
            <span>Add</span>
          </Button>
        )}
      </Flex>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) return { props: {} };

  const allCourses = await prisma.course.findMany({
    orderBy: {
      courseName: "asc",
    },
  });

  const userCourses = await prisma.course.findMany({
    where: {
      users: {
        some: {
          caseId: session.user.caseId,
        },
      },
    },
    orderBy: {
      courseName: "asc",
    },
  });
  return {
    props: { allCourses, userCourses },
  };
}

MyCourses.isProtected = true;
