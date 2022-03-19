import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { courseId, caseId } = req.body;

  await prisma.user.update({
    where: { caseId },
    data: {
      courses: {
        disconnect: [{ id: courseId }],
      },
    },
  });

  return res.status(200).json();
}
