import prisma from "lib/prisma";
import { useSession, getSession } from "next-auth/react";
import {} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import CoursesDrawer from "components/CoursesDrawer";
import axios from "axios";

export default function Home({ questions, isFirstLogin }) {
  const { data: session } = useSession();
  const [showDrawer, setShowDrawer] = useState(isFirstLogin);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tempQuestions, setTempQuestions] = useState([]);

  useEffect(() => {
    if (isSubmitted) {
      (async () => {
        await axios.post("/api/protected/courses/post", {
          courseIds: tags.map((tag) => Number(tag.id)),
          caseId: session.user.caseId,
        });
        setIsLoading(false);
        setShowDrawer(false);
      })();
    }
  }, [isSubmitted]);

  return (
    <>
      <CoursesDrawer
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setIsSubmitted={setIsSubmitted}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        tags={tags}
        setTags={setTags}
        name={session.user.name.split(" ")[0]}
      />
      <pre>{JSON.stringify(tempQuestions || questions, null, 2)}</pre>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const user = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
  });

  const questions = await prisma.question.findMany({
    where: {
      courseId: {
        in: user?.courses?.map((course) => course.id),
      },
    },
  });

  return {
    props: {
      questions: questions.map((question) => ({
        ...question,
        createdAt: question.createdAt.toISOString(),
      })),
      isFirstLogin: user.isFirstLogin,
    },
  };
}

Home.auth = true;
