import prisma from "lib/prisma";
import { getSession } from "next-auth/react";
import { SlideFade, Text, Flex, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import CardPage from "components/CardPage";

export default function Questions({ _questions }) {
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
            No questions have been posted 😥
          </Text>
          <NextLink passHref href="/ask-a-question">
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
              Ask a question
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
      title={"Questions"}
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

  const { courses } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      courses: true,
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

  return {
    props: {
      _questions: allQuestions
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        )
        .sort((a, b) => b.createdAt - a.createdAt)
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
}
