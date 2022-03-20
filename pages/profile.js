import {
  Flex,
  Box,
  Stack,
  Avatar,
  Image,
  Text,
  Center,
  SlideFade,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import prisma from "lib/prisma";

export default function Profile({ user }) {
  return (
    <SlideFade in={true} offsetY="20px">
      <Center py={6}>
        <Box
          w={"400px"}
          bg={"white"}
          boxShadow={"2xl"}
          rounded={"lg"}
          overflow={"hidden"}
        >
          <Image
            h={"120px"}
            w={"full"}
            src={
              "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            }
            alt={"Profile Background"}
            objectFit={"cover"}
          />
          <Flex justify={"center"} mt={-12}>
            <Avatar
              size={"xl"}
              src={user.image}
              name={user.name}
              css={{
                border: "2px solid white",
              }}
              bg="cwru"
              color="white"
            />
          </Flex>

          <Box p={6}>
            <Stack spacing={0} align={"center"} mb={5}>
              <Center>
                <Text color={"black.500"} fontWeight={300} fontSize="sm">
                  Name
                </Text>
                &nbsp;-&nbsp;
                <Text color={"black.500"} fontWeight={900} fontSize="lg">
                  {user.name}
                </Text>
              </Center>

              <Center>
                <Text color={"black.500"} fontWeight={300} fontSize="sm">
                  Case Id
                </Text>
                &nbsp;-&nbsp;
                <Text color={"black.500"} fontWeight={900} fontSize="lg">
                  {user.caseId}
                </Text>
              </Center>

              <Center>
                <Text color={"black.500"} fontWeight={300} fontSize="sm">
                  Email
                </Text>
                &nbsp;-&nbsp;
                <Text color={"black.500"} fontWeight={900} fontSize="lg">
                  {user.caseId}@case.edu
                </Text>
              </Center>

              <Center>
                <Text color={"black.500"} fontWeight={300} fontSize="sm">
                  Subscription Plan
                </Text>
                &nbsp;-&nbsp;
                <Text color={"black.500"} fontWeight={900} fontSize="lg">
                  {user.subscription} Plan
                </Text>
              </Center>

              <Center>
                <Text color={"black.500"} fontWeight={300} fontSize="sm">
                  Questions Asked
                </Text>
                &nbsp;-&nbsp;
                <Text color={"black.500"} fontWeight={900} fontSize="lg">
                  {user.questions.length}
                </Text>
              </Center>

              <Center>
                <Text color={"black.500"} fontWeight={300} fontSize="sm">
                  Questions Answered
                </Text>
                &nbsp;-&nbsp;
                <Text color={"black.500"} fontWeight={900} fontSize="lg">
                  {user.answers.length}
                </Text>
              </Center>
            </Stack>
          </Box>
        </Box>
      </Center>
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
      image: true,
      subscription: true,
      canAnswer: true,
      browseLimit: true,
      accountCreated: true,
      courses: true,
      questions: true,
      answers: true,
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
        accountCreated: user.accountCreated.toISOString(),
      },
    },
  };
}
