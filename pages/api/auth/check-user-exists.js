import prisma from "lib/prisma";

export default async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { caseID } = req.body;

  console.log(typeof caseID === "string");

  const user = await prisma.user.findUnique({
    where: {
      caseID,
    },
  });

  return res.json({ userExists: !!user });
}
