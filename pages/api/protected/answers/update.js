import prisma from "lib/prisma";
import getImage from "utils/getImage";
import uploadImage from "utils/uploadImage";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { fields, files } = await getImage(req);
    const {
      id,
      answer,
      userCaseId,
      caseId,
      publisherName,
      question,
      questionId,
      courseId,
    } = fields;

    let secure_url;
    if (files.attachment) {
      const { filepath, originalFilename } = files.attachment;
      secure_url = await uploadImage({
        imageToUpload: filepath,
        public_id: originalFilename,
        folder: "answer-attachments",
      });
    }

    await prisma.answer.update({
      where: {
        id: Number(id),
      },
      data: {
        answer: answer.trim(),
        attachment: secure_url,
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
        questionId: Number(questionId),
        courseId: Number(courseId),
      },
      update: {
        createdAt: new Date(),
      },
    });

    const toDeleteId = notifications.find(
      (notification) => notification.questionId === questionId
    )?.id;
    if (toDeleteId) {
      await prisma.notification.delete({
        where: {
          id: Number(toDeleteId),
        },
      });
    }

    return res.status(200).json({ secure_url });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
