import prisma from "lib/prisma";
import { useRouter } from "next/router";
import Loader from "components/Loader";
import { useSession, getSession } from "next-auth/react";
import { useEffect } from "react";
import { Image, Box } from "@chakra-ui/react";

export default function Question({ _question }) {
  const {
    id,
    question,
    attachment,
    courseId,
    courseName,
    userCaseId,
    publisherName,
    createdAt,
  } = _question;
  return (
    <>
      {attachment && (
        <Box boxSize="sm">
          <Image src={`/question-attachments/${attachment}.jpg`} />
        </Box>
      )}
      <pre>{JSON.stringify(_question, null, 2)}</pre>
    </>
  );
}

export async function getServerSideProps({ params, req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const { courses, viewHistory } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      courses: true,
      viewHistory: true,
    },
  });

  if (!courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  try {
    const [id, courseId] = params.questionId.split("-");

    if (!courses.some((course) => course.id === Number(courseId))) {
      res.writeHead(302, { Location: "/questions" });
      res.end();
      return { props: {} };
    }

    const question = await prisma.question.findUnique({
      where: { id: Number(id) },
    });

    await prisma.history.upsert({
      where: {
        id:
          viewHistory.find((history) => history.questionId === Number(id))
            ?.id || -1,
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        questionId: Number(id),
        caseId: session.user.caseId,
      },
    });

    return {
      props: {
        _question: {
          ...question,
          createdAt: question.createdAt.toISOString(),
        },
      },
    };
  } catch {
    res.writeHead(302, { Location: "/questions" });
    res.end();
    return { props: {} };
  }
}
