import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const {
      id,
      answer,
      userCaseId,
      caseId,
      publisherName,
      question,
      questionId,
      courseId,
    } = req.body;
    await prisma.answer.update({
      where: {
        id,
      },
      data: {
        answer: answer.trim(),
      },
    });

    const { notifications } = await prisma.user.findUnique({
      where: {
        caseId: userCaseId,
      },
      include: {
        notifications: true,
      },
    });

    await prisma.notification.upsert({
      where: {
        id:
          notifications.find(
            (_notification) =>
              _notification.answerId === Number(id) &&
              _notification.type === "update"
          )?.id || -1,
      },
      create: {
        type: "update",
        notifierName: publisherName,
        notifierCaseId: caseId,
        userCaseId,
        answerId: Number(id),
        question,
        questionId,
        courseId,
      },
      update: {
        createdAt: new Date(),
      },
    });

    const toDeleteId = notifications.find(
      (notification) => notification.questionId === questionId
    ).id;
    if (toDeleteId) {
      await prisma.notification.delete({
        where: {
          id: toDeleteId,
        },
      });
    }

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
