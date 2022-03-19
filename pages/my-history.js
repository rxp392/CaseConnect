import React from "react"
import { getSession } from 'next-auth/react';

export default function MyHistory({ userHistory }) {
    return <div>
      {userHistory.map(History => (
        <li key={History.id}>{History.questionId}</li>
      ))}
    </div>;
  }

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  console.log(session.user.caseId);

  const userHistory = await prisma.History.findMany({
    where: { caseId: session.user.caseId },
  });
  return { props: {userHistory} }
}


MyHistory.auth = true;