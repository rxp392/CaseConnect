import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const {
      id,
      caseId,
      publisherName,
      userCaseId,
      question,
      questionId,
      courseId,
      isUser,
    } = req.body;
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

    if (!isUser) {
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
                _notification.type === "downvote" &&
                _notification.notifierCaseId === caseId
            )?.id || -1,
        },
        create: {
          type: "downvote",
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

      const upVotes = notifications.filter(
        (_notification) =>
          _notification.answerId === Number(id) &&
          _notification.type === "upvote" &&
          _notification.notifierCaseId === caseId
      );
      if (upVotes.length) {
        await prisma.notification.delete({
          where: {
            id: upVotes[0].id,
          },
        });
      }
    }

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
