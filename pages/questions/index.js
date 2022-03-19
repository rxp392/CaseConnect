import prisma from "lib/prisma";
import { getSession } from "next-auth/react";
import { Wrap, WrapItem, useMediaQuery } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import QuestionCard from "components/QuestionCard";

export default function Questions({ questions }) {
  const router = useRouter();
  const [isLarge] = useMediaQuery("(min-width: 1068px)");

  return (
    <Wrap
      transform={isLarge ? "translateY(0rem)" : "translateY(10rem)"}
      justify="center"
      spacing="20px"
    >
      {questions.map((question) => (
        <WrapItem key={question.id}>
          <QuestionCard question={question} />
        </WrapItem>
      ))}
    </Wrap>
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

  const questions = await prisma.question.findMany({
    where: {
      courseId: {
        in: courses.map((course) => course.id),
      },
    },
  });

  return {
    props: {
      questions: questions?.map((question) => ({
        ...question,
        createdAt: question.createdAt.toISOString(),
      })),
    },
  };
}
