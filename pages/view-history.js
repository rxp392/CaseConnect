import prisma from "lib/prisma";
import { getSession } from "next-auth/react";
import { SlideFade, Text, Flex, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import CardPage from "components/CardPage";

export default function MyHistory({ _questions }) {
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
    <CardPage
      questions={questions}
      setQuestions={setQuestions}
      allQuestions={_questions}
      title={"View History"}
      includeViewedFilter={false}
    />
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
          userCaseId: true,
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
      userImage: true,
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
