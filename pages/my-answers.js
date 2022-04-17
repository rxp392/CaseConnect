import prisma from "lib/prisma";
import { getSession } from "next-auth/react";
import { SlideFade, Text, Flex, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import CardPage from "components/CardPage";

export default function MyAnswers({ _questions, courses }) {
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
            You haven&apos;t answered any questions
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
              Answer a question
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
      title={"My Answers"}
      includeAnsweredFilter={false}
      courses={courses}
    />
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const { courses, answers } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      courses: true,
      answers: true,
    },
  });

  if (!courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  const questionIds = answers.map((answer) => Number(answer.questionId));

  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
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
          createdAt: true,
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

  return {
    props: {
      _questions: questions
        .sort(
          (a, b) =>
            new Date(
              b.answers.find(
                (answer) => answer.userCaseId === session.user.caseId
              ).createdAt
            ) -
            new Date(
              a.answers.find(
                (answer) => answer.userCaseId === session.user.caseId
              ).createdAt
            )
        )
        .map((question) => ({
          ...question,
          createdAt: question.createdAt.toISOString(),
          answers: question.answers.map((answer) => ({
            ...answer,
            createdAt: answer.createdAt.toISOString(),
          })),
          views: question.views.map((view) => ({
            ...view,
            viewedAt: view.viewedAt.toISOString(),
          })),
        })),
      courses: courses.filter((course) =>
        questions.some((q) => q.courseId === course.id)
      ),
    },
  };
}
