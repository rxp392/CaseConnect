import prisma from "lib/prisma";
import { IncomingForm } from "formidable";
import cloudinary from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new IncomingForm();

  let questionData = {};

  await new Promise((resolve, _) => {
    form.parse(req, async (__, fields, files) => {
      questionData = { ...fields };

      const filepath = files.attachment?.filepath;

      if (filepath) {
        const { secure_url } = await cloudinary.v2.uploader.upload(filepath, {
          type: "private",
          folder: "question-attachments",
          public_id: files.attachment.originalFilename,
          invalidate: true,
        });
        questionData.attachment = secure_url;
      }
      resolve();
    });
  });

  await prisma.question.create({
    data: {
      question: questionData.question,
      attachment: questionData.attachment,
      courseId: Number(questionData.courseId),
      courseName: questionData.courseName,
      userCaseId: questionData.caseId,
      publisherName: questionData.publisherName,
      userImage: questionData.userImage,
    },
  });

  return res.status(200).json();
}
