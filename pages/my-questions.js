import { getSession } from "next-auth/react";
// import prisma from "lib/prisma";

export default function MyQuestions({ userQuestions }) {
  console.log(userQuestions);
  return <pre>{JSON.stringify(userQuestions, null, 2)}</pre>;
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  console.log(session.user.caseId);

  const userQuestions = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      questions: true,
    },
  });

  console.log(userQuestions);

  return {
    props: {
      userQuestions:
        userQuestions?.questions.map((question) => ({
          ...question,
          createdAt: question.createdAt.toISOString(),
        })) || [],
    },
  };
}

MyQuestions.auth = true;
