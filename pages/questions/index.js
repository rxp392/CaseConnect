import prisma from "lib/prisma";
import { getSession, useSession } from "next-auth/react";
import {
  Wrap,
  WrapItem,
  SlideFade,
  Text,
  Flex,
  Button,
  Heading,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import QuestionCard from "components/QuestionCard";

export default function Questions({ _questions }) {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState(_questions);

  if (!questions.length) {
    return (
      <SlideFade in={true} offsetY="20px">
        <Flex
          justifyContent="center"
          alignItems="center"
          direction="column"
          gap={4}
        >
          <Text fontSize={["lg", "2xl", "3xl"]}>
            No questions have been posted yet 😥
          </Text>
          <NextLink passHref href="/ask-a-question">
            <Button
              px={[2, 4, 6]}
              py={[2, 4, 6]}
              bg="cwru"
              color="white"
              colorScheme="black"
              _active={{
                transform: "scale(0.95)",
              }}
              _hover={{
                transform: "scale(1.02)",
              }}
            >
              Ask a question
            </Button>
          </NextLink>
        </Flex>
      </SlideFade>
    );
  }

  return (
    <Flex
      justify="start"
      align="center"
      direction="column"
      h="full"
      w="full"
      pt="2rem"
      overflowY="hidden"
    >
      <SlideFade in={true} offsetY="20px">
        <Heading textAlign="center">Questions</Heading>
        <Wrap
          justify="center"
          spacing="30px"
          h="90%"
          overflowY="scroll"
          overflowX="hidden"
        >
          {questions.map((question) => (
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
    </Flex>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const { courses, questions } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      courses: true,
      questions: true,
    },
  });

  if (!courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  const allQuestions = await prisma.question.findMany({
    where: {
      courseId: {
        in: courses.map((course) => course.id),
      },
    },
  });

  return {
    props: {
      _questions: [...allQuestions, ...questions]
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        )
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((question) => ({
          ...question,
          createdAt: question.createdAt.toISOString(),
        })),
    },
  };
}
