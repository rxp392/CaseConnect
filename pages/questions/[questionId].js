import prisma from "lib/prisma";
import { useRouter } from "next/router";
import Loader from "components/Loader";
import { useSession, getSession } from "next-auth/react";
import { useEffect } from "react";

export default function Question({ question }) {
  const router = useRouter();

  useEffect(() => {
    if (!question) router.push("/questions"); 
  }, []);

  if (!question) return null;

  return <div>Question Detail</div>;
}

export async function getServerSideProps({ params, req }) {
  const session = await getSession({ req });

  if (!session) return { props: {} };

  const question = await prisma.question.findUnique({
    where: { id: Number(params.questionId) },
  });

  return { props: { question } };
}

Question.isProtected = true;
