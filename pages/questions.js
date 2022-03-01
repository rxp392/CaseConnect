import prisma from "lib/prisma";
import { useSession, getSession } from "next-auth/react";
import { Wrap, WrapItem, useMediaQuery, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import CoursesDrawer from "components/CoursesDrawer";
import axios from "axios";
import { useRouter } from "next/router";
import QuestionCard from "components/QuestionCard";
import { BiBookAdd } from "react-icons/bi";

export default function Questions({ _questions }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showDrawer, setShowDrawer] = useState(!_questions.length);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLarge] = useMediaQuery("(min-width: 1068px)");
  const [questions, setQuestions] = useState(_questions);

  useEffect(() => {
    if (isSubmitted) {
      (async () => {
        const { data } = await axios.post("/api/protected/courses/post-many", {
          courseIds: tags.map((tag) => Number(tag.id)),
          caseId: session.user.caseId,
        });
        setQuestions(data.questions);
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

      <Wrap
        transform={isLarge ? "translateY(0rem)" : "translateY(10rem)"}
        justify="center"
        spacing="20px"
      >
        <WrapItem>
          <QuestionCard />
        </WrapItem>
        <WrapItem>
          <QuestionCard />
        </WrapItem>
        <WrapItem>
          <QuestionCard />
        </WrapItem>
        <WrapItem>
          <QuestionCard />
        </WrapItem>
        <WrapItem>
          <QuestionCard />
        </WrapItem>
        <WrapItem>
          <QuestionCard />
        </WrapItem>
      </Wrap>

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
      )}
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const user = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
  });

  const _questions = await prisma.question.findMany({
    where: {
      courseId: {
        in: user?.courses?.map((course) => course.id),
      },
    },
  });

  return {
    props: {
      _questions: _questions.map((question) => ({
        ...question,
        createdAt: question.createdAt.toISOString(),
      })),
      isFirstLogin: user.isFirstLogin,
    },
  };
}

Questions.auth = true;
