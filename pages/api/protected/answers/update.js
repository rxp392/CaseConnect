import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { id, answer, userCaseId, caseId, publisherName } = req.body;
    await prisma.answer.update({
      where: {
        id,
      },
      data: {
        answer: answer.trim(),
      },
    });

    await prisma.notification.create({
      data: {
        type: "update",
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
