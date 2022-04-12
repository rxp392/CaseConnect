import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { id, caseId, publisherName, userCaseId } = req.body;
    await prisma.thumbDown.create({
      data: {
        answerId: id,
        userCaseId: caseId,
      },
    });

    await prisma.thumbUp.deleteMany({
      where: {
        userCaseId: caseId,
      },
    });

    await prisma.notification.create({
      data: {
        type: "thumbDown",
        notifierName: publisherName,
        notifierCaseId: userCaseId,
        userCaseId: caseId,
        answerId: Number(id),
      },
    });

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
