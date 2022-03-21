import prisma from "lib/prisma";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { id, attachment } = req.body;

    await prisma.question.delete({
      where: {
        id: Number(id),
      },
    });

    if (attachment) {
      fs.unlinkSync(
        path.join(
          __dirname,
          "../../../../../../public/question-attachments",
          `${attachment}.jpg`
        )
      );
    }

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
