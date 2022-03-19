import { getSession } from "next-auth/react";
// import prisma from "lib/prisma";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function MyQuestions({ questions, courses }) {
  const router = useRouter();
  return <div>my questions</div>;
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

  return {
    props: {
      courses,
      questions: questions.map((question) => ({
        ...question,
        createdAt: question.createdAt.toISOString(),
      })),
    },
  };
}
