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
    const { id, question } = fields;

    let secure_url;
    if (files.attachment) {
      const { filepath, originalFilename } = files.attachment;
      secure_url = await uploadImage({
        imageToUpload: filepath,
        public_id: originalFilename,
        folder: "question-attachments",
      });
    }

    await prisma.question.update({
      where: {
        id: Number(id),
      },
      data: {
        question: question.trim(),
        attachment: secure_url,
      },
    });

    return res.status(200).json({ secure_url });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
