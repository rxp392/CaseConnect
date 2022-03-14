import { getSession } from "next-auth/react";
// import prisma from "lib/prisma";

export default function MyQuestions({ userQuestions }) {
  console.log(userQuestions);
  // return <pre>{JSON.stringify(userQuestions, null, 2)}</pre>;

  if (!userQuestions.length) {
    return <div>You haven&apos;t asked any questions yet.</div>;
  }

  return <></>;
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) return { props: {} };

  const userQuestions = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      questions: true,
    },
  });

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

MyQuestions.isProtected = true;
