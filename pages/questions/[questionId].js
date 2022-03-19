import prisma from "lib/prisma";
import { useRouter } from "next/router";
import Loader from "components/Loader";
import { useSession, getSession } from "next-auth/react";
import { useEffect } from "react";

export default function Question({ question }) {
  const router = useRouter();

  return <div>Question Detail</div>;
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

  const { questionId } = params;

  if (!courses.some((course) => course.id === questionId)) {
    res.writeHead(302, { Location: "/questions" });
    res.end();
    return { props: {} };
  }

  const question = await prisma.question.findUnique({
    where: { id: Number(questionId) },
  });

  return { props: { question } };
}
