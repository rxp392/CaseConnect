import prisma from "lib/prisma";
import { useSession, getSession } from "next-auth/react";
import { Box, Text, Link, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import CoursesDrawer from "components/CoursesDrawer";
import axios from "axios";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { BiBookAdd } from "react-icons/bi";

export default function Questions({ questions }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showDrawer, setShowDrawer] = useState(!questions.length);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tempQuestions, setTempQuestions] = useState([]);

  useEffect(() => {
    if (isSubmitted) {
      (async () => {
        await axios.post("/api/protected/courses/post-many", {
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

      {!questions.length ? (
        !showDrawer && (
          <Button
            type="submit"
            size="lg"
            bg="cwru"
            color="white"
            colorScheme="black"
            _active={{
              transform: "scale(0.95)",
            }}
            leftIcon={<BiBookAdd />}
            onClick={() => router.push("/my-courses")}
          >
            Choose your courses
          </Button>
        )
      ) : (
        <Box></Box>
      )}
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

Questions.auth = true;
