import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { courseIds, caseId } = req.body;

  await prisma.user.update({
    where: { caseId },
    data: {
      courses: {
        connect: courseIds,
      },
    },
  });

  return res.status(200).json();
}
