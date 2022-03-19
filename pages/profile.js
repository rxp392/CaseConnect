import { getSession } from "next-auth/react";
export default function Profile({ user }) {
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const user = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      caseId: true,
      name: true,
      image: true,
      subscription: true,
      canAnswer: true,
      browseLimit: true,
      accountCreated: true,
      courses: true,
    },
  });

  if (!user.courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  return {
    props: {
      user: {
        ...user,
        accountCreated: user.accountCreated.toISOString(),
      },
    },
  };
}
