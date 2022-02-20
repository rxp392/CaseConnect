import prisma from "lib/prisma";

export default async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const user = await prisma.user.findUnique({
    where: {
      caseID: req.body.caseID,
    },
  });

  return res.json({ userExists: !!user });
}
