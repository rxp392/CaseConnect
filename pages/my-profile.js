import { getSession } from "next-auth/react";
import prisma from "lib/prisma";
import ProfileCard from "components/ProfileCard";

export default function Profile({ user }) {
  return <ProfileCard user={user} />;
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const user = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      caseId: true,
      name: true,
      subscription: true,
      accountCreated: true,
      courses: true,
      answers: true,
      profileImage: true,
      totalQuestions: true,
      questions: true,
    },
  });

  if (!user.courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  return {
    props: {
      user: {
        ...user,
        answers: user.answers.map((answer) => ({
          ...answer,
          createdAt: answer.createdAt.toISOString(),
        })),
        questions: user.questions.map((question) => ({
          ...question,
          createdAt: question.createdAt.toISOString(),
        })),
        accountCreated: user.accountCreated.toISOString(),
      },
    },
  };
}
