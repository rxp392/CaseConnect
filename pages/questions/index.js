import prisma from "lib/prisma";
import { useSession, getSession } from "next-auth/react";
import { Wrap, WrapItem, useMediaQuery, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuestionCard from "components/QuestionCard";

export default function Questions({ questions }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLarge] = useMediaQuery("(min-width: 1068px)");

  useEffect(() => {
    if (!questions.length) router.push("/my-courses");
  }, []);

  // useEffect(() => {
  //   if (isSubmitted) {
  //     (async () => {
  //       const { data } = await axios.post("/api/protected/courses/post-many", {
  //         courseIds: tags.map((tag) => Number(tag.id)),
  //         caseId: session.user.caseId,
  //       });
  //       setQuestions(data.questions);
  //       setIsLoading(false);
  //       setShowDrawer(false);
  //     })();
  //   }
  // }, [isSubmitted]);

  return (
    <Wrap
      transform={isLarge ? "translateY(0rem)" : "translateY(10rem)"}
      justify="center"
      spacing="20px"
    >
      {questions.map((question) => (
        <WrapItem key={question.id}>
          <QuestionCard question={question} />
        </WrapItem>
      ))}
    </Wrap>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) return { props: {} };

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
    },
  };
}

Questions.isProtected = true;
