import prisma from "lib/prisma";
import { useRouter } from "next/router";
import Loader from "components/Loader";

export default function Question({ question }) {
  const router = useRouter();

  if (router.isFallback) return <Loader />;

  return <div>Question Detail</div>;
}

export async function getStaticPaths() {
  const questions = await prisma.question.findMany();

  const paths = questions.map((question) => ({
    params: { id: question.id },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
  });

  return { props: { question } };
}

Question.auth = true;
