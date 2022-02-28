import prisma from "lib/prisma";
import { useSession } from "next-auth/react";

export default function Home({ questions }) {
  return <pre>{JSON.stringify(questions, null, 2)}</pre>;
}

export async function getServerSideProps() {
  const questions = await prisma.question.findMany();

  return {
    props: {
      questions: questions.map((question) => ({
        ...question,
        createdAt: question.createdAt.toISOString(),
      })),
    },
  };
}

Home.auth = true;
