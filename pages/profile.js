import {
  Flex,
  Box,
  Stack,
  Avatar,
  Image,
  Text,
  Center,
  SlideFade,
  Wrap,
  WrapItem,
  Badge,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import prisma from "lib/prisma";

export default function Profile({ user }) {
  return (
    <SlideFade in={true} offsetY="20px">
      <Box
        w={["85vw", "400px"]}
        bg={"white"}
        boxShadow={"2xl"}
        rounded={"lg"}
        overflow={"hidden"}
        alignItems={"center"}
        justifyContent={"center"}
        d="flex"
        flexDirection="column"
        pb={2}
      >
        <Image
          h={"120px"}
          w={"full"}
          src={"/profile-bg.jpg"}
          alt={"Profile Background"}
          objectFit={"cover"}
        />
        <Flex justify={"center"} mt={-12}>
          <Avatar
            size={"xl"}
            src={`/profile-pics/${user.caseId}.jpg`}
            name={user.name}
            css={{
              border: "2px solid white",
            }}
            bg="cwru"
            color="white"
          />
        </Flex>

        <Flex
          justify={"center"}
          align="center"
          gap={4}
          p={5}
          w="full"
          flexWrap={"wrap"}
          mt={2}
        >
          <Badge colorScheme="blue" fontSize="xs" py={0.5} px={1}>
            {user.name}
          </Badge>

          <Badge colorScheme="blue" fontSize="xs" py={0.5} px={1}>
            {user.caseId}
          </Badge>

          <Badge colorScheme="blue" fontSize="xs" py={0.5} px={1}>
            {user.caseId}@case.edu
          </Badge>

          <Badge colorScheme="blue" fontSize="xs" py={0.5} px={1}>
            Created {new Date(user.accountCreated).toLocaleDateString("en-us")}
          </Badge>

          <Badge colorScheme="blue" fontSize="xs" py={0.5} px={1}>
            {user.subscription} Plan
          </Badge>

          <Badge colorScheme="blue" fontSize="xs" py={0.5} px={1}>
            {user.courses.length} course{user.courses.length === 1 ? "" : "s"}
          </Badge>

          <Badge colorScheme="blue" fontSize="xs" py={0.5} px={1}>
            {user.questions.length} question
            {user.questions.length === 1 ? "" : "s"}
          </Badge>

          <Badge colorScheme="blue" fontSize="xs" py={0.5} px={1}>
            {user.answers.length} answer{user.answers.length === 1 ? "" : "s"}
          </Badge>

          <Badge colorScheme="blue" fontSize="xs" py={0.5} px={1}>
            {user.comments.length} comment
            {user.comments.length === 1 ? "" : "s"}
          </Badge>
        </Flex>
      </Box>
    </SlideFade>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const user = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      caseId: true,
      name: true,
      subscription: true,
      canAnswer: true,
      browseLimit: true,
      accountCreated: true,
      courses: true,
      questions: true,
      answers: true,
      comments: true,
    },
  });

  if (!user.courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  return {
    props: {
      user: {
        ...user,
        answers: user.answers.map((answer) => ({
          ...answer,
          createdAt: answer.createdAt.toISOString(),
        })),
        questions: user.questions.map((question) => ({
          ...question,
          createdAt: question.createdAt.toISOString(),
        })),
        comments: user.comments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
        })),
        accountCreated: user.accountCreated.toISOString(),
      },
    },
  };
}
