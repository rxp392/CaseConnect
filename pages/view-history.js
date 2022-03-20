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

export default function MyHistory({ _questions }) {
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
            You haven&apos;t viewed any questions
          </Text>
          <NextLink passHref href="/questions">
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
                backgroundColor: "rgba(10, 48, 78, 0.85)",
              }}
            >
              View questions
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
        <Heading textAlign="center">View History</Heading>
        <Wrap
          justify="center"
          spacing="30px"
          h="90%"
          overflowY="scroll"
          overflowX="hidden"
          mt={2}
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

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const { courses, viewHistory } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      courses: true,
      viewHistory: {
        orderBy: {
          viewedAt: "desc",
        },
      },
    },
  });

  if (!courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  const questions = await prisma.question.findMany({
    where: {
      id: {
        in: viewHistory.map((history) => Number(history.questionId)),
      },
    },
    select: {
      id: true,
      question: true,
      attachment: true,
      courseId: true,
      courseName: true,
      course: true,
      answers: {
        select: {
          comments: {
            select: {
              userCaseId: true,
            },
          },
        },
      },
      views: {
        select: {
          viewedAt: true,
          caseId: true,
        },
      },
      userCaseId: true,
      publisherName: true,
      createdAt: true,
    },
  });

  const questionIds = viewHistory.map((history) => Number(history.questionId));

  return {
    props: {
      _questions: questions
        .sort((a, b) => questionIds.indexOf(a.id) - questionIds.indexOf(b.id))
        .map((question) => ({
          ...question,
          createdAt: question.createdAt.toISOString(),
          views: question.views.map((view) => ({
            ...view,
            viewedAt: view.viewedAt.toISOString(),
          })),
        })),
    },
  };
};
