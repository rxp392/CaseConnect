import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { courseIds, caseId } = req.body;

  await prisma.user.update({
    where: { caseId },
    data: {
      courses: {
        connect: courseIds.map((courseId) => ({ id: courseId })),
      },
      isFirstLogin: false,
    },
  });

  const questions = await prisma.question.findMany({
    where: {
      courseId: {
        in: courseIds,
      },
    },
  });

  return res.status(200).json({ questions });
}
