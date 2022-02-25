import prisma from "lib/prisma";

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
        updatedAt: question.updatedAt.toISOString(),
      })),
    },
  };
}

Home.auth = true;
