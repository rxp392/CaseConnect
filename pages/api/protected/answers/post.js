import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const {
      answer,
      caseId,
      questionId,
      publisherName,
      userCaseId,
      question,
      courseId,
    } = req.body;
    const { answers } = await prisma.user.update({
      where: {
        caseId,
      },
      data: {
        answers: {
          create: {
            answer,
            question: { connect: { id: questionId } },
            publisherName,
          },
        },
      },
      include: {
        answers: true,
      },
    });

    const { id, createdAt } = answers.slice(-1)[0];

    await prisma.notification.create({
      data: {
        type: "answer",
        notifierName: publisherName,
        notifierCaseId: caseId,
        userCaseId,
        answerId: Number(id),
        createdAt,
        question,
        questionId,
        courseId,
      },
    });

    return res.status(200).json({ answerId: id, createdAt });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
