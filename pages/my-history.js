import React from "react";
import { getSession } from "next-auth/react";

export default function MyHistory({ userHistory }) {
  return (
    <div>
      {userHistory.map((History) => (
        <li key={History.id}>{History.questionId}</li>
      ))}
    </div>
  );
}

export const getServerSideProps = async ({ req, res }) => {
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

  const userHistory = await prisma.history.findMany({
    where: { caseId: session.user.caseId },
  });
  return { props: { userHistory } };
};
