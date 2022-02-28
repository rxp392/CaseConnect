import { getSession } from "next-auth/react";
// import prisma from "lib/prisma";

export default function Questions({ userQuestions }) {
  console.log(userQuestions);
  return <pre>{JSON.stringify(userQuestions, null, 2)}</pre>;
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  console.log(session);

  const { questions } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      questions: true,
    },
  });

  return {
    props: {
      userQuestions: questions.map((question) => ({
        ...question,
        createdAt: question.createdAt.toISOString(),
      })),
    },
  };
}

Questions.auth = true;
