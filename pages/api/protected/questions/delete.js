import prisma from "lib/prisma";
import deleteImage from "utils/deleteImage";

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
      const public_id = attachment.split("/").slice(-2).join("/").slice(0, -4);

      const questions = await prisma.question.findMany({
        where: {
          attachment: {
            contains: public_id,
          },
        },
      });

      if (!questions.length) {
        await deleteImage({ public_id });
      }
    }

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
