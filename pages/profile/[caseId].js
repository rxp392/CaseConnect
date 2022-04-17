import { getSession } from "next-auth/react";
import prisma from "lib/prisma";
import ProfileCard from "components/ProfileCard";

export default function UserProfile({ user }) {
  return <ProfileCard user={user} />;
}

export async function getServerSideProps({ params, req, res }) {
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

  try {
    if (session.user.caseId === params.caseId) {
      res.writeHead(302, { Location: "/my-profile" });
      res.end();
      return { props: {} };
    }

    const user = await prisma.user.findUnique({
      where: { caseId: params.caseId },
      select: {
        caseId: true,
        name: true,
        subscription: true,
        accountCreated: true,
        courses: true,
        questions: true,
        answers: true,
        profileImage: true,
        totalQuestions: true,
      },
    });

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
  } catch {
    res.writeHead(302, { Location: "/questions" });
    res.end();
    return { props: {} };
  }
}
