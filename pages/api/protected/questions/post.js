import prisma from "lib/prisma";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

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
    const form = new IncomingForm();

    let questionData = {};

    await new Promise((resolve, _) => {
      form.parse(req, async (__, fields, files) => {
        questionData = { ...fields };

        const attachment = files.attachment;

        const timeStamp = Math.round(Date.now() + Math.random(), 2).toString();

        const filePath = attachment?.originalFilename
          ? path.join(
              __dirname,
              "../../../../../../public/question-attachments",
              `${timeStamp}.jpg`
            )
          : null;

        if (attachment && !fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, fs.readFileSync(attachment.filepath));
        }

        questionData.attachment = timeStamp;

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
      },
    });

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
