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
      answer,
      caseId,
      questionId,
      publisherName,
      userCaseId,
      question,
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

    const { answers } = await prisma.user.update({
      where: {
        caseId,
      },
      data: {
        answers: {
          create: {
            answer,
            attachment: secure_url,
            question: { connect: { id: Number(questionId) } },
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
        questionId: Number(questionId),
        courseId: Number(courseId),
      },
    });

    return res.status(200).json({ answerId: id, createdAt });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
