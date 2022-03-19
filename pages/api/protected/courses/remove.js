import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { courseId, caseId } = req.body;

    await prisma.user.update({
      where: { caseId },
      data: {
        courses: {
          disconnect: [{ id: courseId }],
        },
      },
    });

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
