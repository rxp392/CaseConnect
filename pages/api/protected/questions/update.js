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

        if (attachment) {
          const fileName =
            questionData.existingAttachment == "null"
              ? Math.round(Date.now() + Math.random(), 2).toString()
              : questionData.existingAttachment;
          const filePath = path.join(
            __dirname,
            "../../../../../../public/question-attachments",
            `${fileName}.jpg`
          );
          fs.writeFileSync(filePath, fs.readFileSync(attachment.filepath));
          questionData.attachment = fileName;
        } else {
          questionData.attachment = null;
        }

        resolve();
      });
    });

    await prisma.question.update({
      where: {
        id: Number(questionData.id),
      },
      data: {
        question: questionData.question.trim(),
        attachment: questionData.attachment,
      },
    });

    return res.status(200).json({ newAttachment: questionData.attachment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
