import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { id, question } = req.body;

    await prisma.question.update({
      where: {
        id: Number(id),
      },
      data: {
        question: question.trim(),
      },
    });

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
